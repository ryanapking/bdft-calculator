import { createSlice } from '@reduxjs/toolkit';
import { getId } from './storageIds.ts';

// The structure of an individual project
interface Part {
  title: string,
}

function getTemplatePart(): Part {
  return {
    title: 'Part Title'
  }
}

export interface PartsState {
  all: { [key: string]: Part },
}

const initialState: PartsState = {
  all: {},
}

export const partsSlice = createSlice({
  name: 'parts',
  initialState,
  reducers: {
    create: (state) => {
      const part: Part = getTemplatePart();
      const id = getId();
      return {all:{...state.all, [id]: part}};
    },
  },
})

// Action creators are generated for each case reducer function
export const {
  create
} = partsSlice.actions

export default partsSlice.reducer