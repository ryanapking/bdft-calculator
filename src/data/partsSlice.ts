import {createSlice, PayloadAction} from '@reduxjs/toolkit';

// The structure of an individual project
interface Part {
  title: string,
}

function newPart(): Part {
  return {
    title: 'Part Title'
  };
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
    create: (state, action: PayloadAction<string>) => {
      console.log(action.type);
      console.log('partId: ', action.payload)
      state.all[action.payload] = newPart();
    },
  },
})

// Action creators are generated for each case reducer function
export const {
  create
} = partsSlice.actions

export default partsSlice.reducer