import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// The structure of an individual project
interface Material {
  title: string,
}

function newMaterial(): Material {
  return {
    title: 'Material Title'
  };
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
      console.log('destroying materials: ', toDestroy);
      toDestroy.forEach(id => delete state.all[id]);
    },
  },
})

// Action creators are generated for each case reducer function
export const {
  create,
  destroy,
} = materialsSlice.actions

export default materialsSlice.reducer