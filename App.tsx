import React from 'react';
import { Container } from 'native-base';
import { AppHeader } from './components/AppHeader';
import { CollectionCalendarScreen } from './components/CollectionCalendarScreen';

type Props = {};
export default class App extends React.Component<Props> {
  constructor(props: any) {
    super(props);
  }

  render() {
    return (
      <Container>
        <AppHeader title="Seattle Recycling Calendar" />
        <CollectionCalendarScreen />
      </Container>
    );
  }
}

