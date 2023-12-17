import { AppDispatch } from './store.ts';
import { getId, GROUP, MATERIAL, PROJECT } from './dataTypes.ts';
import { create as createGroup } from './groupsSlice.ts';
import { create as createMaterial } from './materialsSlice.ts';
import { Project, create as createProject, update as updateProject } from './projectsSlice.ts';
import { setActiveProject } from './displaySlice.ts';

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

    const materialId = getId(MATERIAL);
    dispatch(createMaterial(materialId));

    const newProject = getEmptyProject(groupId, materialId);
    dispatch(createProject(newProject));
    dispatch(setActiveProject(newProject.id));
  };
}

export function addMaterialToProject(projectId: string, materials: Array<string>) {
  return (dispatch: AppDispatch) => {
    const materialId = getId(MATERIAL);
    dispatch(createMaterial(materialId));

    const updates = {
      id: projectId,
      changes: {
        materials: [...materials, materialId],
      }
    };

    dispatch(updateProject(updates));
  };
}