import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';

// The structure of an individual project
export type Project = {
  id: string,
  title: string,
  mainGroup: string,
  materials: Array<string>,
  defaultMaterial: string,
  miscMaterial: string,
  notes: string,
}

export type ProjectPartial = Omit<Partial<Project>, 'id'|'mainGroup'|'miscMaterial'>

const projectsAdapter = createEntityAdapter({
  sortComparer: (a: Project, b: Project) => a.title.localeCompare(b.title),
});

export const projectsSlice = createSlice({
  name: 'projects',
  initialState: projectsAdapter.getInitialState(),
  reducers: {
    create: projectsAdapter.addOne,
    set: projectsAdapter.setOne,
    destroy: projectsAdapter.removeOne,
    update: projectsAdapter.updateOne,
  },
})

// Action creators are generated for each case reducer function
export const {
  create,
  set,
  destroy,
  update,
} = projectsSlice.actions

export default projectsSlice.reducer