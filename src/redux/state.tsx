import RecyclingDateModel from '../models/RecyclingDateModel'

export default class AppState {
  homeAddress: string = ''
  isLoading: boolean = false
  error: string = ''
  recyclingData: RecyclingDateModel[] = []
}
