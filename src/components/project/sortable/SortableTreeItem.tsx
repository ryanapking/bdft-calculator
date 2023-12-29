import {  useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CHILD_OFFSET, SortableChild } from './utilities.ts';
import TreeItem from './TreeItem.tsx';
import { getDataTypeFromId, GROUP } from '../../../data/dataTypes.ts';
import GroupInlineForm from '../../group/GroupInlineForm.tsx';
import PartInlineForm from '../../part/PartInlineForm.tsx';

type Props = {
  item: SortableChild,
  collapsed?: boolean,
  active?: boolean,
  dropDepth?: number,
}

function SortableTreeItem(props: Props) {
  const {
    item,
    collapsed = false,
    active = false,
    dropDepth = 0,
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

  const itemType = getDataTypeFromId(item.id.toString());

  return (
    <div style={paddingLeft}>
      <div style={style} ref={setNodeRef}>
        <TreeItem shadow={active} item={item} handleAttributes={attributes} handleListeners={listeners}>
          {itemType === GROUP ? <GroupInlineForm groupId={item.id.toString()} /> : <PartInlineForm partId={item.id.toString()} />}
        </TreeItem>
      </div>
    </div>
  )
}

export default SortableTreeItem;