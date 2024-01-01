import { useSelector } from 'react-redux';
import { RootState } from '../../data/store.ts';
import { useAppDispatch } from '../../data/store.ts';
import { setActiveDetails } from '../../data/displaySlice.ts';

function PartLink(props: {partId: string, parentId: string, highlight?: boolean}) {
  const { partId, parentId, highlight = false } = props;
  const part = useSelector((state: RootState) => state.parts.entities[partId]);
  const dispatch = useAppDispatch();
  const background = highlight ? 'bg-gray-200' : '';

  if (!part) return null;
  return (
    <h2
      className={`hover:cursor-pointer hover:underline ${background}`}
      onClick={() => dispatch(setActiveDetails({ id: partId, parentId }))}
    >
      {part.title ? part.title : '(empty title)'}
    </h2>
  )
}

export default PartLink;