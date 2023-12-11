import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface ActiveDetails {
  id: string,
  parentId: string,
}

export interface DisplayState {
  activeProject: string,
  activeDetails: ActiveDetails,
}

const initialState: DisplayState = {
  activeProject: '',
  activeDetails: {
    id: '',
    parentId: '',
  },
}

export const displaySlice = createSlice({
  name: 'display',
  initialState,
  reducers: {
    setActiveProject: (state, action: PayloadAction<string>) => {
      state.activeProject = action.payload;
    },
    setActiveDetails: (state, action: PayloadAction<{ id: string, parentId: string }>) => {
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