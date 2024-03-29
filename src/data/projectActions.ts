import { AppDispatch, RootState } from './store.ts';
import { getDataTypeFromId, getId, GROUP, MATERIAL, PART, PROJECT } from './dataTypes.ts';
import {
  GroupEntities,
  create as createGroup,
  setMany as setManyGroups,
} from './groupsSlice.ts';
import {
  MaterialEntities,
  create as createMaterial,
  destroyMany as destroyManyMaterials,
  destroy as destroyMaterial,
  setMany as setManyMaterials,
} from './materialsSlice.ts';
import {
  Project,
  ProjectPartial,
  create as createProject,
  update as updateProject,
  destroy as destroyProject,
  set as setProject,
} from './projectsSlice.ts';
import {
  PartEntities,
  updateMany as updateManyParts,
  setMany as setManyParts,
} from './partsSlice.ts';
import { clearActiveDetailsIf, endImport, setActiveDetails, setActiveProject, setAlert } from './displaySlice.ts';
import { getEmptyMaterial, getMiscMaterial } from './materialActions.ts';
import { getEmptyGroup, deleteGroup, recalculateGroup, gatherChildren } from './groupActions.ts';
import { saveAs } from 'file-saver';
import filenamify from 'filenamify/browser';
import { validateProjectImport } from '../components/project/import/ImportSchema.ts';

function getEmptyProject(mainGroupId: string, defaultMaterialId: string, miscMaterialId: string): Project {
  return {
    id: getId(PROJECT),
    title: 'New Project',
    mainGroup: mainGroupId,
    materials: [defaultMaterialId],
    defaultMaterial: defaultMaterialId,
    miscMaterial: miscMaterialId,
    notes: '',
  };
}

export function addProject(title?: string) {
  return (dispatch: AppDispatch) => {
    const mainGroup = getEmptyGroup();
    dispatch(createGroup(mainGroup));

    const defaultMaterial = getEmptyMaterial();
    defaultMaterial.title = 'Default Material';
    dispatch(createMaterial(defaultMaterial));

    const miscMaterial = getMiscMaterial();
    dispatch(createMaterial(miscMaterial));

    const newProject = getEmptyProject(mainGroup.id, defaultMaterial.id, miscMaterial.id);
    if (title) newProject.title = title;
    dispatch(createProject(newProject));
    dispatch(setActiveProject(newProject.id));
    dispatch(setActiveDetails({
      id: newProject.mainGroup,
      parentId: newProject.id
    }));
  };
}

export function saveProjectUpdates(projectId: string, changes: ProjectPartial) {
 return (dispatch: AppDispatch) => {
   dispatch(updateProject({
     id: projectId,
     changes,
   }));
   dispatch(recalculateActiveProject());
 };
}

export function deleteProject(projectId: string) {
  return (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch(clearActiveDetailsIf(projectId));

    const state = getState();
    const mainGroupId = state.projects.entities[projectId].mainGroup;
    const materials = state.projects.entities[projectId].materials;
    const miscMaterial = state.projects.entities[projectId].miscMaterial;

    dispatch(destroyProject(projectId));
    dispatch(destroyManyMaterials(materials));
    dispatch(destroyMaterial(miscMaterial));
    dispatch(deleteGroup(projectId, mainGroupId));
  }
}

export function addMaterialToProject(projectId: string, redirect:boolean = true) {
  return (dispatch: AppDispatch, getState: () => RootState) => {
    const project = getState().projects.entities[projectId];

    const material = getEmptyMaterial();
    dispatch(createMaterial(material));

    const updates = {
      id: projectId,
      changes: {
        materials: [...project.materials, material.id],
      }
    };

    dispatch(updateProject(updates));
    if (redirect) {
      dispatch(setActiveDetails({id: material.id, parentId: projectId}));
    }
  };
}

export function reorderProjectMaterial(projectId: string, materialId: string, fromIndex: number, toIndex: number) {
  return (dispatch: AppDispatch, getState: () => RootState) => {
    const projectMaterials = getState().projects.entities[projectId].materials;
    if (projectMaterials[fromIndex] !== materialId) return;

    const copy = [...projectMaterials];
    copy.splice(fromIndex, 1);
    copy.splice(toIndex, 0, materialId);

    dispatch(updateProject({
      id: projectId,
      changes: {
        materials: copy,
      }
    }));
  };
}

export function setDefaultMaterial(projectId: string, materialId: string) {
  return (dispatch: AppDispatch, getState: () => RootState) => {
    const project = getState().projects.entities[projectId];
    if (!project.materials.includes(materialId)) return;

    dispatch(updateProject({
      id: projectId,
      changes: {
        defaultMaterial: materialId,
      }
    }));
    dispatch(recalculateGroup(project.mainGroup));
  };
}

