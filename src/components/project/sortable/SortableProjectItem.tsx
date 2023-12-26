import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { SortableChild } from './utilities.ts';

function SortableProjectItem(props: { item: SortableChild }) {
  const { item } = props;
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable(
    {
      id: item.id,
      data: {
        id: item.id,
        parentId: item.parent,
        depth: item.depth,
        index: item.index,
      }
    }
  );

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    paddingLeft: item.depth * 25 + 'px',
  };

  return (
    <div style={style} ref={setNodeRef} {...attributes} {...listeners} >
      {item.id}
    </div>
  )
}

export default SortableProjectItem;