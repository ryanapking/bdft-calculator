import { JSONSchemaType } from 'ajv';
import {
  Material,
  MaterialList,
  MaterialUsageSummary
} from '../../../data/materialsSlice.ts';
import { Project } from '../../../data/projectsSlice.ts';
import { Group } from '../../../data/groupsSlice.ts';
import { Part } from '../../../data/partsSlice.ts';
import { ProjectExport } from '../../../data/projectActions.ts';

const materialSchema: JSONSchemaType<Material> = {
  type: 'object',
  properties: {
    id: {type: 'string'},
    title: {type: 'string'},
    cost: {type: 'number'},
    type: {type: 'string'},
    thickness: {type: 'number'},
    waste: {type: 'number'},
    notes: {type: 'string'},
  },
  required: ['id', 'title', 'cost', 'type', 'thickness', 'waste', 'notes'],
  additionalProperties: false,
};

const materialUsageSummarySchema: JSONSchemaType<MaterialUsageSummary> = {
  type: 'object',
  properties: {
    id: {type: 'string'},
    type: {type: 'string'},
    amt: {type: 'number'},
    cost: {type: 'number'},
  },
  required: ['id', 'type', 'amt', 'cost'],
  additionalProperties: false,
};

const materialListSchema: JSONSchemaType<MaterialList> = {
  type: 'object',
  properties: {
    totalCost: {type: 'number'},
    ids: {type: 'array', items: {type: 'string'}},
    entities: {
      type: 'object',
      patternProperties: {
        '^.*$': materialUsageSummarySchema,
      },
      required: [],
    }
  },
  required: ['totalCost', 'ids', 'entities'],
  additionalProperties: false,
};

const partSchema: JSONSchemaType<Part> = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    title: { type: 'string' },
    qty: {  type: 'number' },
    c: {  type: 'number' },
    l: {  type: 'number' },
    w: {  type: 'number' },
    h: {  type: 'number' },
    m: { type: 'string' },
    notes: {type: 'string'},
    calc: materialListSchema,
  },
  required: ['id', 'title', 'qty', 'c', 'l', 'w', 'h', 'm', 'notes'],
  additionalProperties: false,
}

const groupSchema: JSONSchemaType<Group> = {
  type: 'object',
  properties: {
    id: {type: 'string'},
    title: {type: 'string'},
    children: {type: 'array', items: {type: 'string'}},
    qty: {type: 'number'},
    notes: {type: 'string'},
    calc: materialListSchema,
  },
  required: ['id', 'title', 'children', 'qty', 'calc', 'notes'],
  additionalProperties: false,
}


const projectSchema: JSONSchemaType<Project> = {
  type: 'object',
  properties: {
    id: {type: 'string'},
    title: {type: 'string'},
    mainGroup: {type: 'string'},
    materials: {type: 'array', items: {type: 'string'}},
    defaultMaterial: {type: 'string'},
    miscMaterial: {type: 'string'},
    notes: {type: 'string'},
  },
  required: ['id', 'title', 'mainGroup', 'materials', 'defaultMaterial', 'miscMaterial', 'notes'],
  additionalProperties: false,
}

export const projectImportSchema: JSONSchemaType<ProjectExport> = {
  type: 'object',
  properties: {
    project: projectSchema,
    groups: {
      type: 'object',
      patternProperties: {
        '.*': groupSchema,
      },
      required: [],
    },
    parts: {
      type: 'object',
      patternProperties: {
        '.*': partSchema,
      },
      required: [],
    },
    materials: {
      type: 'object',
      patternProperties: {
        '.*': materialSchema,
      },
      required: [],
    },
  },
  required: ['project', 'groups', 'parts', 'materials'],
  additionalProperties: false,
};