import './App.css'
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from "react-redux";
import { store, persistor } from './data/store.ts';
import Header from './components/Header.tsx';
import ProjectDirectory from './components/ProjectDirectory.tsx';
import Details from './components/Details.tsx';

function App() {

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <main className={'container mx-auto'}>
          <Header />
          <div className={'flex'}>
            <ProjectDirectory />
            <Details />
          </div>

        </main>
      </PersistGate>
    </Provider>
  )
}

export default App
