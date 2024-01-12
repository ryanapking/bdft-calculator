import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../../data/store.ts';
import { addGroup, ChildRelocation, relocateChild } from '../../../data/groupActions.ts';
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
import { Badge, Button, Dropdown } from 'flowbite-react';
import InlineGroupForm from './InlineGroupForm.tsx';
import InlinePartForm from './InlinePartForm.tsx';
import { setPendingBulkDelete } from '../../../data/displaySlice.ts';
import { addPart } from '../../../data/partActions.ts';

function SortableGroupTree({ groupId }: {groupId: string}) {
  const dispatch = useAppDispatch();
  const allGroups = useSelector((state: RootState) => state.groups.entities);
  const allParts = useSelector((state: RootState) => state.parts.entities);
  const group = allGroups[groupId];
  const sortableChildren = gatherSortableChildren(allGroups, allParts, group);

  const [ activeItem, setActiveItem ] = useState<SortableChild|null>(null);
  const [ dropDepth, setDropDepth ] = useState<number>(0);
  const [ autoFocusIndex, setAutoFocusIndex ] = useState(0);
  const [ showSelectors, setShowSelectors ] = useState(false);
  const [ selection, setSelection ] = useState<Array<string>>([]);

  function setSelector(item: SortableChild, checked: boolean) {
    if (checked) selectItem(item)
    else deselectItem(item);
  }

  function selectItem(item: SortableChild) {
    const itemId = item.id.toString();
    const descendants = item.descendants.map(id => id.toString());
    const newSelection = [...selection, itemId, ...descendants];
    setSelection([ ...new Set(newSelection)]);
  }

  function deselectItem(item: SortableChild) {
    const itemId = item.id.toString();
    const descendants = item.descendants.map(id => id.toString());
    const ancestors = sortableChildren
      .filter(item => {
        return item.descendants.includes(itemId);
      })
      .map(item => item.id.toString());
    const removeItems = [ itemId, ...descendants, ...ancestors];
    const newSelection = selection.filter(currentId => !removeItems.includes(currentId));
    setSelection(newSelection);
  }

  function changeSelectingStatus() {
    setSelection([]);
    setShowSelectors(!showSelectors);
  }

  function deleteSelection() {
    const deleteItems = sortableChildren
      .filter(item => selection.includes(item.id.toString()))
      .map(item => ({id: item.id.toString(), parentId: item.parent.toString()}));

    dispatch(setPendingBulkDelete(deleteItems));
  }

  function calculateRelocation(activeItem: SortableChild, activeIndex: number, dropIndex: number, dropDepth: number): ChildRelocation {
    // If we are moving an item from before, we need to account for that
    const searchIndex = activeIndex < dropIndex ? dropIndex : dropIndex - 1;

    let newParent: UniqueIdentifier = group.id;
    for (let i = searchIndex; i >= 0; i--) {
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
        newIndex = item.index + 1;
        if (activeItem.parent === item.parent && activeItem.index < item.index) newIndex--;
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
    setDropDepth(0);

    if (!e.over) return;

    const dropIndex = e.over?.data.current?.sortable.index;
    const activeIndex = e.active.data.current?.sortable.index;
    if (typeof dropIndex !== 'number' || typeof activeIndex !== 'number') return;

    const activeItem = sortableChildren[activeIndex];
    if (!activeItem) return;

    const depth = calculateDropDepth(e.active, e.over, e.delta.x);
    const relocation = calculateRelocation(activeItem, activeIndex, dropIndex, depth);
    dispatch(relocateChild(relocation));
  }

  function printInlineForm(index: number, item: SortableChild) {
    if (getDataTypeFromId(item.id.toString()) === GROUP) {
      return (
        <InlineGroupForm
          groupId={item.id.toString()}
          autoFocus={index === autoFocusIndex}
          focusNext={() => setAutoFocusIndex(index + 1)}
        />
      );
    }

    return (
      <InlinePartForm
        partId={item.id.toString()}
        parentId={item.parent.toString()}
        partIndex={item.index}
        autoFocus={index === autoFocusIndex}
        focusNext={() => setAutoFocusIndex(index + 1)}
      />
    );
  }

  return (
    <div className='w-full max-w-5xl mb-96'>
      <div className='flex justify-between items-end py-3'>
        <h3 className='text-xl font-light'>Components:</h3>
        <div className='flex gap-3'>
          <Dropdown label="Add" color='gray' dismissOnClick={false}>
            <Dropdown.Item onClick={() => dispatch(addPart(groupId, 0, false))}>Component</Dropdown.Item>
            <Dropdown.Item onClick={() => dispatch(addGroup(groupId, 0, false))}>Subgroup</Dropdown.Item>
          </Dropdown>
          <Button color='gray' onClick={changeSelectingStatus}>{showSelectors ? 'Cancel Delete' : 'Delete'}</Button>
          {showSelectors
            ? <Button disabled={selection.length < 1} color='failure' onClick={() => deleteSelection()}>{'Delete Selected'}</Button>
            : null
          }
        </div>
      </div>
      <div className='bg-gray-200 pl-1'>
        <DndContext
          onDragEnd={handleDragEnd}
          onDragMove={handleDragMove}
          onDragStart={handleDragStart}
          onDragCancel={handleDragCancel}
          collisionDetection={closestCenter}
        >
          <SortableContext items={sortableChildren} strategy={verticalListSortingStrategy}>
            {sortableChildren.map((item, index) => (
              <SortableTreeItem
                key={item.id}
                item={item}
                selected={showSelectors && selection.includes(item.id.toString())}
                showSelector={showSelectors}
                onSelectChange={selected => setSelector(item, selected)}
                dropDepth={dropDepth}
                active={item.id === activeItem?.id}
                collapsed={!!activeItem && activeItem.descendants.includes(item.id)}
              >
                {printInlineForm(index, item)}
              </SortableTreeItem>
            ))}
          </SortableContext>

          <DragOverlay>
            {activeItem ?
              <TreeItem item={activeItem} dragging>
                {activeItem.title}
                {activeItem.descendants.length ?
                  <Badge color='failure' className='ml-3'>{activeItem.descendants.length + 1}</Badge>
                  : null
                }
              </TreeItem>
              : null
            }
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
}

export default SortableGroupTree;