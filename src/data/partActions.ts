import { AppDispatch, RootState } from './store.ts';
import { getId, PART, BDFT, SQFT, LFT, MISC } from './dataTypes.ts';
import {
  Part,
  create as createPart,
  destroy as destroyPart,
  update as updatePart,
} from './partsSlice.ts';
import { addChild, removeChild } from './groupsSlice.ts';
import { clearActiveDetailsIf, setActiveDetails } from './displaySlice.ts';
import { Material, MaterialList } from './materialsSlice.ts';
import { recalculateActiveProject } from './projectActions.ts';

function getEmptyPart(): Part {
  return {
    id: getId(PART),
    title: 'New Component',
    qty: 1,
    l: 12,
    w: 3,
    h: 1,
    m: '',
    c: 0,
    notes: '',
    calc: {
      totalCost: 0,
      ids: [],
      entities: {},
    }
  };
}

export function addPart(parentId: string, prepend: boolean = false, redirect: boolean = true) {
  return (dispatch: AppDispatch) => {
    const newPart = getEmptyPart();
    dispatch(createPart(newPart));

    dispatch(addChild({
      prepend: prepend,
      groupId: parentId,
      childId: newPart.id
    }));

    dispatch(recalculateActiveProject());
    if (redirect) dispatch(setActiveDetails({id: newPart.id, parentId}));
  };
}

type PartChanges = {
  id: string,
  changes: Omit<Part, 'id' | 'calc'>
}

export function savePartUpdates(partChanges: PartChanges) {
  return (dispatch: AppDispatch) => {
    dispatch(updatePart(partChanges));
    dispatch(recalculateActiveProject());
  };
}

export type PartPartial = Partial<Omit<Part, 'id'>>

export function savePartPartial(partId: string, changes: PartPartial) {
  return (dispatch: AppDispatch) => {
    const update = { id: partId, changes };
    dispatch(updatePart(update));
    dispatch(recalculateActiveProject());
  }
}

export function getPartMaterial(part: Part, state: RootState): Material {
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

function calculateBdft(part: Part, material: Material): MaterialList {
  const bdft = +((part.l * part.w * material.thickness) / 144).toFixed(3);
  const cost = +(bdft * material.cost).toFixed(2);
  return {
    totalCost: cost,
    ids: [material.id],
    entities: {
      [material.id]: {
        id: material.id,
        type: BDFT.id,
        amt: bdft,
        cost,
      }
    }
  };
}

function calculateLft(part: Part, material: Material): MaterialList {
  const lft = +(part.l / 12).toFixed(3);
  const cost = +(lft * material.cost).toFixed(2);
  return {
    totalCost: cost,
    ids: [material.id],
    entities: {
      [material.id]: {
        id: material.id,
        type: LFT.id,
        amt: lft,
        cost,
      }
    }
  };
}

function calculateSqft(part: Part, material: Material): MaterialList {
  const sqft = +((part.l * part.w) / 144).toFixed(3);
  const cost = +(sqft * material.cost).toFixed(2);
  return {
    totalCost: cost,
    ids: [material.id],
    entities: {
      [material.id]: {
        id: material.id,
        type: SQFT.id,
        amt: sqft,
        cost,
      }
    }
  };
}

function calculateMisc(part: Part, material: Material): MaterialList {
  return {
    totalCost: part.c,
    ids: [material.id],
    entities: {
      [material.id]: {
        id: material.id,
        type: MISC.id,
        amt: 0,
        cost: part.c,
      }
    }
  };
}

export function calculatePart(part: Part, material: Material): MaterialList {
  switch (material.type) {
    case BDFT.id: return calculateBdft(part, material);
    case LFT.id: return calculateLft(part, material);
    case SQFT.id: return calculateSqft(part, material);
    case MISC.id: return calculateMisc(part, material);
    default: return calculateBdft(part, material);
  }
}