import { Group, GroupEntities } from '../../../data/groupsSlice.ts';
import { Part, PartEntities } from '../../../data/partsSlice.ts';
import { getDataTypeFromId, GROUP } from '../../../data/dataTypes.ts';

export type SortableChild = {
  id: string,
  parent: string,
  depth: number,
  index: number,
};

export type SortableChildren = Array<SortableChild>;

export function projectDropLocation() {

}

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
      parent: group.id,
      depth: depth,
      index: currentIndex,
    };

    return [...childList, childSortable, ...grandChildren];
  }, []);
}