import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../../data/store.ts';
import { ChildRelocation, relocateChild } from '../../../data/groupActions.ts';
import { getDataTypeFromId, GROUP } from '../../../data/dataTypes.ts';
import {
  Active,
  closestCenter,
  DndContext,
  DragEndEvent,
  DragMoveEvent,
  DragOverlay,
  DragStartEvent,
  Over,
  UniqueIdentifier
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CHILD_OFFSET, gatherSortableChildren, SortableChild } from './utilities.ts';
import SortableTreeItem from './SortableTreeItem.tsx';
import { useState } from 'react';
import TreeItem from './TreeItem.tsx';

function SortableProjectTree() {
  const dispatch = useAppDispatch();
  const project = useSelector((state: RootState) => state.projects.entities[state.display.activeProject]);
  const allGroups = useSelector((state: RootState) => state.groups.entities);
  const allParts = useSelector((state: RootState) => state.parts.entities);
  const mainGroup = allGroups[project.mainGroup];
  const sortableChildren = gatherSortableChildren(allGroups, allParts, mainGroup);

  const [ activeItem, setActiveItem ] = useState<SortableChild|null>(null);
  const [ dropDepth, setDropDepth ] = useState<number>(0);

  function calculateRelocation(activeItem: SortableChild, activeIndex: number, dropIndex: number, dropDepth: number): ChildRelocation {
    // If we are moving an item from before, we need to account for that
    const searchIndex = activeIndex < dropIndex ? dropIndex : dropIndex - 1;

    let newParent: UniqueIdentifier = mainGroup.id;
    for (let i = searchIndex; i > 0; i--) {
      const item = sortableChildren[i];
      if (item.depth < dropDepth) {
        newParent = item.id;
        break;
      }
    }

    let newIndex = 0;
    for (let i = searchIndex; i >= 0; i--) {
      const item = sortableChildren[i];
      if (item.parent === newParent) {
        newIndex = item.index > activeIndex ? item.index : item.index + 1;
        break;
      }
      if (item.id === newParent) break;
    }

    return {
      id: activeItem.id.toString(),
      oldParent: activeItem.parent.toString(),
      newParent: newParent.toString(),
      newIndex,
    };
  }

  function calculateDropDepth(active: Active, over: Over, xOffset: number): number {
    const offsetDepth = active.data.current?.depth + Math.round(xOffset / CHILD_OFFSET);
    const dropIndex = over.data.current?.sortable.index;

    const activeIndex = active.data.current?.sortable.index;
    const activeItem = sortableChildren[activeIndex];
    const activeEndIndex = activeIndex + activeItem.descendants.length;

    let aboveIndex = dropIndex;
    if (aboveIndex <= activeIndex) aboveIndex = dropIndex - 1;
    const above = sortableChildren[aboveIndex];
    if (!above) return 0; // this would be the very top

    let belowIndex = dropIndex + 1;
    if (belowIndex <= activeIndex) belowIndex = dropIndex;
    if (belowIndex >= activeIndex && belowIndex <= activeEndIndex) belowIndex = activeEndIndex + 1;
    const below = sortableChildren[belowIndex];

    const aboveIsGroup = getDataTypeFromId(above.id.toString()) === GROUP;
    const aboveHasChildren = aboveIsGroup && below?.parent === above.id;

    const maxDepth = aboveIsGroup ? above.depth + 1 : above.depth;
    let minDepth = below?.depth ?? 0;
    if (aboveHasChildren) minDepth = above.depth + 1;

    if (offsetDepth > maxDepth) return maxDepth;
    else if (offsetDepth < minDepth) return minDepth;
    return offsetDepth;
  }

  function handleDragStart(e: DragStartEvent) {
    const activeIndex = e.active.data.current?.sortable.index;
    const newActive = sortableChildren[activeIndex] ?? sortableChildren.find(child => child.id === e.active.id);
    setActiveItem(newActive ?? null);
    setDropDepth(newActive?.depth ?? 0);
  }

  function handleDragMove(e: DragMoveEvent) {
    if (!e.over) return;
    setDropDepth(calculateDropDepth(e.active, e.over, e.delta.x));
  }

  function handleDragCancel() {
    setActiveItem(null);
  }

  function handleDragEnd(e: DragEndEvent) {
    setActiveItem(null);
    // setDropDepth(0);

    if (!e.over) return;

    const dropIndex = e.over?.data.current?.sortable.index;
    const activeIndex = e.active.data.current?.sortable.index;
    if (typeof dropIndex !== 'number' || typeof activeIndex !== 'number') return;

    const activeItem = sortableChildren[activeIndex];
    if (!activeItem) return;

    const dropDepth = calculateDropDepth(e.active, e.over, e.delta.x);
    const relocation = calculateRelocation(activeItem, activeIndex, dropIndex, dropDepth);
    dispatch(relocateChild(relocation));
  }

  function printSortableChildren() {
    return sortableChildren.map((item) => {
      return (
        <SortableTreeItem
          key={item.id}
          item={item}
          dropDepth={dropDepth}
          active={item.id === activeItem?.id}
          collapsed={activeItem?.descendants.includes(item.id)}
        />
      );
    });
  }

  return (
    <div className='max-w-xl mb-96'>
      <DndContext
        onDragEnd={handleDragEnd}
        onDragMove={handleDragMove}
        onDragStart={handleDragStart}
        onDragCancel={handleDragCancel}
        collisionDetection={closestCenter}
      >
        <SortableContext items={sortableChildren} strategy={verticalListSortingStrategy}>
          {printSortableChildren()}
        </SortableContext>

        <DragOverlay>
          {activeItem ? <TreeItem item={activeItem} dragging /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

export default SortableProjectTree;