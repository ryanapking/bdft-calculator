import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// The structure of an individual project
interface Project {
  title: string,
  mainGroup: string,
  materials: Array<string>,
  defaultMaterial: string,
}

function newProject(groupId: string, materialId: string): Project {
  return {
    title: 'Project Title',
    mainGroup: groupId,
    materials: [materialId],
    defaultMaterial: materialId,
  };
}

function filteredProject(project: Project): Project {
  return {
    title: project.title,
    mainGroup: project.mainGroup,
    materials: project.materials,
    defaultMaterial: project.defaultMaterial,
  }
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
    create: (state, action: PayloadAction<{projectId: string, groupId: string, materialId: string}>) => {
      const { projectId, groupId, materialId } = action.payload;
      state.all[projectId] = newProject(groupId, materialId);
    },
    destroy: (state, action: PayloadAction<string>) => {
      delete state.all[action.payload];
    },
    update: (state, action: PayloadAction<{ projectId: string, project: Project }>) => {
      const { projectId, project } = action.payload;
      state.all[projectId] = filteredProject(project);
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
  update,
  addMaterial,
  removeMaterial,
} = projectsSlice.actions

export default projectsSlice.reducer