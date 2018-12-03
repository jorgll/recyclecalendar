import axios from 'axios'
import { Dispatch } from 'redux'
import {
  ADDRESS_CHANGED,
  FETCH_RECYCLE_DATA,
  FETCH_RECYCLE_DATA_SUCCESS,
  FETCH_RECYCLE_DATA_FAIL,
  GET_LOCAL_COORDINATES,
  GET_LOCAL_COORDINATES_COMPLETED,
} from './types'
import RecyclingDateModel from '../models/RecyclingDateModel'
import { SearchAddressResponse, SearchAddressResult } from '../models/AzureMaps'
import { AzureMapsApiKey } from '../keys'
import PushNotification from 'react-native-push-notification'
import moment from 'moment'
import Analytics from 'appcenter-analytics'

// Action Creators

export const addressChanged = (text: string) => {
  return {
    type: ADDRESS_CHANGED,
    payload: text,
  }
}

export const fetchRecycleData = (address: string) => {
  return (dispatch: Dispatch) => {
    dispatch({ type: FETCH_RECYCLE_DATA, payload: null })

    // Start with a simple escaped address
    let normalizedAddress = escape(address)

    // Try to normalize the address with Azure Maps
    axios
      .get(constructAzureMapsQueryUriForStreetAddress(normalizedAddress), { timeout: 3000 })
      .then(response => {
        console.log('HTTP Response from Azure Maps: ')
        console.log(response.data)
        const searchAddressResponse: SearchAddressResponse = response.data
        if (searchAddressResponse.summary.numResults > 0) {
          // Filter to only King County, WA point addresses (no places of interest or landmarks)
          const matchingAddresses: SearchAddressResult[] = searchAddressResponse.results.filter(
            r =>
              r.type == 'Point Address' &&
              r.address.countrySecondarySubdivision == 'King' &&
              r.address.countrySubdivision == 'WA'
          )
          if (matchingAddresses.length > 0) {
            // Best new address found, keep this one
            normalizedAddress = `${matchingAddresses[0].address.streetNumber} ${
              matchingAddresses[0].address.streetName
            }`
            console.log('New best address: ' + normalizedAddress)
            Analytics.trackEvent('AzureMapsAddressMatch')
          }
        }

        // Query Seattle Recycling
        axios
          .get(constructSeattleRecyclingQueryUri(normalizedAddress), { timeout: 5000 })
          .then(response => {
            console.log('HTTP Response: ')
            console.log(response.data)
            if (response.data[0] && response.data[0].status != null) {
              console.log('Recycle data HTTP GET successful but address not found')
              Analytics.trackEvent('SeattleRecyclingAddressNotFound')
              fetchRecycleDataFail(dispatch, 'Could not find Seattle homes with this address.')
            } else if (response.data[0] && response.data[0].end == 'Multiple Premises') {
              console.log('Multi-tenant building or incomplete home address input')
              Analytics.trackEvent('SeattleRecyclingMultipleHomesFound')
              fetchRecycleDataFail(
                dispatch,
                'Multiple homes found with this address, please try a more specific search.'
              )
            } else {
              const nextAvailableDate: moment.Moment = getClosestRecycleCollectionMoment(
                response.data
              )
              console.log('Closest recycle collection  moment: ' + nextAvailableDate.toString())

              // Schedule notification toasts the night before recycling
              scheduleLocalNotification(nextAvailableDate.subtract(4, 'hours').toDate())

              Analytics.trackEvent('SeattleRecyclingHttpSuccess')
              fetchRecycleDataSuccess(dispatch, response.data)
            }
          })
          .catch(e => {
            Analytics.trackEvent('SeattleRecyclingHttpFail', e.message)
            fetchRecycleDataFail(
              dispatch,
              'Could not get recycling data from Seattle Public Utilities. Try again later.'
            )
          })
      })
      .catch(e => {
        Analytics.trackEvent('AzureMapsHttpFail', e.message)
        fetchRecycleDataFail(dispatch, 'Could not find Seattle homes with this address.')
      })
  }
}

