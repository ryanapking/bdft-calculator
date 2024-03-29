import { createSlice, createEntityAdapter, PayloadAction } from '@reduxjs/toolkit';
import { MaterialList } from './materialsSlice.ts';

// The structure of an individual project
export type Group = {
  id: string,
  title: string,
  children: Array<string>,
  qty: number,
  notes: string,
  calc: MaterialList,
};

export type GroupPartial = Partial<Omit<Group, 'id' | 'children'>>

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
    createMany: groupsAdapter.addMany,
    setMany: groupsAdapter.setMany,
    update: groupsAdapter.updateOne,
    updateMany: groupsAdapter.updateMany,
    destroy: groupsAdapter.removeOne,
    destroyMany: groupsAdapter.removeMany,
    addChild: (state, action: PayloadAction<{ groupId: string, childId: string, atIndex?: number }>) => {
      const { groupId, childId, atIndex = -1 } = action.payload;
      if (atIndex >= 0) state.entities[groupId].children.splice(atIndex, 0, childId);
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
  createMany,
  setMany,
  update,
  updateMany,
  destroy,
  destroyMany,
  addChild,
  removeChild,
} = groupsSlice.actions

export default groupsSlice.reducer