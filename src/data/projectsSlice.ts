import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// The structure of an individual project
interface Project {
  title: string,
  mainGroup: string,
  materials: Array<string>,
}

function newProject(groupId: string): Project {
  return {
    title: 'Project Title',
    mainGroup: groupId,
    materials: [],
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
      state.all[action.payload.projectId] = newProject(action.payload.groupId);
    },
    destroy: (state, action: PayloadAction<string>) => {
      delete state.all[action.payload];
    },
    addMaterial: (state, action: PayloadAction<{projectId: string, materialId: string}>) => {
      const { projectId, materialId } = action.payload;
      state.all[projectId].materials.push(materialId);
    },
    removeMaterial: (state, action: PayloadAction<{projectId: string, materialId: string}>) => {
      const { projectId, materialId } = action.payload;
      state.all[projectId].materials = state.all[projectId].materials.filter(id => id !== materialId);
    }
  },
})

// Action creators are generated for each case reducer function
export const {
  create,
  destroy,
  addMaterial,
  removeMaterial
} = projectsSlice.actions

export default projectsSlice.reducer