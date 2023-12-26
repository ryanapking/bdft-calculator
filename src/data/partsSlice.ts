import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import { MaterialList } from './materialsSlice.ts';

// The structure of an individual project
export type Part = {
  id: string,
  title: string,
  qty: number,
  l: number, // length
  w: number, // width
  h: number, // height
  m: string, // material id
  calc: MaterialList,
}

export type PartEntities = {
  [key: string]: Part,
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
    updateMany: partsAdapter.updateMany,
  },
})

// Action creators are generated for each case reducer function
export const {
  create,
  destroy,
  destroyMany,
  update,
  updateMany,
} = partsSlice.actions

export default partsSlice.reducer