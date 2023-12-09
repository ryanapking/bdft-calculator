import { useSelector } from 'react-redux';
import { RootState } from '../data/store.ts';
import { useAppDispatch } from '../data/store.ts';
import { setActiveDetails } from '../data/displaySlice.ts';

function PartLink(props: {partId: string, parentId: string}) {
  const { partId, parentId } = props;
  const part = useSelector((state: RootState) => state.parts.all[partId]);
  const dispatch = useAppDispatch();
  return (
    <>
      <h1 onClick={() => dispatch(setActiveDetails({ id: partId, parentId }))}>Part : {partId} : {part.title}</h1>
    </>
  )
}

export default PartLink;