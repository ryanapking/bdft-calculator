import './App.css'
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from "react-redux";
import { store, persistor } from './data/store.ts';
import ProjectsList from './components/ProjectsList.tsx'
import ActiveProject from './components/ActiveProject.tsx';

function App() {

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ProjectsList />
        <ActiveProject />
      </PersistGate>
    </Provider>
  )
}

export default App
