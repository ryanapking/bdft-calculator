import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface DisplayEntity {
  id: string,
  parentId: string,
}

export interface DisplayState {
  activeProject: string,
  activeDetails: DisplayEntity,
  pendingDelete: DisplayEntity,
  alert: string,
}

const initialState: DisplayState = {
  activeProject: '',
  activeDetails: {
    id: '',
    parentId: '',
  },
  pendingDelete: {
    id: '',
    parentId: '',
  },
  alert: '',
}

export const displaySlice = createSlice({
  name: 'display',
  initialState,
  reducers: {
    setActiveProject: (state, action: PayloadAction<string>) => {
      state.activeProject = action.payload;
      state.activeDetails.id = action.payload;
      state.activeDetails.parentId = '';
    },
    setActiveDetails: (state, action: PayloadAction<{ id: string, parentId: string }>) => {
      state.activeDetails = action.payload;
    },
    clearActiveDetailsIf: (state, action: PayloadAction<string>) => {
      if (state.activeDetails.id === action.payload) {
        state.activeDetails.id = '';
        state.activeDetails.parentId = '';
      }
    },
    setPendingDelete: (state, action: PayloadAction<DisplayEntity>) => {
      state.pendingDelete = action.payload;
    },
    clearPendingDelete: (state) => {
      state.pendingDelete.id = '';
      state.pendingDelete.parentId = '';
    },
    setAlert: (state, action: PayloadAction<string>) => {
      state.alert = action.payload;
    },
    clearAlert: (state) => {
      state.alert = '';
    }
  },
})

// Action creators are generated for each case reducer function
export const {
  setActiveProject,
  setActiveDetails,
  clearActiveDetailsIf,
  setPendingDelete,
  clearPendingDelete,
  setAlert,
  clearAlert,
} = displaySlice.actions

export default displaySlice.reducer