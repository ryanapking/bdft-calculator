import { useAppDispatch } from '../../data/store.ts';
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DraggableAttributes,
  DragOverlay,
  DragStartEvent,
} from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { RxDragHandleDots2 } from 'react-icons/rx';
import { reorderProjectMaterial } from '../../data/projectActions.ts';
import { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';
import { useState } from 'react';
import MaterialInlineForm from './MaterialInlineForm.tsx';

type ListItemProps = {
  materialId: string,
  handleAttributes?: DraggableAttributes,
  handleListeners?: undefined|SyntheticListenerMap
}

function ListItem(props: ListItemProps) {
  const {
    materialId,
    handleAttributes = null,
    handleListeners = null
  } = props;

  return (
    <div className='flex p-3 items-center border bg-white'>
      <div className='p-2 mr-3 hover:bg-gray-100 hover:cursor-grab rounded' {...handleAttributes} {...handleListeners}>
        <RxDragHandleDots2 size={15}/>
      </div>
      <MaterialInlineForm materialId={materialId} />
    </div>
  );
}

function SortableListItem({ materialId, active }: { materialId: string, active: boolean }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transition,
    transform,
  } = useSortable({
    id: materialId,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  return (
    <div style={style} ref={setNodeRef} className={active ? 'bg-gray-200' : ''}>
      <div className={active ? 'invisible' : ''}>
        <ListItem materialId={materialId} handleAttributes={attributes} handleListeners={listeners} />
      </div>
    </div>
  );
}

function MaterialListSortable(props: { projectId: string, list: Array<string>}) {
  const { list, projectId } = props;
  const dispatch = useAppDispatch();
  const [ activeId, setActiveId ] = useState<null|string>(null)

  function handleDragStart(e: DragStartEvent) {
    setActiveId(e.active.id.toString());
  }

  function handleDragEnd(e: DragEndEvent) {
    setActiveId(null);
    const activeIndex = e.active.data.current?.sortable.index;
    const overIndex = e.over?.data.current?.sortable.index;
    const materialId = e.active.id.toString();
    if (activeIndex === overIndex) return;
    dispatch(reorderProjectMaterial(projectId, materialId, activeIndex, overIndex))
  }

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      collisionDetection={closestCenter}
    >
      <SortableContext items={list} strategy={verticalListSortingStrategy}>
        {list.map(materialId => (
          <SortableListItem
            key={materialId}
            materialId={materialId}
            active={materialId === activeId}
          />
        ))}
      </SortableContext>
      <DragOverlay>
        {activeId ? <ListItem materialId={activeId} /> : null}
      </DragOverlay>
    </DndContext>
  );
}

export default MaterialListSortable;