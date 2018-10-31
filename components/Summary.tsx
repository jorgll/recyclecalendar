import React from 'react';
import { 
  Card,
  Text,
  Spinner,
  H1
} from 'native-base';
import moment from 'moment';
import RecyclingDateModel from '../models/RecyclingDateModel';

interface SummaryProps {
    isLoading: boolean;
    hasError: boolean;
    recyclingData: RecyclingDateModel[];
};

export class Summary extends React.Component<SummaryProps> {
  constructor(props: any) {
    super(props);
  }

  showSpinnerIfNeeded() {
    if (this.props.isLoading && !this.props.hasError) {
      return <Spinner />;
    }
  }

  renderDaysLeft() {
    if (this.props.recyclingData.length > 0) {
      let smallestDelta: number = 60;
      let smallestMoment: moment.Moment = moment();
      this.props.recyclingData.map(day => {
        let m = moment(day.start);
        let days = m.diff(moment(), 'days');
        console.log('Evaluating moment: ' + m.toDate());
        if (day.Recycling && days < smallestDelta) {
          console.log(`Is Smallest = true. Days = ${days}, smallestDelta = ${smallestDelta}`);
          smallestDelta = days;
          smallestMoment = m;
        }
      });

      const timeUntilRecycle: string = moment(smallestMoment).calendar(undefined, { sameDay: '[Today]', nextDay: '[Tomorrow]', nextWeek: 'dddd', sameElse: 'MMM DD'});
      console.log(timeUntilRecycle);
      return (
        <H1>
          Recycling comes in {timeUntilRecycle}
        </H1>
      );
    }
  }

  render() {
    return (
        <Card transparent>
            {this.showSpinnerIfNeeded()}
            {this.renderDaysLeft()}
        </Card>
    );
  }
}

