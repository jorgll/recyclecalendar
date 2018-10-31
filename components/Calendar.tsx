import React from 'react';
import { 
  Card,
  Text,
  ListItem,
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

    renderIconIfNeeded(d: RecyclingDateModel) {
        if (d.Recycling) {
            return <Icon name='leaf' />;
        } else {
            return <Icon name='close' />
        }
    }

    render() {
        return (
            <Card transparent>
                {this.props.recyclingData.length > 0 && !this.props.hasError &&
                    <Text>Full Recycling Calendar for the month:</Text>}

                {this.props.recyclingData.length > 0 && !this.props.hasError &&
                    this.props.recyclingData.map(d => (
                        <ListItem icon key={d.start} >
                            <Text>{d.start}</Text>
                            <Right>
                                {this.renderIconIfNeeded(d)}
                            </Right>
                        </ListItem>)
                    )}
            </Card>
        );
    }
}

