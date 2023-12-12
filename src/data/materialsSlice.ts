import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BDFT } from './dataTypes.ts';

export const THICKNESSES = [
  {label: '4/4', value: 1},
  {label: '5/4', value: 1.25},
  {label: '6/4', value: 1.5},
  {label: '8/4', value: 2},
  {label: '12/4', value: 3},
]

// The structure of an individual project
export interface Material {
  title: string,
  cost: number,
  type: string,
  thickness: number,
}

function newMaterial(): Material {
  return {
    title: 'New Material',
    cost: 3,
    type: BDFT.id,
    thickness: 1,
  };
}

function filteredMaterial(material: Material): Material {
  return {
    title: material.title,
    cost: material.cost,
    type: material.type,
    thickness: material.thickness,
  }
}

export interface MaterialsState {
  all: { [key: string]: Material },
}

const initialState: MaterialsState = {
  all: {},
}

export const materialsSlice = createSlice({
  name: 'materials',
  initialState,
  reducers: {
    create: (state, action: PayloadAction<string>) => {
      state.all[action.payload] = newMaterial();
    },
    destroy: (state, action: PayloadAction<string|Array<string>>) => {
      const toDestroy = typeof action.payload === 'string' ? [action.payload] : action.payload;
      toDestroy.forEach(id => delete state.all[id]);
    },
    update: (state, action: PayloadAction<{ materialId: string, material: Material }>) => {
      const { materialId, material } = action.payload;
      state.all[materialId] = filteredMaterial(material);
    }
  },
})

// Action creators are generated for each case reducer function
export const {
  create,
  destroy,
  update,
} = materialsSlice.actions

export default materialsSlice.reducer