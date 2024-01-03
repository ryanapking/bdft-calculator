import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../data/store.ts';
import InlineInput from '../inputs/InlineInput.tsx';
import { PartPartial, savePartPartial } from '../../data/partActions.ts';
import MaterialsSelector from '../inputs/MaterialsSelector.tsx';

function PartInlineForm(props: {partId: string}) {
  const { partId } = props;
  const part = useSelector((state: RootState) => state.parts.entities[partId]);
  const project = useSelector((state: RootState) => state.projects.entities[state.display.activeProject]);
  const dispatch = useAppDispatch();

  function savePart(changes: PartPartial) {
    dispatch(savePartPartial(partId, changes));
  }

  const classes = {
    materialsInput: 'w-[200px]',
    inchInput: 'w-[75px]',
    qtyInput: 'w-[75px]',
  };

  return (
    <div className='w-full flex gap-12 items-center'>
      <InlineInput
        id='title'
        stringVal={part.title}
        saveString={title => savePart({title})}
        autoFocus
      />
      <div className='w-full flex gap-3 justify-end'>
        <InlineInput
          id='qty'
          label='qty'
          type='quantity'
          className={classes.qtyInput}
          numberVal={part.qty}
          saveNumber={qty => savePart({qty})}
        />
        <MaterialsSelector
          id='material'
          value={part.m}
          includeEmptyOption
          miscId={project.miscMaterial}
          emptyOptionLabel='Project Default'
          className={classes.materialsInput}
          materialIds={project.materials}
          onValueChange={m => savePart({m})}
        />
        <InlineInput
          id='length'
          label='L'
          type='inch'
          className={classes.inchInput}
          numberVal={part.l}
          saveNumber={l => savePart({l})}
        />
        <InlineInput
          id='width'
          label='W'
          type='inch'
          className={classes.inchInput}
          numberVal={part.w}
          saveNumber={w => savePart({w})}
        />
        <InlineInput
          id='height'
          label='H'
          type='inch'
          className={classes.inchInput}
          numberVal={part.h}
          saveNumber={h => savePart({h})}
        />
      </div>
    </div>
  );
}

export default PartInlineForm;