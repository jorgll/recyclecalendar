import React from 'react'
import { StyleSheet, Keyboard } from 'react-native'
import { Card, Form, Item, Input, Label, Button, Text, Icon } from 'native-base'
import { connect } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'
import { addressChanged, fetchRecycleData, getLocalAddress } from '../redux/actions'
import Analytics from 'appcenter-analytics'

const styles = StyleSheet.create({
  card: {
    minHeight: 180,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 20,
    padding: 10,
    backgroundColor: '#222831',
    borderColor: '#f5f5f5',
  },
  form: {
    paddingBottom: 20,
  },
  button: {
    alignSelf: 'center',
    backgroundColor: '#005691',
    color: '#f5f5f5',
  },
  label: {
    color: '#f5f5f5',
  },
})

interface HomeFormProps {
  homeAddress: string
  addressChanged: (address: string) => void
  fetchRecycleData: (address: string) => void
  getLocalAddress: () => void
}

interface HomeFormState {
  isInputFocused: boolean
}

const mapDispatchToProps = (dispatch: Dispatch) => {
  return bindActionCreators(
    {
      addressChanged,
      fetchRecycleData,
      getLocalAddress,
    },
    dispatch
  )
}

class HomeFormBase extends React.Component<HomeFormProps, HomeFormState> {
  constructor(props: HomeFormProps) {
    super(props)
    this.state = { isInputFocused: false }
  }

  onHomeAddressChange(text: string): void {
    this.props.addressChanged(text)
  }

  onSubmitButtonPressed(): void {
    Keyboard.dismiss()
    Analytics.trackEvent('LookupRecyclingDatesButtonClick')
    this.props.fetchRecycleData(this.props.homeAddress)
  }

  onGpsButtonPressed(): void {
    Analytics.trackEvent('LookupGpsAddressButtonClick')
    this.props.getLocalAddress()
  }

  onClearButtonPressed(): void {
    Analytics.trackEvent('ClearAddressButtonClick')
    this.onHomeAddressChange('')
  }

  onInputFocus(): void {
    this.setState({ isInputFocused: true })
  }

  onInputBlur(): void {
    this.setState({ isInputFocused: false })
  }

  render() {
    return (
      <Card style={StyleSheet.flatten(styles.card)}>
        <Form style={StyleSheet.flatten(styles.form)}>
          <Item stackedLabel>
            <Label style={StyleSheet.flatten(styles.label)}>Home address:</Label>
            <Item>
              <Input
                style={StyleSheet.flatten(styles.label)}
                value={this.props.homeAddress}
                placeholder={'Enter your home address'}
                onChangeText={this.onHomeAddressChange.bind(this)}
                onFocus={this.onInputFocus.bind(this)}
                onBlur={this.onInputBlur.bind(this)}
              />
              {this.state.isInputFocused && (
                <Icon
                  name="close-circle"
                  style={StyleSheet.flatten(styles.label)}
                  onPress={this.onClearButtonPressed.bind(this)}
                />
              )}
              <Icon
                name="navigate"
                style={StyleSheet.flatten(styles.label)}
                onPress={this.onGpsButtonPressed.bind(this)}
              />
            </Item>
          </Item>
        </Form>
        <Button
          onPress={this.onSubmitButtonPressed.bind(this)}
          style={StyleSheet.flatten(styles.button)}
        >
          <Text>Lookup recycling dates</Text>
        </Button>
      </Card>
    )
  }
}

export default connect(
  null,
  mapDispatchToProps
)(HomeFormBase)
