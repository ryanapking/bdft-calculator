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
      state.all[action.payload] = newPart();
    },
    destroy: (state, action: PayloadAction<string|Array<string>>) => {
      const toDestroy = typeof action.payload === 'string' ? [action.payload] : action.payload;
      console.log('destroying parts: ', toDestroy);
      toDestroy.forEach(id => delete state.all[id]);
    },
  },
})

// Action creators are generated for each case reducer function
export const {
  create,
  destroy,
} = partsSlice.actions

export default partsSlice.reducer