import { createSlice, createEntityAdapter, PayloadAction } from '@reduxjs/toolkit';

// The structure of an individual project
export type Group = {
  id: string,
  title: string,
  children: Array<string>,
  qty: number
};

const groupsAdapter = createEntityAdapter({
  selectId: (group: Group) => group.id,
});

export const groupsSlice = createSlice({
  name: 'groups',
  initialState: groupsAdapter.getInitialState(),
  reducers: {
    create: groupsAdapter.addOne,
    update: groupsAdapter.updateOne,
    destroy: groupsAdapter.removeOne,
    destroyMany: groupsAdapter.removeMany,
    addChild: (state, action: PayloadAction<{ groupId: string, childId: string }>) => {
      const { groupId, childId } = action.payload;
      state.entities[groupId].children.push(childId);
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
  destroy,
  destroyMany,
  addChild,
  removeChild,
} = groupsSlice.actions

export default groupsSlice.reducer