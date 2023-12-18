import './App.css'
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from "react-redux";
import { store, persistor } from './data/store.ts';
import Header from './components/Header.tsx';
import SideBar from './components/SideBar.tsx';
import Body from './components/Body.tsx';

function App() {

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <main className={'container mx-auto'}>
          <Header />
          <div className={'flex'}>
            <SideBar />
            <Body />
          </div>

        </main>
      </PersistGate>
    </Provider>
  )
}

export default App
