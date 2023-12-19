import { AppDispatch, RootState } from './store.ts';
import { getId, PART, BDFT, SQFT, LFT } from './dataTypes.ts';
import {
  Part,
  create as createPart,
  destroy as destroyPart,
  update as updatePart,
  updateMany as updateManyParts,
  PartCalculated
} from './partsSlice.ts';
import { addChild, removeChild } from './groupsSlice.ts';
import { clearActiveDetailsIf } from './displaySlice.ts';
import { Material } from './materialsSlice.ts';

type PartNew = Omit<Part, 'calc'>
type PartValues = Omit<Part, 'id' | 'calc'>

function getEmptyPart(): PartNew {
  return {
    id: getId(PART),
    title: 'New Part',
    qty: 1,
    l: 12,
    w: 3,
    h: 1,
    m: '',
  };
}

export function addPart(parentId: string) {
  return (dispatch: AppDispatch, getState: () => RootState) => {
    const newPart = getEmptyPart();
    dispatch(createPart({
      ...newPart,
      calc: calculatePart(newPart, getPartMaterial(newPart, getState()))
    }));

    dispatch(addChild({
      groupId: parentId,
      childId: newPart.id
    }));
  };
}

export function savePartUpdates(partId: string, partChanges: PartValues) {
  return (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch(updatePart({
      id: partId,
      changes: {
        ...partChanges,
        calc: calculatePart(partChanges, getPartMaterial(partChanges, getState()))
      },
    }));
  };
}

function getPartMaterial(part: Part | PartValues, state: RootState): Material {
  let materialId = part.m;
  if (!materialId) materialId = state.projects.entities[state.display.activeProject].defaultMaterial;
  return state.materials.entities[materialId];
}

export function deletePart(groupId: string, partId: string) {
  return (dispatch: AppDispatch) => {
    dispatch(clearActiveDetailsIf(partId));
    dispatch(removeChild({ groupId, childId: partId }));
    dispatch(destroyPart(partId));
  };
}

export function recalculateParts(partIds: Array<string>) {
  return (dispatch: AppDispatch, getState: () => RootState) => {
    const state = getState();
    const updates = partIds
      .map((id) => state.parts.entities[id])
      .map((part) => {
        return {
          id: part.id,
          changes: {
            calc: calculatePart(part, getPartMaterial(part, state)),
          }
        }
      });
    console.log('updates: ', updates);
    dispatch(updateManyParts(updates));
  };
}

function calculateBdft(part: Part | PartValues, material: Material): PartCalculated {
  const bdft = +((part.l * part.w * material.thickness) / 144).toFixed(3);
  const cost = +(bdft * material.cost).toFixed(2);
  return {
    type: BDFT.id,
    amt: bdft,
    cost,
  };
}

function calculateLft(part: Part | PartValues, material: Material): PartCalculated {
  const lft = +(part.l / 12).toFixed(3);
  const cost = +(lft * material.cost).toFixed(2);
  return {
    type: LFT.id,
    amt: lft,
    cost,
  };
}

function calculateSqft(part: Part | PartValues, material: Material): PartCalculated {
  const sqft = +((part.l * part.w) / 144).toFixed(3);
  const cost = +(sqft * material.cost).toFixed(2);
  return {
    type: SQFT.id,
    amt: sqft,
    cost,
  };
}

function calculatePart(part: Part | PartValues, material: Material): PartCalculated {
  switch (material.type) {
    case BDFT.id: return calculateBdft(part, material);
    case LFT.id: return calculateLft(part, material);
    case SQFT.id: return calculateSqft(part, material);
    default: return calculateBdft(part, material);
  }
}