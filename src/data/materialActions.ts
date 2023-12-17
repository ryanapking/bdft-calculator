import { BDFT, getId, MATERIAL } from './dataTypes.ts';
import { Material } from './materialsSlice.ts';

export function getEmptyMaterial(): Material {
  return {
    id: getId(MATERIAL),
    title: 'New Material',
    cost: 3,
    type: BDFT.id,
    thickness: 1,
  };
}