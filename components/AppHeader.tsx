import React from 'react'
import { Header, Body, Title } from 'native-base'

interface AppHeaderProps {
  title: string
}

export class AppHeader extends React.Component<AppHeaderProps> {
  constructor(props: AppHeaderProps) {
    super(props)
  }

  render() {
    return (
      <Header>
        <Body>
          <Title>{this.props.title}</Title>
        </Body>
      </Header>
    )
  }
}
