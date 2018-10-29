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
  Label,
  ListItem,
  Right,
  Icon,
  Spinner
} from 'native-base';
import axios from 'axios';

class RecyclingDateModel {
  FoodAndYardWaste: boolean = false;
  Garbage: boolean = false;
  Recycling: boolean = false;
  start: string = '';
}

interface AppState {
  recyclingData: RecyclingDateModel[];
  isLoading: boolean;
}

type Props = {};
export default class App extends Component<Props, AppState> {
  seattleRecyclingUri: string = 'https://www.seattle.gov/UTIL/WARP/CollectionCalendar/GetCollectionDays?pAccount=&pAddress=121%20NW%2040TH%20ST&pJustChecking=&pApp=CC&pIE=&start=0';
  
  constructor(props: any) {
    super(props);
    this.state = {
      recyclingData: new Array(),
      isLoading: false
    }
  }

  onButtonPress(): void {
    this.setState({ isLoading: true });
    console.log('Getting data from Seattle Recycling...');
    axios.get(this.seattleRecyclingUri)
      .then(response => {
        // console.log(response.data);
        this.setState({ recyclingData: response.data, isLoading: false });
        console.log(this.state);
      });
  }

  showSpinnerIfNeeded() {
    if (this.state.isLoading) {
      return (<Spinner />);
    }
  }

  renderIconIfNeeded(d: RecyclingDateModel) {
    if (d.Recycling) {
      return (<Icon active name='leaf' />);
    }
  }

  renderRecycleData() {
    // console.log(this.recyclingData);
    // if (this.recyclingData.length > 0) {
    //   return this.recyclingData.map(data => 
    //     console.log(data)
    //     // <Row><Text>Hola</Text></Row>
    //     // <Row><Text>`${data.date}: Food and yard ${data.foodAndYardWaste} Garbage ${data.garbage} Recycling ${data.recycling}`</Text></Row>
    //   );
    // }
  }

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
              <Input value="121 NW 40th St" />
            </Item>
          </Form>
          <Button onPress={this.onButtonPress.bind(this)}>
            <Text>Get Recycling dates</Text>
          </Button>
          {this.showSpinnerIfNeeded()}
          {this.state.recyclingData.map(d => (
            <ListItem icon key={d.start}>
              <Text>{d.start}</Text>
              <Right>
                  {this.renderIconIfNeeded(d)}
              </Right>
            </ListItem>)
          )}
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
