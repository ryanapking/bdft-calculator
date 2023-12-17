import { AppDispatch, RootState } from './store.ts';
import {
  setActiveTableData,
  RecursiveChild,
  MaterialList,
  MaterialSummary
} from './displaySlice.ts';
import { GROUP, PART, getDataTypeFromId } from './dataTypes.ts';

function combineMaterials(m1: MaterialSummary, m2: MaterialSummary, qty: number): MaterialSummary {
  const updatedBdft = m1.bdft + m2.bdft;
  const updatedCost = m1.cost + m2.cost;
  return {
    id: m1.id,
    bdft: updatedBdft,
    cost: updatedCost,
    totalBdft: +(updatedBdft * qty).toFixed(3),
    totalCost: +(updatedCost * qty).toFixed(2),
  };
}

export function updateActiveTable() {
  return (dispatch: AppDispatch, getState: () => RootState) => {
    const state = getState();
    const activeProjectId = state.display.activeProject;
    if (!activeProjectId) return;

    console.log('updating activeTableData....')

    const activeProject =  state.projects.entities[activeProjectId];
    const groups = state.groups.entities;
    const parts = state.parts.entities;
    const materials = state.materials.entities;

    const processGroup = (groupId: string): RecursiveChild => {
      const group = groups[groupId];

      const children = group.children.map(childId => {
        switch (getDataTypeFromId(childId)) {
          case PART: return processPart(childId);
          default: return processGroup(childId);
        }
      });

      const groupMaterials: MaterialList = children
        .flatMap(child => Object.values(child.materials))
        .reduce((list: MaterialList, current) => {
          return {
            ...list,
            [current.id]: (current.id in list) ? combineMaterials(current, list[current.id], group.qty) : current
          };
        }, {});

      return {
        type: GROUP,
        children: children,
        id: groupId,
        title: group.title,
        qty: group.qty,
        materials: groupMaterials,
      };
    };

    const processPart = (partId: string): RecursiveChild => {
      const part = parts[partId];
      const materialId = part.m ? part.m : activeProject.defaultMaterial;
      const material = materials[materialId];

      const bdft = +((part.l * part.w * material.thickness) / 144).toFixed(3);
      const cost = +(bdft * material.cost).toFixed(2);

      const totalBdft = +(bdft * part.qty).toFixed(3);
      const totalCost = +(totalBdft * material.cost).toFixed(2);

      return {
        type: PART,
        id: partId,
        title: part.title,
        qty: part.qty,
        materials: {
          [materialId]: {
            id: materialId,
            bdft,
            cost,
            totalBdft,
            totalCost,
          }
        },
        children: [],
      };
    };

    const tableData = processGroup(activeProject.mainGroup);
    dispatch(setActiveTableData(tableData));
  }
}