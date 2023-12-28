import { CHILD_OFFSET, SortableChild } from './utilities.ts';
import { RxDragHandleDots2 } from "react-icons/rx";
import { DraggableAttributes } from '@dnd-kit/core';
import { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';

type Props = {
  item: SortableChild,
  shadow?: boolean,
  dragging?: boolean,
  handleAttributes?: null | DraggableAttributes,
  handleListeners?: null | SyntheticListenerMap,
}

function TreeItem(props: Props) {
  const {
    item,
    dragging = false,
    shadow = false,
    handleAttributes = null,
    handleListeners = null,
  } = props;

  const style = dragging ? {
    transform: `translate(${CHILD_OFFSET * item.depth + 40}px)`,
  } : {};

  return (
    <div className={`border ${shadow ? 'bg-gray-200' : 'bg-white'}`} style={style}>
      <div className={`p-3 flex items-center ${shadow ? 'invisible' : ''}`}>
        <div
          className='p-2 mr-3 hover:bg-gray-100 hover:cursor-grab rounded' {...handleAttributes} {...handleListeners}>
          <RxDragHandleDots2 size={15}/>
        </div>
        <div className='flex gap-2'>
          {item.title}
          {dragging && item.descendants.length ?
            <div className='bg-red-400 p-2 rounded-full text-xs w-6 h-6 flex justify-center items-center'>{item.descendants.length + 1}</div>
            : null
          }
        </div>
      </div>
    </div>
  )
}

export default TreeItem;