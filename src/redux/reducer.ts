import AppState from './state'
import { AnyAction } from 'redux'
import {
  ADDRESS_CHANGED,
  FETCH_RECYCLE_DATA,
  FETCH_RECYCLE_DATA_SUCCESS,
  FETCH_RECYCLE_DATA_FAIL,
} from './types'

// Reducer

const INITIAL_STATE: AppState = {
  homeAddress: '',
  isLoading: false,
  error: '',
  recyclingData: [],
}

export default (state: AppState = INITIAL_STATE, action: AnyAction) => {
  switch (action.type) {
    case ADDRESS_CHANGED:
      return {
        homeAddress: action.payload,
        isLoading: false,
        error: '',
        recyclingData: [],
      }
    case FETCH_RECYCLE_DATA:
      return {
        homeAddress: state.homeAddress,
        isLoading: true,
        error: '',
        recyclingData: [],
      }
    case FETCH_RECYCLE_DATA_SUCCESS:
      return {
        homeAddress: state.homeAddress,
        isLoading: false,
        error: '',
        recyclingData: action.payload,
      }
    case FETCH_RECYCLE_DATA_FAIL:
      return {
        homeAddress: state.homeAddress,
        isLoading: false,
        error: action.payload,
        recyclingData: [],
      }
    default:
      return state
  }
}
