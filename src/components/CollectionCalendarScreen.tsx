import React from 'react'
import { StyleSheet } from 'react-native'
import { Content, Spinner } from 'native-base'
import HomeForm from './HomeForm'
import Summary from './Summary'
import Calendar from './Calendar'
import ErrorCard from './ErrorCard'
import RecyclingDateModel from '../models/RecyclingDateModel'
import { connect } from 'react-redux'
import AppState from '../redux/state'

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#222831',
  },
})

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

  showSpinnerIfNeeded() {
    if (this.props.isLoading) {
      return <Spinner />
    }
  }

  render() {
    return (
      <Content style={StyleSheet.flatten(styles.page)}>
        <HomeForm homeAddress={this.props.homeAddress} />
        <ErrorCard error={this.props.error} />
        {this.showSpinnerIfNeeded()}
        <Summary recyclingData={this.props.recyclingData} hasError={this.props.error != ''} />
        <Calendar recyclingData={this.props.recyclingData} hasError={this.props.error != ''} />
      </Content>
    )
  }
}

export default connect(mapStateToProps)(CollectionCalendarScreenBase)
