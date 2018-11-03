import React from 'react'
import { StyleSheet } from 'react-native'
import { Card, Text, Spinner, H1 } from 'native-base'
import moment from 'moment'
import RecyclingDateModel from '../models/RecyclingDateModel'

const styles = StyleSheet.create({
  card: {
    minHeight: 150,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 20,
    padding: 10,
  },
})

interface SummaryProps {
  isLoading: boolean
  hasError: boolean
  recyclingData: RecyclingDateModel[]
}

export class Summary extends React.Component<SummaryProps> {
  constructor(props: any) {
    super(props)
  }

  showSpinnerIfNeeded() {
    if (this.props.isLoading && !this.props.hasError) {
      return <Spinner />
    }
  }

  renderDaysLeft() {
    if (this.props.recyclingData.length > 0) {
      let smallestDelta: number = 60
      let smallestMoment: moment.Moment = moment()
      this.props.recyclingData.map(day => {
        let m = moment(day.start, 'ddd, DD MMM YYYY')
        let days = m.diff(moment(), 'days')
        console.log('Evaluating moment: ' + m.toDate())
        if (day.Recycling && days < smallestDelta) {
          console.log(
            `Is Smallest = true. Days = ${days}, smallestDelta = ${smallestDelta}`
          )
          smallestDelta = days
          smallestMoment = m
        }
      })

      const timeUntilRecycle: string = moment(smallestMoment).calendar(
        undefined,
        {
          sameDay: '[Today]',
          nextDay: '[Tomorrow]',
          nextWeek: 'dddd',
          sameElse: 'MMM DD',
        }
      )
      console.log(timeUntilRecycle)
      return <H1>Recycling comes: {timeUntilRecycle}</H1>
    }
  }

  render() {
    if (this.props.recyclingData.length == 0) return null

    return (
      <Card style={StyleSheet.flatten(styles.card)}>
        {this.showSpinnerIfNeeded()}
        {this.renderDaysLeft()}
      </Card>
    )
  }
}
