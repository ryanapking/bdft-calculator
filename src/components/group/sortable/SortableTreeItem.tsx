import {  useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CHILD_OFFSET, SortableChild } from './utilities.ts';
import TreeItem from './TreeItem.tsx';
import { PropsWithChildren } from 'react';

type Props = {
  item: SortableChild,
  collapsed: boolean,
  active: boolean,
  dropDepth: number,
}

function SortableTreeItem(props: PropsWithChildren<Props>) {
  const {
    item,
    collapsed,
    active,
    dropDepth,
    children,
  } = props;

  const {
    attributes,
    listeners,
    setNodeRef,
    transition,
    transform,
  } = useSortable(
    {
      id: item.id,
      data: {
        id: item.id,
        parent: item.parent,
        depth: item.depth,
        index: item.index,
      }
    }
  );

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  const paddingLeft = {
    paddingLeft: active ? dropDepth * CHILD_OFFSET + 'px' : item.depth * CHILD_OFFSET + 'px',
  }

  if (collapsed) return null;

  return (
    <div style={paddingLeft}>
      <div style={style} ref={setNodeRef}>
        <TreeItem shadow={active} item={item} handleAttributes={attributes} handleListeners={listeners}>
          {children}
        </TreeItem>
      </div>
    </div>
  )
}

export default SortableTreeItem;