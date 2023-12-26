import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../../data/store.ts';
import { moveChild, reHomeChild } from '../../../data/groupActions.ts';
import { getDataTypeFromId, GROUP } from '../../../data/dataTypes.ts';
import { closestCenter, DndContext, DragEndEvent } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import { gatherSortableChildren } from './utilities.ts';
import SortableProjectItem from './SortableProjectItem.tsx';

function SortableProjectTree() {
  const dispatch = useAppDispatch();
  const project = useSelector((state: RootState) => state.projects.entities[state.display.activeProject]);
  const allGroups = useSelector((state: RootState) => state.groups.entities);
  const allParts = useSelector((state: RootState) => state.parts.entities);
  const mainGroup = allGroups[project.mainGroup];
  const sortableChildren = gatherSortableChildren(allGroups, allParts, mainGroup);


  function handleDragEnd(e: DragEndEvent) {
    const { active, over} = e;

    if (!over) return;
    if (active.id === over.id) return;

    const dropped = {
      id: active.data.current?.id,
      index: active.data.current?.index,
      parent: active.data.current?.parentId,
    }

    const on = {
      id: over.data.current?.id,
      index: over.data.current?.index,
      parent: over.data.current?.parentId,
    }

    console.log('dropped: ', dropped);
    console.log('on: ', on);

    if (getDataTypeFromId(on.id) === GROUP && dropped.parent !== on.id) {
      // Dropped on a group...
      dispatch(reHomeChild({
        childId: dropped.id,
        fromGroupId: dropped.parent,
        toGroupId: on.id,
        toIndex: 0,
      }));
    } else if (dropped.parent === on.parent) {
      // siblings - reorder
      dispatch(moveChild(dropped.parent, dropped.id, dropped.index, on.index));
    } else {
      // not siblings - re-home
      dispatch(reHomeChild({
        childId: dropped.id,
        fromGroupId: dropped.parent,
        toGroupId: on.parent,
        toIndex: on.index,
      }));
    }
  }

  return (
    <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCenter}>
      <SortableContext items={sortableChildren}>
        {sortableChildren.map(item => <SortableProjectItem key={item.id} item={item} />)}
      </SortableContext>
    </DndContext>
  );
}

export default SortableProjectTree;