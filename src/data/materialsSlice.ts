import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';

// The structure of an individual project
export type Material = {
  id: string,
  title: string,
  cost: number,
  type: string,
  thickness: number,
  waste: number,
}

export type MaterialUsageSummary = {
  id: string, // material id
  type: string, // material type
  amt: number, // amount (bdft, sqft, lft, etc)
  cost: number,
}

export type MaterialList = {
  totalCost: number,
  ids: Array<string>,
  entities: {
    [key: string]: MaterialUsageSummary
  }
}

const materialsAdapter = createEntityAdapter({
  selectId: (material: Material) => material.id,
});

export const materialsSlice = createSlice({
  name: 'materials',
  initialState: materialsAdapter.getInitialState(),
  reducers: {
    create: materialsAdapter.addOne,
    update: materialsAdapter.updateOne,
    destroy: materialsAdapter.removeOne,
    destroyMany: materialsAdapter.removeMany,
  },
})

// Action creators are generated for each case reducer function
export const {
  create,
  update,
  destroy,
  destroyMany,
} = materialsSlice.actions

export default materialsSlice.reducer