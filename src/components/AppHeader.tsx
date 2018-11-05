import React from 'react'
import { StyleSheet } from 'react-native'
import { Header, Body, Title } from 'native-base'

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#393e46',
  },
  title: {
    color: '#f5f5f5',
  },
})

interface AppHeaderProps {
  title: string
}

export default class AppHeader extends React.Component<AppHeaderProps> {
  constructor(props: AppHeaderProps) {
    super(props)
  }

  render() {
    return (
      <Header style={StyleSheet.flatten(styles.header)}>
        <Body>
          <Title style={StyleSheet.flatten(styles.title)}>{this.props.title}</Title>
        </Body>
      </Header>
    )
  }
}
