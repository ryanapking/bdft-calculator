import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface DisplayEntity {
  id: string,
  parentId: string,
}

export interface DisplayState {
  activeProject: string,
  activeDetails: DisplayEntity,
  pendingDelete: DisplayEntity,
  pendingBulkDelete: Array<DisplayEntity>,
  creating: boolean,
  importing: boolean,
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
  pendingBulkDelete: [],
  creating: false,
  importing: false,
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
    setPendingBulkDelete: (state, action: PayloadAction<Array<DisplayEntity>>) => {
      state.pendingBulkDelete = action.payload;
    },
    clearPendingBulkDelete: (state) => {
      state.pendingBulkDelete = [];
    },
    beginImport: (state) => {
      state.importing = true;
    },
    endImport: (state) => {
      state.importing = false;
    },
    setCreating: (state, action: PayloadAction<boolean>) => {
      state.creating = action.payload;
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
  setPendingBulkDelete,
  clearPendingBulkDelete,
  beginImport,
  endImport,
  setCreating,
  setAlert,
  clearAlert,
} = displaySlice.actions

export default displaySlice.reducer