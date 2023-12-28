import { Group, GroupEntities } from '../../../data/groupsSlice.ts';
import { Part, PartEntities } from '../../../data/partsSlice.ts';
import { getDataTypeFromId, GROUP } from '../../../data/dataTypes.ts';
import { UniqueIdentifier } from '@dnd-kit/core';

export const CHILD_OFFSET = 25;

export type SortableChild = {
  id: UniqueIdentifier,
  title: string,
  parent: UniqueIdentifier,
  depth: number,
  index: number,
  descendants: Array<UniqueIdentifier>,
};

export type SortableChildren = Array<SortableChild>;

export function gatherSortableChildren(allGroups: GroupEntities, allParts: PartEntities, group: Group, depth = 0): SortableChildren {
  return group.children.reduce((childList: SortableChildren, childId, currentIndex) => {
    let child: Group | Part;
    let grandChildren: SortableChildren = [];

    if (getDataTypeFromId(childId) === GROUP) {
      child = allGroups[childId];
      grandChildren = gatherSortableChildren(allGroups, allParts, child, depth + 1);
    } else {
      child = allParts[childId];
    }

    const childSortable = {
      id: child.id,
      title: child.title,
      parent: group.id,
      depth: depth,
      index: currentIndex,
      descendants: grandChildren.map(child => child.id),
    };

    return [...childList, childSortable, ...grandChildren];
  }, []);
}