import { customAlphabet } from "nanoid";

export type DataType = {
  idPrefix: string;
}

export const PROJECT: DataType = {
  idPrefix: 'X',
};

export const MATERIAL: DataType = {
  idPrefix: 'M',
};

export const GROUP: DataType = {
  idPrefix: 'G',
};

export const PART: DataType = {
  idPrefix: 'P',
};

export function getDataTypeFromId(id: string): DataType {
  const prefix = id.charAt(0);
  switch (prefix) {
    case 'X': return PROJECT;
    case 'M': return MATERIAL;
    case 'G': return GROUP;
    default: return PART;
  }
}

const alphabet = '1234567890abcdefghijklmnopqrstuvwxyz';
const nanoid = customAlphabet(alphabet, 16);
export function getId(type: DataType) {
  return type.idPrefix + nanoid();
}

export interface MaterialType {
  label: string,
  shorthand: string,
  id: string,
  partFields: Array<string>,
}

export const BDFT: MaterialType = {
  label: 'Board Feet',
  shorthand: 'bdft',
  id: 'bdft',
  partFields: ['l', 'w'],
};

export const SQFT: MaterialType = {
  label: 'Square Feet',
  shorthand: 'sqft',
  id: 'sqft',
  partFields: ['l', 'w'],
};

export const LFT: MaterialType = {
  label: 'Linear Feet',
  shorthand: 'lft',
  id: 'lft',
  partFields: ['l'],
}

export const MISC: MaterialType = {
  label: 'Miscellaneous',
  shorthand: 'misc',
  id: 'misc',
  partFields: ['c'],
}

export const MATERIALS_TYPES: Array<MaterialType> = [
  BDFT,
  LFT,
  SQFT,
];

export function getMaterialTypeFromId(id: string): MaterialType {
  switch (id) {
    case BDFT.id: return BDFT;
    case SQFT.id: return SQFT;
    case LFT.id: return LFT;
    case MISC.id: return MISC;
    default: return BDFT;
  }
}

export const THICKNESSES = [
  {label: '4/4', value: 1},
  {label: '5/4', value: 1.25},
  {label: '6/4', value: 1.5},
  {label: '8/4', value: 2},
  {label: '12/4', value: 3},
]