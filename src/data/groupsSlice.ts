import { createSlice, createEntityAdapter, PayloadAction } from '@reduxjs/toolkit';
import { MaterialList } from './materialsSlice.ts';

// The structure of an individual project
export type Group = {
  id: string,
  title: string,
  children: Array<string>,
  qty: number,
  calc: MaterialList,
};

export type GroupEntities = {
  [key: string]: Group,
}

const groupsAdapter = createEntityAdapter({
  selectId: (group: Group) => group.id,
});

export const groupsSlice = createSlice({
  name: 'groups',
  initialState: groupsAdapter.getInitialState(),
  reducers: {
    create: groupsAdapter.addOne,
    update: groupsAdapter.updateOne,
    updateMany: groupsAdapter.updateMany,
    destroy: groupsAdapter.removeOne,
    destroyMany: groupsAdapter.removeMany,
    addChild: (state, action: PayloadAction<{ groupId: string, childId: string, prepend?: boolean }>) => {
      const { groupId, childId, prepend = false } = action.payload;
      if (prepend) state.entities[groupId].children.unshift(childId);
      else state.entities[groupId].children.push(childId);
    },
    removeChild: (state, action: PayloadAction<{ groupId: string, childId: string}>) => {
      const { groupId, childId } = action.payload;
      state.entities[groupId].children = state.entities[groupId].children.filter(id => id !== childId);
    }
  }
})

// Action creators are generated for each case reducer function
export const {
  create,
  update,
  updateMany,
  destroy,
  destroyMany,
  addChild,
  removeChild,
} = groupsSlice.actions

export default groupsSlice.reducer