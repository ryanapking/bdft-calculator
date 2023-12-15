import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { DataType } from './dataTypes.ts';

export type MaterialSummary = {
  id: string,
  bdft: number,
  cost: number,
  totalBdft: number,
  totalCost: number,
}

export type MaterialList = { [key: string]: MaterialSummary };

export type RecursiveChild = {
  type: DataType,
  id: string,
  title: string,
  qty: number,
  children: Array<RecursiveChild>,
  materials: MaterialList,
}

interface ActiveDetails {
  id: string,
  parentId: string,
}

export interface DisplayState {
  activeProject: string,
  activeDetails: ActiveDetails,
  activeTableData: RecursiveChild | null
}

const initialState: DisplayState = {
  activeProject: '',
  activeDetails: {
    id: '',
    parentId: '',
  },
  activeTableData: null,
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
    setActiveTableData: (state, action: PayloadAction<RecursiveChild>) => {
      state.activeTableData = action.payload;
    },
    clearActiveDetailsIf: (state, action: PayloadAction<string>) => {
      if (state.activeDetails.id === action.payload) {
        state.activeDetails.id = '';
        state.activeDetails.parentId = '';
      }
    }
  },
})

// Action creators are generated for each case reducer function
export const {
  setActiveProject,
  setActiveDetails,
  clearActiveDetailsIf,
  setActiveTableData,
} = displaySlice.actions

export default displaySlice.reducer