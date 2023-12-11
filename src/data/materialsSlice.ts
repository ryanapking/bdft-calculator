import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BDFT } from './dataTypes.ts';

// The structure of an individual project
export interface Material {
  title: string,
  cost: number,
  type: string,
}

function newMaterial(): Material {
  return {
    title: 'New Material',
    cost: 3,
    type: BDFT.id,
  };
}

function filteredMaterial(material: Material): Material {
  return {
    title: material.title,
    cost: material.cost,
    type: material.type,
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