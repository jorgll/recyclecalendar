import axios from 'axios'
import { Dispatch } from 'redux'
import {
  ADDRESS_CHANGED,
  FETCH_RECYCLE_DATA,
  FETCH_RECYCLE_DATA_SUCCESS,
  FETCH_RECYCLE_DATA_FAIL,
} from './types'
import RecyclingDateModel from '../models/RecyclingDateModel'

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
    axios
      .get(constructQueryUri(address))
      .then(response => {
        console.log('HTTP Response: ')
        console.log(response.data)
        if (response.data[0] && response.data[0].status != null) {
          console.log('Recycle data HTTP GET successful but address not found')
          fetchRecycleDataFail(dispatch, response.data[0].status)
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

// Service Call Helpers

const seattleRecyclingBaseUri: string =
  'https://www.seattle.gov/UTIL/WARP/CollectionCalendar/GetCollectionDays'
const seattleRectyclingQueryUri: string =
  'pAccount=&pAddress={{HOME_ADDRESS}}&pJustChecking=&pApp=CC&pIE=&start={{START_DATE}}'

function constructQueryUri(homeAddress: string) {
  const escapedHomeAddress: string = escape(homeAddress)
  const currentUtcDateTimeInSeconds: number = Math.floor(new Date().getTime() / 1000)
  const query = seattleRectyclingQueryUri
    .replace('{{HOME_ADDRESS}}', escapedHomeAddress)
    .replace('{{START_DATE}}', currentUtcDateTimeInSeconds.toString())

  const uri = `${seattleRecyclingBaseUri}?${query}`
  console.log('HTTP Request: ' + uri)
  return uri
}
