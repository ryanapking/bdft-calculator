import {createSlice, PayloadAction} from '@reduxjs/toolkit'

export interface DisplayState {
  activeProject: string|null
}

const initialState: DisplayState = {
  activeProject: null,
}

export const displaySlice = createSlice({
  name: 'display',
  initialState,
  reducers: {
    setActiveProject: (state, action: PayloadAction<string>) => {
      state.activeProject = action.payload;
    },
  },
})

// Action creators are generated for each case reducer function
export const {
  setActiveProject
} = displaySlice.actions

export default displaySlice.reducer