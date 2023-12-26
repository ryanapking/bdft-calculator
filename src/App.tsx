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
        <main className='flex'>
          <div className='h-screen w-72'>
            <SideBar />
          </div>
          <div className='grow p-5'>
            <Header />
            <Body />
          </div>
          <GlobalModal />
        </main>
      </PersistGate>
    </Provider>
  )
}

export default App
