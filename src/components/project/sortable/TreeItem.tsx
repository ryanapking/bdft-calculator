import { CHILD_OFFSET, SortableChild } from './utilities.ts';
import { RxDragHandleDots2 } from "react-icons/rx";
import { DraggableAttributes } from '@dnd-kit/core';
import { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';
import { PropsWithChildren } from 'react';

type Props = {
  item: SortableChild,
  shadow?: boolean,
  dragging?: boolean,
  handleAttributes?: null | DraggableAttributes,
  handleListeners?: null | SyntheticListenerMap,
}

function TreeItem(props: PropsWithChildren<Props>) {
  const {
    item,
    children,
    dragging = false,
    shadow = false,
    handleAttributes = null,
    handleListeners = null,
  } = props;

  const style = dragging ? {
    transform: `translate(${CHILD_OFFSET * item.depth + 40}px)`,
  } : {};

  return (
    <div className={shadow ? 'bg-gray-200 border' : 'bg-white border'} style={style}>
      <div className={`p-3 flex items-center ${shadow ? 'invisible' : ''}`}>
        <div className='p-2 mr-3 hover:bg-gray-100 hover:cursor-grab rounded' {...handleAttributes} {...handleListeners}>
          <RxDragHandleDots2 size={15}/>
        </div>
        {children}
      </div>
    </div>
  )
}

export default TreeItem;