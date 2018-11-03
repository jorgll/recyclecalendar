import React from 'react'
import { StyleSheet } from 'react-native'
import { Card, Form, Item, Input, Label, Button, Text } from 'native-base'

const styles = StyleSheet.create({
  card: {
    minHeight: 180,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 20,
    padding: 10,
  },
  form: {
    paddingBottom: 20,
  },
  button: {
    alignSelf: 'center',
  },
})

interface HomeFormProps {
  onSubmit: (address: string) => void
}

interface HomeFormState {
  homeAddress: string
}

export class HomeForm extends React.Component<HomeFormProps, HomeFormState> {
  constructor(props: any) {
    super(props)
    this.state = { homeAddress: '' }
  }

  onHomeAddressChangeInternal(text: string): void {
    console.log(this.state)
    this.setState({ homeAddress: text })
  }

  render() {
    return (
      <Card style={StyleSheet.flatten(styles.card)}>
        <Form style={StyleSheet.flatten(styles.form)}>
          <Item stackedLabel>
            <Label>Home address:</Label>
            <Input
              value={this.state.homeAddress}
              placeholder={'Enter your home address'}
              onChangeText={this.onHomeAddressChangeInternal.bind(this)}
            />
          </Item>
        </Form>
        <Button
          onPress={homeAddress => this.props.onSubmit(this.state.homeAddress)}
          style={StyleSheet.flatten(styles.button)}
        >
          <Text>Get Recycling dates</Text>
        </Button>
      </Card>
    )
  }
}