export const getLocalAddress = () => {
  return (dispatch: Dispatch) => {
    dispatch({ type: GET_LOCAL_COORDINATES, payload: null })
    navigator.geolocation.getCurrentPosition(position => {
      axios
        .get(
          constructAzureMapsQueryUriForCoordinates(
            position.coords.latitude,
            position.coords.longitude
          ),
          { timeout: 5000 }
        )
        .then(response => {
          console.log('HTTP Response: ')
          console.log(response.data)
          if (response.data.summary.numResults > 0) {
            console.log(
              'Current Address: ' + response.data.addresses[0].address.streetNameAndNumber
            )
            dispatch({
              type: GET_LOCAL_COORDINATES_COMPLETED,
              payload: response.data.addresses[0].address.streetNameAndNumber,
            })
          }
        })
    }),
      error => Analytics.trackEvent('GpsCoordinateReadFail', error.message),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
  }
}

// Action Creator Helpers

const fetchRecycleDataSuccess = (dispatch: Dispatch, data: RecyclingDateModel[]) => {
  dispatch({
    type: FETCH_RECYCLE_DATA_SUCCESS,
    payload: data,
  })
}

const fetchRecycleDataFail = (dispatch: Dispatch, error: string) => {
  dispatch({
    type: FETCH_RECYCLE_DATA_FAIL,
    payload: error,
  })
}

// Seattle Recycling Service Call Helpers

const seattleRecyclingBaseUri: string =
  'https://www.seattle.gov/UTIL/WARP/CollectionCalendar/GetCollectionDays?'
const seattleRecyclingQueryUri: string =
  'pAccount=&pAddress={{HOME_ADDRESS}}&pJustChecking=&pApp=CC&pIE=&start={{START_DATE}}'

function constructSeattleRecyclingQueryUri(homeAddress: string) {
  const currentUtcDateTimeInSeconds: number = Math.floor(new Date().getTime() / 1000)
  const query = seattleRecyclingQueryUri
    .replace('{{HOME_ADDRESS}}', homeAddress)
    .replace('{{START_DATE}}', currentUtcDateTimeInSeconds.toString())

  const uri = `${seattleRecyclingBaseUri}${query}`
  console.log('HTTP Request: ' + uri)
  return uri
}

// Date processing Helpers

function getClosestRecycleCollectionMoment(data: RecyclingDateModel[]): moment.Moment {
  let smallestMoment: moment.Moment = moment()
  if (data.length > 0) {
    let smallestDelta: number = 60
    data.map(day => {
      let m = moment(day.start, 'ddd, DD MMM YYYY')
      let days = m.diff(moment(), 'days')
      if (day.Recycling && days < smallestDelta) {
        smallestDelta = days
        smallestMoment = m
      }
    })
  }
  return smallestMoment
}

// Azure Maps Service Call Helpers

const azureMapsBaseUri: string = 'https://atlas.microsoft.com/search/address/'
const azureMapsQueryUriForStreetAddress: string =
  'json?api-version=1.0&subscription-key={{API_KEY}}&query={{HOME_ADDRESS}}&countrySet=US'
const azureMapsQueryUriForCoordinates: string =
  'reverse/json?api-version=1.0&subscription-key={{API_KEY}}&query={{LATITUDE}},{{LONGITUDE}}'

function constructAzureMapsQueryUriForStreetAddress(homeAddress: string) {
  const query = azureMapsQueryUriForStreetAddress
    .replace('{{HOME_ADDRESS}}', homeAddress)
    .replace('{{API_KEY}}', AzureMapsApiKey)

  const uri = `${azureMapsBaseUri}${query}`
  console.log('HTTP Request: ' + uri)
  return uri
}

function constructAzureMapsQueryUriForCoordinates(latitude: number, longitude: number) {
  const query = azureMapsQueryUriForCoordinates
    .replace('{{LATITUDE}}', latitude.toString())
    .replace('{{LONGITUDE}}', longitude.toString())
    .replace('{{API_KEY}}', AzureMapsApiKey)

  const uri = `${azureMapsBaseUri}${query}`
  console.log('HTTP Request: ' + uri)
  return uri
}

// Local notification schedule helpers

const TWO_WEEKS: number = 1000 * 60 * 60 * 24 * 14
function scheduleLocalNotification(date: Date): void {
  console.log('Scheduling notification for ' + date.toString())
  PushNotification.localNotificationSchedule({
    title: 'Seattle Recycling Calendar',
    message: 'Recycling comes tomorrow! Remember to take out the recycle bin.',
    date: date,
    id: '123',
    userInfo: { id: '123' },
    vibrate: true,
    repeatType: 'time',
    repeatTime: TWO_WEEKS,
  })
}
