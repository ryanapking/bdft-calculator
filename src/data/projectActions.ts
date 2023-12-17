import { AppDispatch } from './store.ts';
import { getId, GROUP, PROJECT } from './dataTypes.ts';
import { create as createGroup } from './groupsSlice.ts';
import { create as createMaterial } from './materialsSlice.ts';
import { Project, create as createProject, update as updateProject } from './projectsSlice.ts';
import { setActiveProject } from './displaySlice.ts';
import { getEmptyMaterial } from './materialActions.ts';

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
    const groupId = getId(GROUP);
    dispatch(createGroup(groupId));

    const defaultMaterial = getEmptyMaterial();
    dispatch(createMaterial(defaultMaterial));

    const newProject = getEmptyProject(groupId, defaultMaterial.id);
    dispatch(createProject(newProject));
    dispatch(setActiveProject(newProject.id));
  };
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