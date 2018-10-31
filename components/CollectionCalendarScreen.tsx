import React from 'react';
import { 
  Content,
  Text,
  ListItem,
  Right,
  Icon,
} from 'native-base';
import axios from 'axios';
import { HomeForm } from './HomeForm';
import { Summary } from './Summary';
import RecyclingDateModel from '../models/RecyclingDateModel';
import { Calendar } from './Calendar';

interface CollectionCalendarScreenState {
  recyclingData: RecyclingDateModel[];
  isLoading: boolean;
}

type Props = {};
export class CollectionCalendarScreen extends React.Component<Props, CollectionCalendarScreenState> {
  seattleRecyclingUri: string = 'https://www.seattle.gov/UTIL/WARP/CollectionCalendar/GetCollectionDays?pAccount=&pAddress=121%20NW%2040TH%20ST&pJustChecking=&pApp=CC&pIE=&start=';
  
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
    const currentUtcDateTimeInSeconds: number = Math.floor((new Date().getTime())/1000);
    console.log('DateTime: ' + currentUtcDateTimeInSeconds.toString());
    axios.get(this.seattleRecyclingUri + currentUtcDateTimeInSeconds.toString())
      .then(response => {
        console.log(response.data);
        this.setState({ recyclingData: response.data, isLoading: false });
        console.log(this.state);
      });
  }

  renderIconIfNeeded(d: RecyclingDateModel) {
    if (d.Recycling) {
      return <Icon name='leaf' />;
    } else {
      return <Icon name='close' />
    }
  }

  render() {
    return (
        <Content>
            <HomeForm onSubmit={() => this.onButtonPress()} />
            <Summary 
                isLoading={this.state.isLoading}
                recyclingData={this.state.recyclingData}
                hasError={false}
            />
            <Calendar
                recyclingData={this.state.recyclingData}
                hasError={false}
            />
        </Content>
    );
  }
}

