import './App.css'
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from "react-redux";
import { store, persistor } from './data/store.ts';
import Navigation from './components/Navigation.tsx';
import ActiveProject from './components/ActiveProject.tsx';

function App() {

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <main className={'container mx-auto'}>
          <Navigation />
          <ActiveProject />
        </main>
      </PersistGate>
    </Provider>
  )
}

export default App
