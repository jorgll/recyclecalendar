import React from 'react'
import { Content, Text, ListItem, Right, Icon } from 'native-base'
import axios from 'axios'
import { HomeForm } from './HomeForm'
import { Summary } from './Summary'
import { Calendar } from './Calendar'
import { ErrorCard } from './ErrorCard'
import RecyclingDateModel from '../models/RecyclingDateModel'

interface CollectionCalendarScreenState {
  recyclingData: RecyclingDateModel[]
  isLoading: boolean
  error: string
}

type Props = {}
export class CollectionCalendarScreen extends React.Component<
  Props,
  CollectionCalendarScreenState
> {
  seattleRecyclingBaseUri: string =
    'https://www.seattle.gov/UTIL/WARP/CollectionCalendar/GetCollectionDays'
  seattleRectyclingQueryUri: string =
    'pAccount=&pAddress={{HOME_ADDRESS}}&pJustChecking=&pApp=CC&pIE=&start={{START_DATE}}'

  constructor(props: any) {
    super(props)
    this.onButtonPress = this.onButtonPress.bind(this)
    this.state = {
      recyclingData: new Array(),
      isLoading: false,
      error: '',
    }
  }

  constructQueryUri(homeAddress: string) {
    const escapedHomeAddress: string = escape(homeAddress)
    const currentUtcDateTimeInSeconds: number = Math.floor(new Date().getTime() / 1000)
    const query = this.seattleRectyclingQueryUri
      .replace('{{HOME_ADDRESS}}', escapedHomeAddress)
      .replace('{{START_DATE}}', currentUtcDateTimeInSeconds.toString())

    const uri = `${this.seattleRecyclingBaseUri}?${query}`
    console.log(uri)
    return uri
  }

  onButtonPress(homeAddress: string): void {
    this.setState({ isLoading: true, error: '', recyclingData: [] })
    console.log('Getting data from Seattle Recycling...')
    axios
      .get(this.constructQueryUri(homeAddress))
      .then(response => {
        console.log(response.data)

        if (response.data[0] && response.data[0].status != null) {
          this.setState({ error: response.data[0].status, isLoading: false })
          console.log('Error looking for address')
        } else {
          this.setState({ recyclingData: response.data, isLoading: false })
        }
        console.log(this.state)
      })
      .catch(e => {
        this.setState({
          error: 'Could not get recycling data from Seattle Public Utilities. Try again later.',
        })
        console.log(e)
      })
  }

  renderIconIfNeeded(d: RecyclingDateModel) {
    if (d.Recycling) {
      return <Icon name="repeat" />
    } else {
      return <Icon name="close" />
    }
  }

  render() {
    return (
      <Content>
        <HomeForm onSubmit={this.onButtonPress} />
        <ErrorCard error={this.state.error} />
        <Summary
          isLoading={this.state.isLoading}
          recyclingData={this.state.recyclingData}
          hasError={this.state.error != ''}
        />
        <Calendar recyclingData={this.state.recyclingData} hasError={this.state.error != ''} />
      </Content>
    )
  }
}
