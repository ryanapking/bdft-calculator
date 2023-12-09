import {createSlice, PayloadAction} from '@reduxjs/toolkit'

interface ActiveDetails {
  id: string|null,
  parentId: string|null,
}

export interface DisplayState {
  activeProject: string|null,
  activeDetails: ActiveDetails,
}

const initialState: DisplayState = {
  activeProject: null,
  activeDetails: {
    id: null,
    parentId: null,
  },
}

export const displaySlice = createSlice({
  name: 'display',
  initialState,
  reducers: {
    setActiveProject: (state, action: PayloadAction<string>) => {
      state.activeProject = action.payload;
    },
    setActiveDetails: (state, action: PayloadAction<{ id: string, parentId?: string|null }>) => {
      state.activeDetails = action.payload;
    }
  },
})

// Action creators are generated for each case reducer function
export const {
  setActiveProject,
  setActiveDetails,
} = displaySlice.actions

export default displaySlice.reducer