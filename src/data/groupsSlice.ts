import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// The structure of an individual project
interface Group {
  title: string,
  children: Array<string>,
}

function newGroup(): Group {
  return {
    title: 'Group Title',
    children: [],
  };
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
      console.log(action.type);
      console.log('groupId', action.payload);
      state.all[action.payload] = newGroup();
    },
    addChild: (state, action: PayloadAction<{ groupId: string, childId: string }>) => {
      console.log(`addChild(): groupId: ${action.payload.groupId}, childId: ${action.payload.childId}`);
      state.all[action.payload.groupId].children.push(action.payload.childId);
    }
  }
})

// Action creators are generated for each case reducer function
export const {
  create,
  addChild
} = groupsSlice.actions

export default groupsSlice.reducer