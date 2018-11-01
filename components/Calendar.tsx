import React from 'react';
import { 
  Card,
  Text,
  ListItem,
  Left,
  Right,
  Icon,
} from 'native-base';
import RecyclingDateModel from '../models/RecyclingDateModel';


interface CalendarProps {
    hasError: boolean;
    recyclingData: RecyclingDateModel[];
};

export class Calendar extends React.Component<CalendarProps> {
    constructor(props: any) {
        super(props);
    }

    renderIconForItem(d: RecyclingDateModel) {
        if (d.Recycling) {
            return <Icon name='leaf' style={{ color: 'green', alignSelf: 'center' }}/>;
        } else {
            return <Icon name='close' style={{ alignSelf: 'center' }} />
        }
    }

    render() {
        if (this.props.recyclingData.length == 0) return null;

        return (
            <Card style={{ minHeight: 250, marginLeft: 20, marginRight: 20, marginTop: 20, padding: 10 }}>
                {this.props.recyclingData.length > 0 && !this.props.hasError &&
                    <Text style={{ paddingBottom: 20 }}>Full Recycling Calendar for the month</Text>}

                {this.props.recyclingData.length > 0 && !this.props.hasError &&
                    this.props.recyclingData.map(d => (
                        <ListItem key={d.start} >
                            <Left><Text style={{ color: 'grey' }}>{d.start}</Text></Left>
                            <Right>{this.renderIconForItem(d)}</Right>
                        </ListItem>)
                    )}
            </Card>
        );
    }
}

