import { BDFT, getId, MATERIAL } from './dataTypes.ts';
import { Material, update as updateMaterial } from './materialsSlice.ts';
import { AppDispatch } from './store.ts';

export function getEmptyMaterial(): Material {
  return {
    id: getId(MATERIAL),
    title: 'New Material',
    cost: 3,
    type: BDFT.id,
    thickness: 1,
  };
}

type MaterialUpdates = {
  id: string,
  changes: Omit<Material, 'id'>,
}

export function saveMaterialUpdates(updates: MaterialUpdates) {
  return (dispatch: AppDispatch) => {
    dispatch(updateMaterial(updates));
    // TODO: trigger calculation
  }
}