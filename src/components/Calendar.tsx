import React from 'react'
import { StyleSheet } from 'react-native'
import { Card, Text, ListItem, Left, Right, List } from 'native-base'
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
  listItem: {
    padding: 0,
  },
  listItemText: {
    color: '#f5f5f5',
    fontSize: 16,
  },
  recycleIcon: {
    alignSelf: 'center',
    fontSize: 30,
    color: '#f5f5f5',
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
      return <Text style={styles.recycleIcon}>-</Text>
    }
  }

  render() {
    if (this.props.recyclingData.length == 0 || this.props.hasError) return null

    return (
      <Card style={StyleSheet.flatten(styles.card)}>
        {this.props.recyclingData.length > 0 &&
          !this.props.hasError &&
          this.props.recyclingData.map(d => (
            <ListItem key={d.start} noBorder style={StyleSheet.flatten(styles.listItem)}>
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
