import { BDFT, getId, MATERIAL, MISC } from './dataTypes.ts';
import { Material, update as updateMaterial } from './materialsSlice.ts';
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