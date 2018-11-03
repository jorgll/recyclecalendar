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
  onSubmit: () => void
}

interface HomeFormState {
  homeAddress: string
}

export class HomeForm extends React.Component<HomeFormProps, HomeFormState> {
  constructor(props: any) {
    super(props)
    this.state = { homeAddress: '121 NW 40th St' }
  }

  onButtonPress(): void {
    this.props.onSubmit()
  }

  render() {
    return (
      <Card style={styles.card}>
        <Form style={styles.form}>
          <Item stackedLabel>
            <Label>Home address:</Label>
            <Input value={this.state.homeAddress} />
          </Item>
        </Form>
        <Button onPress={this.props.onSubmit} style={styles.button}>
          <Text>Get Recycling dates</Text>
        </Button>
      </Card>
    )
  }
}
