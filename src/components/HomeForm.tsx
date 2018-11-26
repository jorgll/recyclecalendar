import React from 'react'
import { StyleSheet, Keyboard } from 'react-native'
import { Card, Form, Item, Input, Label, Button, Text } from 'native-base'
import { connect } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'
import { addressChanged, fetchRecycleData } from '../redux/actions'

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
}

const mapDispatchToProps = (dispatch: Dispatch) => {
  return bindActionCreators(
    {
      addressChanged,
      fetchRecycleData,
    },
    dispatch
  )
}

class HomeFormBase extends React.Component<HomeFormProps> {
  constructor(props: HomeFormProps) {
    super(props)
  }

  onHomeAddressChange(text: string): void {
    this.props.addressChanged(text)
  }

  onSubmitButtonPressed(): void {
    Keyboard.dismiss()
    this.props.fetchRecycleData(this.props.homeAddress)
  }

  render() {
    return (
      <Card style={StyleSheet.flatten(styles.card)}>
        <Form style={StyleSheet.flatten(styles.form)}>
          <Item stackedLabel>
            <Label style={StyleSheet.flatten(styles.label)}>Home address:</Label>
            <Input
              style={StyleSheet.flatten(styles.label)}
              value={this.props.homeAddress}
              placeholder={'Enter your home address'}
              onChangeText={this.onHomeAddressChange.bind(this)}
            />
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