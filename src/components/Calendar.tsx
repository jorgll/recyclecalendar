import React from 'react'
import { StyleSheet } from 'react-native'
import { Card, Text, ListItem, Left, Right, Icon } from 'native-base'
import RecyclingDateModel from '../models/RecyclingDateModel'

const styles = StyleSheet.create({
  card: {
    minHeight: 250,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 20,
    padding: 10,
    backgroundColor: '#222831',
    borderColor: '#f5f5f5',
  },
  listItemText: {
    color: '#f5f5f5',
  },
  recycleIcon: {
    alignSelf: 'center',
    fontSize: 20,
  },
  noRecycleIcon: {
    alignSelf: 'center',
    fontSize: 20,
  },
})

interface CalendarProps {
  hasError: boolean
  recyclingData: RecyclingDateModel[]
}

export default class Calendar extends React.Component<CalendarProps> {
  constructor(props: any) {
    super(props)
  }

  renderIconForItem(d: RecyclingDateModel) {
    if (d.Recycling) {
      return <Text style={styles.recycleIcon}>♻️</Text>
    } else {
      return <Icon name="close" style={styles.noRecycleIcon} />
    }
  }

  render() {
    if (this.props.recyclingData.length == 0 || this.props.hasError) return null

    return (
      <Card style={StyleSheet.flatten(styles.card)}>
        {this.props.recyclingData.length > 0 &&
          !this.props.hasError &&
          this.props.recyclingData.map(d => (
            <ListItem key={d.start}>
              <Left>
                <Text style={styles.listItemText}>{d.start}</Text>
              </Left>
              <Right>{this.renderIconForItem(d)}</Right>
            </ListItem>
          ))}
      </Card>
    )
  }
}
