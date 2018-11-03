import React from 'react'
import { Content, Text, ListItem, Right, Icon } from 'native-base'
import axios from 'axios'
import { HomeForm } from './HomeForm'
import { Summary } from './Summary'
import RecyclingDateModel from '../models/RecyclingDateModel'
import { Calendar } from './Calendar'

interface CollectionCalendarScreenState {
  recyclingData: RecyclingDateModel[]
  isLoading: boolean
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
    }
  }

  constructQueryUri(homeAddress: string) {
    const escapedHomeAddress: string = escape(homeAddress)
    const currentUtcDateTimeInSeconds: number = Math.floor(
      new Date().getTime() / 1000
    )
    const query = this.seattleRectyclingQueryUri
      .replace('{{HOME_ADDRESS}}', escapedHomeAddress)
      .replace('{{START_DATE}}', currentUtcDateTimeInSeconds.toString())

    const uri = `${this.seattleRecyclingBaseUri}?${query}`
    console.log(uri)
    return uri
  }

  onButtonPress(homeAddress: string): void {
    this.setState({ isLoading: true })
    console.log('Getting data from Seattle Recycling...')
    axios.get(this.constructQueryUri(homeAddress)).then(response => {
      console.log(response.data)
      this.setState({ recyclingData: response.data, isLoading: false })
      console.log(this.state)
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
        <Summary
          isLoading={this.state.isLoading}
          recyclingData={this.state.recyclingData}
          hasError={false}
        />
        <Calendar recyclingData={this.state.recyclingData} hasError={false} />
      </Content>
    )
  }
}
