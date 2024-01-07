import { BDFT, getId, getMaterialTypeFromId, MATERIAL, MISC } from './dataTypes.ts';
import {
  Material,
  MaterialEntities,
  MaterialList,
  MaterialUsageSummary,
  update as updateMaterial
} from './materialsSlice.ts';
import { AppDispatch } from './store.ts';
import { recalculateActiveProject } from './projectActions.ts';

export function getEmptyMaterial(): Material {
  return {
    id: getId(MATERIAL),
    title: 'New Material',
    cost: 3,
    type: BDFT.id,
    thickness: 1,
    waste: 0,
    notes: '',
  };
}

export function getMiscMaterial(): Material {
  return {
    id: getId(MATERIAL),
    title: 'Misc.',
    cost: 0,
    type: MISC.id,
    thickness: 0,
    waste: 0,
    notes: '',
  };
}

type MaterialUpdates = {
  id: string,
  changes: Omit<Material, 'id'>,
}

export function saveMaterialUpdates(updates: MaterialUpdates) {
  return (dispatch: AppDispatch) => {
    dispatch(updateMaterial(updates));
    dispatch(recalculateActiveProject());
  }
}

export type MaterialPartial = Partial<Omit<Material, 'id'>>

export function saveMaterialPartial(materialId: string, changes: MaterialPartial) {
  return (dispatch: AppDispatch) => {
    const update = { id: materialId, changes };
    dispatch(updateMaterial(update));
    dispatch(recalculateActiveProject());
  }
}

export function calculateMaterialWaste(usage: MaterialUsageSummary, material: Material) {
  if (getMaterialTypeFromId(material.type) === MISC) {
    return {
      waste: 0,
      totalAmt: 0,
      totalCost: usage.cost,
    };
  }
  const waste = +(usage.amt * (material.waste / 100)).toFixed(3);
  const totalAmt = +(usage.amt + waste).toFixed(3);
  const totalCost = +(material.cost * totalAmt).toFixed(2);
  return { waste, totalAmt, totalCost };
}

export function calculateListWithWaste(materialList: MaterialList, materials: MaterialEntities) {
  return materialList.ids.reduce((projectCost, materialId) => {
    const material = materials[materialId];
    const usage = materialList.entities[materialId];
    const { totalCost: materialCost } = calculateMaterialWaste(usage, material);
    return projectCost + materialCost;
  }, 0);
}