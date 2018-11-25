import React from 'react'
import { Container } from 'native-base'
import AppHeader from './src/components/AppHeader'
import CollectionCalendarScreen from './src/components/CollectionCalendarScreen'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'remote-redux-devtools'
import reducer from './src/redux/reducer'
import ReduxThunk from 'redux-thunk'
import { persistStore, persistReducer } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'
import storage from 'redux-persist/lib/storage'

// Configure Redux Persist options
const persistConfig = {
  key: 'root',
  storage,
}
const persistedReducer = persistReducer(persistConfig, reducer)

// Main App component
type Props = {}
export default class App extends React.Component<Props> {
  constructor(props: any) {
    super(props)
  }

  render() {
    const store = createStore(persistedReducer, composeWithDevTools(applyMiddleware(ReduxThunk)))
    const persistor = persistStore(store)
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Container>
            <AppHeader title="Seattle Recycling Calendar" />
            <CollectionCalendarScreen />
          </Container>
        </PersistGate>
      </Provider>
    )
  }
}
