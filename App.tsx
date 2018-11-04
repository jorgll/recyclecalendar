import React from 'react'
import { Container } from 'native-base'
import AppHeader from './src/components/AppHeader'
import CollectionCalendarScreen from './src/components/CollectionCalendarScreen'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'remote-redux-devtools'
import reducer from './src/redux/reducer'
import ReduxThunk from 'redux-thunk'

type Props = {}
export default class App extends React.Component<Props> {
  constructor(props: any) {
    super(props)
  }

  render() {
    const store = createStore(reducer, composeWithDevTools(applyMiddleware(ReduxThunk)))
    return (
      <Provider store={store}>
        <Container>
          <AppHeader title="Seattle Recycling Calendar" />
          <CollectionCalendarScreen />
        </Container>
      </Provider>
    )
  }
}
