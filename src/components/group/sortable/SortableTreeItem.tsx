import {  useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CHILD_OFFSET } from './utilities.ts';
import TreeItem from './TreeItem.tsx';
import { ComponentProps } from 'react';

type Props = ComponentProps<typeof TreeItem> & {
  collapsed: boolean,
  active: boolean,
  dropDepth: number,
}

function SortableTreeItem(props: Props) {
  const {
    item,
    collapsed,
    active,
    dropDepth,
    ...treeItemProps
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
        <TreeItem
          {...treeItemProps}
          item={item}
          shadow={active}
          handleAttributes={attributes}
          handleListeners={listeners}
        />
      </div>
    </div>
  );
}

export default SortableTreeItem;