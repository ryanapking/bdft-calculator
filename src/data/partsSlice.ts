import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';

// The structure of an individual project
export type Part = {
  id: string,
  title: string,
  qty: number,
  l: number,
  w: number,
  h: number,
  m: string,
}

const partsAdapter = createEntityAdapter({
  selectId: (part: Part) => part.id
});

export const partsSlice = createSlice({
  name: 'parts',
  initialState: partsAdapter.getInitialState(),
  reducers: {
    create: partsAdapter.addOne,
    destroy: partsAdapter.removeOne,
    destroyMany: partsAdapter.removeMany,
    update: partsAdapter.updateOne,
  },
})

// Action creators are generated for each case reducer function
export const {
  create,
  destroy,
  destroyMany,
  update,
} = partsSlice.actions

export default partsSlice.reducer