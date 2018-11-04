import React from 'react'
import { Content, Text } from 'native-base'
import HomeForm from './HomeForm'
import Summary from './Summary'
import Calendar from './Calendar'
import ErrorCard from './ErrorCard'
import RecyclingDateModel from '../models/RecyclingDateModel'
import { connect } from 'react-redux'
import AppState from '../redux/state'

interface CollectionCalendarScreenProps {
  homeAddress: string
  isLoading: boolean
  error: string
  recyclingData: RecyclingDateModel[]
}

const mapStateToProps = (state: AppState) => ({
  homeAddress: state.homeAddress,
  isLoading: state.isLoading,
  error: state.error,
  recyclingData: state.recyclingData,
})

class CollectionCalendarScreenBase extends React.Component<CollectionCalendarScreenProps> {
  constructor(props: CollectionCalendarScreenProps) {
    super(props)
  }

  render() {
    return (
      <Content>
        <HomeForm homeAddress={this.props.homeAddress} />
        <ErrorCard error={this.props.error} />
        <Summary
          isLoading={this.props.isLoading}
          recyclingData={this.props.recyclingData}
          hasError={this.props.error != ''}
        />
        <Calendar recyclingData={this.props.recyclingData} hasError={this.props.error != ''} />
      </Content>
    )
  }
}

export default connect(mapStateToProps)(CollectionCalendarScreenBase)
