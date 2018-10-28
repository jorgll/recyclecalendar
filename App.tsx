import React from 'react';
import { Component } from 'react';
import { StyleSheet } from 'react-native';
import { 
  Container, 
  Header, 
  Body, 
  Title, 
  Content, 
  Button, 
  Text,
  Form,
  Item,
  Input,
  Label
} from 'native-base';

type Props = {};
export default class App extends Component<Props> {
  render() {
    return (
      <Container>
        <Header>
          <Body>
            <Title>Seattle Recycling Calendar</Title>
          </Body>
        </Header>
        <Content>
          <Form>
            <Item stackedLabel>
              <Label>Home address:</Label>
              <Input />
            </Item>
          </Form>
          <Button><Text>Get Recycling dates</Text></Button>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
