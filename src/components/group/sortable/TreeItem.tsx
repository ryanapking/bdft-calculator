import { CHILD_OFFSET, SortableChild } from './utilities.ts';
import { RxDragHandleDots2 } from "react-icons/rx";
import { DraggableAttributes } from '@dnd-kit/core';
import { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';
import { PropsWithChildren } from 'react';
import { Checkbox } from 'flowbite-react';

type Props = {
  item: SortableChild,
  shadow?: boolean,
  dragging?: boolean,
  selected?: boolean,
  showSelector?: boolean,
  onSelectChange?: (selected: boolean) => void
  handleAttributes?: null | DraggableAttributes,
  handleListeners?: null | SyntheticListenerMap,
}

function TreeItem(props: PropsWithChildren<Props>) {
  const {
    item,
    children,
    dragging = false,
    shadow = false,
    selected = false,
    showSelector = true,
    onSelectChange = () => {},
    handleAttributes = null,
    handleListeners = null,
  } = props;

  const shadowBg = shadow ? 'bg-gray-400' : 'bg-white';
  const selectedBg = selected ? 'bg-gray-100' : '';
  const style = dragging ? {
    transform: `translate(${CHILD_OFFSET * item.depth + 40}px)`,
  } : {};

  return (
    <div className={`relative p-1 border ${shadowBg}`} style={style}>
      <div className={`p-2 flex items-center ${selectedBg} ${shadow ? 'invisible' : ''}`}>
        <button className='p-2 mr-3 hover:bg-gray-100 hover:cursor-grab rounded' {...handleAttributes} {...handleListeners} tabIndex={-1}>
          <RxDragHandleDots2 size='1rem'/>
        </button>
        {children}
      </div>
      {showSelector ?
        <div className='absolute inset-0 flex items-center hover:cursor-pointer' onClick={() => onSelectChange(!selected)}>
          <Checkbox onChange={() => onSelectChange(!selected)} className='ml-5 hover:cursor-pointer' checked={selected}/>
        </div>
        : null
      }
    </div>
  )
}

export default TreeItem;