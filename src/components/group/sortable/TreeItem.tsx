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

  const bg = shadow ? 'bg-gray-400' : 'bg-white';
  const style = dragging ? {
    transform: `translate(${CHILD_OFFSET * item.depth + 40}px)`,
  } : {};

  return (
    <div className={`border ${bg}`} style={style}>
      <div className={`p-3 flex items-center ${shadow ? 'invisible' : ''}`}>
        <button className='p-2 mr-3 hover:bg-gray-100 hover:cursor-grab rounded' {...handleAttributes} {...handleListeners} tabIndex={-1}>
          <RxDragHandleDots2 size='1rem'/>
        </button>
        {children}
      </div>
    </div>
  )
}

export default TreeItem;