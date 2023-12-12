import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// The structure of an individual project
export interface Part {
  title: string,
  qty: number,
  l: number,
  w: number,
  h: number,
  m: string,
}

function newPart(): Part {
  return {
    title: 'New Part',
    qty: 1,
    l: 12,
    w: 3,
    h: 1,
    m: '',
  };
}

function filterPart(part: Part): Part {
  return {
    title: part.title,
    qty: part.qty,
    l: part.l,
    w: part.w,
    h: part.h,
    m: part.m,
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
    create: (state, action: PayloadAction<string>) => {
      state.all[action.payload] = newPart();
    },
    destroy: (state, action: PayloadAction<string|Array<string>>) => {
      const toDestroy = typeof action.payload === 'string' ? [action.payload] : action.payload;
      console.log('destroying parts: ', toDestroy);
      toDestroy.forEach(id => delete state.all[id]);
    },
    update: (state, action: PayloadAction<{partId: string, part: Part}>) => {
      const { partId, part } = action.payload;
      state.all[partId] = filterPart(part);
    }
  },
})

// Action creators are generated for each case reducer function
export const {
  create,
  destroy,
  update,
} = partsSlice.actions

export default partsSlice.reducer