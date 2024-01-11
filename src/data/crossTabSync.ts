import { KEY_PREFIX, REHYDRATE } from 'redux-persist/lib/constants'
import type { Store } from 'redux'

export default function crossTabSync (store: Store, reducerKeys: Array<string>) {
  const storageKeys = reducerKeys.map(key => KEY_PREFIX + key);

  window.addEventListener('storage', handleStorageEvent);

  function handleStorageEvent (e: StorageEvent) {
    // if no key or if string doesn't start with persist prefix
    if (!e.key || !storageKeys.includes(e.key)) return;
    if (!e.newValue || e.oldValue === e.newValue) return;

    const key = e.key.substring(KEY_PREFIX.length);
    const reducerState: { [key:string]: string } = JSON.parse(e.newValue);

    const state = Object.keys(reducerState).reduce((state: { [key: string]: unknown }, reducerKey) => {
      state[reducerKey] = JSON.parse(reducerState[reducerKey])
      return state
    }, {});

    store.dispatch({
      type: REHYDRATE,
      payload: state,
      key,
    });
  }
}

// based on:
// https://github.com/rt2zz/redux-persist-crosstab

// This needs to be implemented to prevent errors from cross-tab data conflicts.
// But to work properly, loaded entities in many components need to be validated.
// This is because the different slices update at different moments,
// meaning that references to entities can exist before those entities are created.