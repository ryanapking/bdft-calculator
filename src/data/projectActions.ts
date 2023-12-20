import { AppDispatch, RootState } from './store.ts';
import { getId, PROJECT } from './dataTypes.ts';
import { create as createGroup } from './groupsSlice.ts';
import { create as createMaterial, destroyMany as destroyManyMaterials } from './materialsSlice.ts';
import {
  Project,
  create as createProject,
  update as updateProject,
  destroy as destroyProject
} from './projectsSlice.ts';
import { clearActiveDetailsIf, setActiveProject } from './displaySlice.ts';
import { getEmptyMaterial } from './materialActions.ts';
import { getEmptyGroup, deleteGroup, recalculateGroup } from './groupActions.ts';

function getEmptyProject(mainGroupId: string, defaultMaterialId: string): Project {
  return {
    id: getId(PROJECT),
    title: 'New Project',
    mainGroup: mainGroupId,
    materials: [defaultMaterialId],
    defaultMaterial: defaultMaterialId
  };
}

export function addProject() {
  return (dispatch: AppDispatch) => {
    const mainGroup = getEmptyGroup();
    dispatch(createGroup(mainGroup));

    const defaultMaterial = getEmptyMaterial();
    dispatch(createMaterial(defaultMaterial));

    const newProject = getEmptyProject(mainGroup.id, defaultMaterial.id);
    dispatch(createProject(newProject));
    dispatch(setActiveProject(newProject.id));
  };
}

type ProjectUpdate = {
  id: string,
  changes: Omit<Project, 'id' | 'materials' | 'mainGroup'>,
};

export function saveProjectUpdates(update: ProjectUpdate) {
 return (dispatch: AppDispatch) => {
   dispatch(updateProject(update));
   dispatch(recalculateActiveProject());
 };
}

export function deleteProject(projectId: string) {
  return (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch(clearActiveDetailsIf(projectId));

    const state = getState();
    const mainGroupId = state.projects.entities[projectId].mainGroup;
    const materials = state.projects.entities[projectId].materials;

    dispatch(destroyProject(projectId));
    dispatch(destroyManyMaterials(materials));
    dispatch(deleteGroup(projectId, mainGroupId));
  }
}

export function addMaterialToProject(projectId: string, materials: Array<string>) {
  return (dispatch: AppDispatch) => {
    const material = getEmptyMaterial();
    dispatch(createMaterial(material));

    const updates = {
      id: projectId,
      changes: {
        materials: [...materials, material.id],
      }
    };

    dispatch(updateProject(updates));
  };
}

export function recalculateActiveProject() {
  return (dispatch: AppDispatch, getState: () => RootState) => {
    const state = getState();
    const activeProject = state.display.activeProject;
    if (!activeProject) return;

    const mainGroup = state.projects.entities[activeProject].mainGroup;
    dispatch(recalculateGroup(mainGroup));
  }
}