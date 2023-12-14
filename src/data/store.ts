import { configureStore, combineReducers } from '@reduxjs/toolkit';
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
import groupsSlice from './groupsSlice.ts';
import materialsSlice from './materialsSlice.ts';
import { useDispatch } from "react-redux";

const combinedReducers = combineReducers({
  display: persistReducer({key: 'display', storage, blacklist: ['activeTableData']}, displaySlice),
  projects: persistReducer({key: 'projects', storage}, projectsSlice),
  parts: persistReducer({key: 'parts', storage}, partsSlice),
  groups: persistReducer({key: 'groups', storage}, groupsSlice),
  materials: persistReducer({key: 'materials', storage}, materialsSlice),
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

export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;