import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../data/store.ts';
import InlineInput from '../inputs/InlineInput.tsx';
import { PartPartial, savePartPartial } from '../../data/partActions.ts';

function PartInlineForm(props: {partId: string}) {
  const { partId } = props;
  const part = useSelector((state: RootState) => state.parts.entities[partId]);
  const dispatch = useAppDispatch();

  function savePart(changes: PartPartial) {
    dispatch(savePartPartial(partId, changes));
  }

  return (
    <div className='w-full flex gap-12 items-center'>
      <InlineInput
        id='title'
        stringVal={part.title}
        saveString={title => savePart({title})}
        autoFocus
      />
      <InlineInput
        id='qty'
        label='qty'
        type='quantity'
        numberVal={part.qty}
        saveNumber={qty => savePart({qty})}
      />
      <InlineInput
        id='length'
        label='L'
        type='inch'
        numberVal={part.l}
        saveNumber={l => savePart({l})}
      />
      <InlineInput
        id='width'
        label='W'
        type='inch'
        numberVal={part.w}
        saveNumber={w => savePart({w})}
      />
      <InlineInput
        id='height'
        label='H'
        type='inch'
        numberVal={part.h}
        saveNumber={h => savePart({h})}
      />
    </div>
  );
}

export default PartInlineForm;