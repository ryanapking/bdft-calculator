import { useSelector } from 'react-redux';
import { RootState } from '../data/store.ts';

function Part(props: {partId: string}) {
  const { partId} = props;
  const part = useSelector((state: RootState) => state.parts.all[partId]);
  return (
    <>
      <h1>Part : {partId} : {part.title}</h1>
    </>
  )
}

export default Part;