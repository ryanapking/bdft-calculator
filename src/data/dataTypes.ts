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

export function getDataTypeFromId(id: string): DataType|undefined {
  const prefix = id.charAt(0);
  switch (prefix) {
    case 'X': return PROJECT;
    case 'M': return MATERIAL;
    case 'G': return GROUP;
    case 'P': return PART;
  }
}

const alphabet = '1234567890abcdefghijklmnopqrstuvwxyz';
const nanoid = customAlphabet(alphabet, 16);
export function getId(type: DataType) {
  return type.idPrefix + nanoid();
}