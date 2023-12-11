import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// The structure of an individual project
export interface Group {
  title: string,
  children: Array<string>,
  qty: number
}

function newGroup(): Group {
  return {
    title: 'New Group',
    children: [],
    qty: 1,
  };
}

function filterGroup(group: Group): Group {
  return {
    title: group.title,
    children: group.children,
    qty: group.qty,
  }
}

export interface GroupsState {
  all: { [key: string]: Group },
}

const initialState: GroupsState = {
  all: {},
}

export const groupsSlice = createSlice({
  name: 'groups',
  initialState,
  reducers: {
    create: (state, action: PayloadAction<string>) => {
      state.all[action.payload] = newGroup();
    },
    destroy: (state, action: PayloadAction<string|Array<string>>) => {
      const toDestroy = typeof action.payload === 'string' ? [action.payload] : action.payload;
      console.log('destroying groups: ', toDestroy);
      toDestroy.forEach(id => delete state.all[id]);
    },
    update: (state, action: PayloadAction<{ groupId: string, group: Group }>) => {
      const { groupId, group } = action.payload;
      state.all[groupId] = filterGroup(group);
    },
    addChild: (state, action: PayloadAction<{ groupId: string, childId: string }>) => {
      console.log(`addChild(): groupId: ${action.payload.groupId}, childId: ${action.payload.childId}`);
      state.all[action.payload.groupId].children.push(action.payload.childId);
    },
    removeChild: (state, action: PayloadAction<{ groupId: string, childId: string}>) => {
      const { groupId, childId } = action.payload;
      console.log('removeChild()');
      console.log('groupId: ', groupId);
      console.log('childId: ', childId);
      state.all[groupId].children = state.all[groupId].children.filter(id => id !== childId);
    }
  }
})

// Action creators are generated for each case reducer function
export const {
  create,
  destroy,
  update,
  addChild,
  removeChild,
} = groupsSlice.actions

export default groupsSlice.reducer