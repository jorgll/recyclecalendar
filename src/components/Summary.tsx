import React from 'react'
import { StyleSheet } from 'react-native'
import { Card, Text, Spinner, H1 } from 'native-base'
import moment from 'moment'
import RecyclingDateModel from '../models/RecyclingDateModel'

const styles = StyleSheet.create({
  card: {
    minHeight: 120,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 20,
    padding: 10,
    backgroundColor: '#222831',
    borderColor: '#f5f5f5',
  },
  text: {
    color: '#f5f5f5',
  },
})

interface SummaryProps {
  isLoading: boolean
  hasError: boolean
  recyclingData: RecyclingDateModel[]
}

export default class Summary extends React.Component<SummaryProps> {
  constructor(props: any) {
    super(props)
  }

  showSpinnerIfNeeded() {
    if (this.props.isLoading) {
      return <Spinner />
    }
  }

  renderDaysLeft() {
    if (this.props.recyclingData.length > 0 && !this.props.hasError) {
      let smallestDelta: number = 60
      let smallestMoment: moment.Moment = moment()
      this.props.recyclingData.map(day => {
        let m = moment(day.start, 'ddd, DD MMM YYYY')
        let days = m.diff(moment(), 'days')
        if (day.Recycling && days < smallestDelta) {
          smallestDelta = days
          smallestMoment = m
        }
      })

      const timeUntilRecycle: string = moment(smallestMoment).calendar(undefined, {
        sameDay: '[Today]',
        nextDay: '[Tomorrow]',
        nextWeek: 'dddd',
        sameElse: 'dddd, MMM DD',
      })
      return <H1 style={StyleSheet.flatten(styles.text)}>Next visit: {timeUntilRecycle}</H1>
    }
  }

  render() {
    if (this.props.recyclingData.length == 0 || this.props.hasError) return null

    return (
      <Card style={StyleSheet.flatten(styles.card)}>
        {this.showSpinnerIfNeeded()}
        {this.renderDaysLeft()}
      </Card>
    )
  }
}
