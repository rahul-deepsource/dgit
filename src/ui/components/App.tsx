import React from "react"
import { Provider } from "react-redux"
import { PersistGate } from "redux-persist/integration/react"
import { configureStore } from "../store/configureStore"
import { Landing } from "./argit/Landing"
import { LoginModal } from "./argit/loginModal"
import { CreateRepoModal } from "./organisms/CreateRepoModal"
import { GlobalErrorBoundary } from "./utils/GlobalErrorBoundary"
import { GlobalKeyHandler } from "./utils/GlobalKeyHandler"

export class App extends React.Component<{}> {
  render() {
    const { store, persistor } = configureStore()
    return (
      <GlobalErrorBoundary>
        <Provider store={store}>
          <PersistGate persistor={persistor}>
            <GlobalKeyHandler>
              <Landing />
              <LoginModal />
              <CreateRepoModal />
            </GlobalKeyHandler>
          </PersistGate>
        </Provider>
      </GlobalErrorBoundary>
    )
  }
}
