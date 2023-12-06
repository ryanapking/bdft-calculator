import { createSlice } from '@reduxjs/toolkit';
import { getId } from './storageIds.ts';

// The structure of an individual project
interface Project {
  title: string,
  children: Array<string>,
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
    create: (state) => {
      const project: Project = {
        title: 'Project Title',
        children: [],
      };
      const id = getId();
      return {all:{...state.all, [id]: project}};
    },
  },
})

// Action creators are generated for each case reducer function
export const {
  create
} = projectsSlice.actions

export default projectsSlice.reducer