import './App.css'
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from "react-redux";
import { store, persistor } from './data/store.ts';
import Header from './components/Header.tsx';
import SideBar from './components/SideBar.tsx';
import Body from './components/Body.tsx';
import GlobalModal from './components/GlobalModal.tsx';

function App() {

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <main className='w-screen max-w-screen h-screen max-h-screen overflow-clip flex flex-col'>
          <Header />
          <div className='flex shrink grow overflow-clip'>
            <SideBar />
            <Body />
          </div>

          <GlobalModal />
        </main>
      </PersistGate>
    </Provider>
  )
}

export default App
