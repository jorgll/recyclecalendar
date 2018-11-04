import React from 'react'
import { StyleSheet } from 'react-native'
import { Card, H1 } from 'native-base'

const styles = StyleSheet.create({
  card: {
    minHeight: 150,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 20,
    padding: 10,
  },
})

interface ErrorCardProps {
  error: string
}

export default class ErrorCard extends React.Component<ErrorCardProps> {
  constructor(props: any) {
    super(props)
  }

  render() {
    if (this.props.error == '') return null

    return (
      <Card style={StyleSheet.flatten(styles.card)}>
        <H1>⚠️ {this.props.error}</H1>
      </Card>
    )
  }
}