export function removeMaterialFromProject(materialId: string, projectId: string) {
 return (dispatch: AppDispatch, getState: () => RootState) => {
   const state = getState();
   const project = state.projects.entities[projectId];

   // Find child parts of the material type and set them to the default material
   const partUpdates = gatherChildren(project.mainGroup, state)
     .filter(childId => {
       if (getDataTypeFromId(childId) === GROUP) return false;
       const part = state.parts.entities[childId];
       return (part.m === materialId);
     })
     .map(partId => {
       return {
         id: partId,
         changes: {
           m: '',
         }
       };
     });
   dispatch(updateManyParts(partUpdates));

   // Remove the material from the project
   dispatch(updateProject({
     id: projectId,
     changes: {
       materials: project.materials.filter(id => id !== materialId)
     }
   }));

   dispatch(clearActiveDetailsIf(projectId));
   dispatch(destroyMaterial(materialId));
   dispatch(recalculateActiveProject());
 }
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

export type ProjectExport = {
  project: Project,
  groups: GroupEntities,
  parts: PartEntities,
  materials: MaterialEntities,
}



export function exportProject(projectId: string) {
  return (_dispatch: AppDispatch, getState: () => RootState) => {
    const state = getState();
    const project = state.projects.entities[projectId];
    const children = gatherChildren(project.mainGroup, state);

    const projectExport: ProjectExport = {
      project: project,
      groups: {},
      parts: {},
      materials: {},
    };

    // Add child parts to the export
    children.filter(id => getDataTypeFromId(id) === PART)
      .forEach(partId => {
        projectExport.parts[partId] = state.parts.entities[partId]
      });

    // Add child groups to the export
    children.filter(id => getDataTypeFromId(id) === GROUP)
      .forEach(groupId => {
        projectExport.groups[groupId] = state.groups.entities[groupId];
      });

    // Add materials to the export
    project.materials.forEach(materialId => {
      projectExport.materials[materialId] = state.materials.entities[materialId];
    });

    // Add misc materials to the export
    projectExport.materials[project.miscMaterial] = state.materials.entities[project.miscMaterial];

    // Add project main group to the export
    projectExport.groups[project.mainGroup] = state.groups.entities[project.mainGroup];

    // Now we need to do something with it
    const fileName = filenamify(`${project.title}.json`);
    const fileToSave = new Blob([JSON.stringify(projectExport)], {
      type: 'application/json'
    });
    saveAs(fileToSave, fileName);
  }
}

export function importProject(projectImport: ProjectExport) {
  return (dispatch: AppDispatch, getState: () => RootState) => {
    const existingProject = getState().projects.ids.includes(projectImport.project.id);
    if (existingProject) {
      dispatch(deleteProject(projectImport.project.id));
    }

    dispatch(setManyMaterials(Object.values(projectImport.materials)));
    dispatch(setManyParts(Object.values(projectImport.parts)));
    dispatch(setManyGroups(Object.values(projectImport.groups)));
    dispatch(setProject(projectImport.project));
    dispatch(setActiveProject(projectImport.project.id));
    dispatch(recalculateActiveProject());
    dispatch(endImport());
  };
}

export function importProjectAsNew(projectImport: ProjectExport, appendImport: boolean = true) {
  return (dispatch: AppDispatch) => {
    // Generate new IDs
    projectImport.project.id = getId(PROJECT);
    Object.values(projectImport.parts)
      .forEach(part => part.id = getId(PART));
    Object.values(projectImport.groups)
      .forEach(group => group.id = getId(GROUP));
    Object.values(projectImport.materials)
      .forEach(material => material.id = getId(MATERIAL));

    // Assign new IDs to the project
    projectImport.project.mainGroup = projectImport.groups[projectImport.project.mainGroup].id;
    projectImport.project.miscMaterial = projectImport.materials[projectImport.project.miscMaterial].id;
    projectImport.project.defaultMaterial = projectImport.materials[projectImport.project.defaultMaterial].id;
    projectImport.project.materials = projectImport.project.materials.map(materialId => projectImport.materials[materialId].id);

    // Update all part materials to new IDs
    Object.values(projectImport.parts)
      .forEach(part => {
        if (part.m) {
          part.m = projectImport.materials[part.m].id;
        }
      });

    // Update all group children to new IDs
    Object.values(projectImport.groups)
      .forEach(group => {
        group.children = group.children.map(childId => {
          if (getDataTypeFromId(childId) === GROUP) {
            return projectImport.groups[childId].id;
          }
          return projectImport.parts[childId].id;
        });
      });

    if (appendImport) {
      projectImport.project.title += ' (Import)';
    }

    dispatch(importProject(projectImport));
  }
}

export function fetchSampleProject() {
  return async (dispatch: AppDispatch) => {
    const response = await fetch("/bdft-calculator/sample-project.json");
    const sampleProject: ProjectExport = await response.json();

    const valid = validateProjectImport(sampleProject);
    if (!valid) {
      dispatch(setAlert('Error loading sample project. Sorry!'));
      return;
    }

    dispatch(importProjectAsNew(sampleProject, false));
  };
}