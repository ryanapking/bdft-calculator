import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// The structure of an individual project
interface Project {
  title: string,
  mainGroup: string,
}

function newProject(groupId: string): Project {
  return {
    title: 'Project Title',
    mainGroup: groupId,
  };
}

export interface ProjectsState {
  all: { [key: string]: Project },
}

const initialState: ProjectsState = {
  all: {},
}

export const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    create: (state, action: PayloadAction<{projectId: string, groupId: string}>) => {
      console.log(action.type);
      console.log('projectId: ', action.payload.projectId);
      console.log('groupId: ', action.payload.groupId);

      state.all[action.payload.projectId] = newProject(action.payload.groupId);
    },
  },
})

// Action creators are generated for each case reducer function
export const {
  create
} = projectsSlice.actions

export default projectsSlice.reducer