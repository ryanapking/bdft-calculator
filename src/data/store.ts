import { configureStore, combineReducers } from '@reduxjs/toolkit'
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import projectsSlice from './projectsSlice.ts';
import partsSlice from './partsSlice.ts';
import displaySlice from './displaySlice.ts';

const combinedReducers = combineReducers({
  display: persistReducer({key: 'display', storage}, displaySlice),
  projects: persistReducer({key: 'projects', storage}, projectsSlice),
  parts: persistReducer({key: 'parts', storage}, partsSlice),
})

export const store = configureStore({
  reducer: combinedReducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})






///////
export const persistor = persistStore(store);
////////

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch