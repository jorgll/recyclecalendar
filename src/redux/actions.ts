import axios from 'axios'
import { Dispatch } from 'redux'
import {
  ADDRESS_CHANGED,
  FETCH_RECYCLE_DATA,
  FETCH_RECYCLE_DATA_SUCCESS,
  FETCH_RECYCLE_DATA_FAIL,
} from './types'
import RecyclingDateModel from '../models/RecyclingDateModel'
import { SearchAddressResponse, SearchAddressResult } from '../models/AzureMaps'
import { AzureMapsApiKey } from '../keys'

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
      .get(constructAzureMapsQueryUri(normalizedAddress), { timeout: 3000 })
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
              fetchRecycleDataFail(dispatch, 'Could not find Seattle homes with this address.')
            } else if (response.data[0] && response.data[0].end == 'Multiple Premises') {
              console.log('Multi-tenant building or incomplete home address input')
              fetchRecycleDataFail(
                dispatch,
                'Multiple homes found with this address, please try a more specific search.'
              )
            } else {
              fetchRecycleDataSuccess(dispatch, response.data)
            }
          })
          .catch(e => {
            fetchRecycleDataFail(
              dispatch,
              'Could not get recycling data from Seattle Public Utilities. Try again later.'
            )
          })
      })
      .catch(e => {
        fetchRecycleDataFail(dispatch, 'Could not find Seattle homes with this address.')
      })
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
  'https://www.seattle.gov/UTIL/WARP/CollectionCalendar/GetCollectionDays'
const seattleRecyclingQueryUri: string =
  'pAccount=&pAddress={{HOME_ADDRESS}}&pJustChecking=&pApp=CC&pIE=&start={{START_DATE}}'

function constructSeattleRecyclingQueryUri(homeAddress: string) {
  const currentUtcDateTimeInSeconds: number = Math.floor(new Date().getTime() / 1000)
  const query = seattleRecyclingQueryUri
    .replace('{{HOME_ADDRESS}}', homeAddress)
    .replace('{{START_DATE}}', currentUtcDateTimeInSeconds.toString())

  const uri = `${seattleRecyclingBaseUri}?${query}`
  console.log('HTTP Request: ' + uri)
  return uri
}

// Azure Maps Service Call Helpers

const azureMapsBaseUri: string = 'https://atlas.microsoft.com/search/address/json'
const azureMapsQueryUri: string =
  'api-version=1.0&subscription-key={{API_KEY}}&query={{HOME_ADDRESS}}&countrySet=US'

function constructAzureMapsQueryUri(homeAddress: string) {
  const query = azureMapsQueryUri
    .replace('{{HOME_ADDRESS}}', homeAddress)
    .replace('{{API_KEY}}', AzureMapsApiKey)

  const uri = `${azureMapsBaseUri}?${query}`
  console.log('HTTP Request: ' + uri)
  return uri
}
