import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../data/store.ts';
import InlineInput from '../inputs/InlineInput.tsx';
import { savePartUpdates } from '../../data/partActions.ts';
import MaterialsSelector from '../inputs/MaterialsSelector.tsx';
import { getMaterialTypeFromId } from '../../data/dataTypes.ts';
import { PartPartial } from '../../data/partsSlice.ts';
import { RxPlus } from 'react-icons/rx';
import { Label } from 'flowbite-react';

type Props = {
  partId: string,
  autoFocus?: boolean,
}

function PartInlineForm(props: Props) {
  const { partId, autoFocus = false } = props;
  const part = useSelector((state: RootState) => state.parts.entities[partId]);
  const project = useSelector((state: RootState) => state.projects.entities[state.display.activeProject]);
  const dispatch = useAppDispatch();

  const currentMaterialId = part.m ? part.m : project.defaultMaterial;
  const currentMaterial = useSelector((state: RootState) => state.materials.entities[currentMaterialId]);
  const materialType = getMaterialTypeFromId(currentMaterial.type);

  function save(changes: PartPartial) {
    dispatch(savePartUpdates(partId, changes));
  }

  const classes = {
    container: 'w-full flex gap-2 justify-between',
    left: 'g-blue-100 grow shrink flex items-end',
    center: 'g-slate-200 w-[700px] grid grid-cols-6 gap-2',
    right: 'g-red-200 flex items-end',
    addButton: 'w-10 h-10 flex items-center justify-center rounded-lg bg-gray-100',
    titleInput: 'w-full',
    narrowInput: 'w-[75px]',
    material: 'col-start-1 col-span-2 text-center flex flex-col',
    length: 'col-start-3',
    width: 'col-start-4',
    height: '',
    cost: 'col-start-5',
    qty: 'col-start-6 text-center',
  };

  return (
    <div className={classes.container}>
      <div className={classes.left}>
        <InlineInput
          id='title'
          stringVal={part.title}
          className={classes.titleInput}
          saveString={title => save({title})}
          autoFocus={autoFocus}
        />
      </div>
      <div className={classes.center}>
        <div className={classes.material}>
          <Label className='text-xs font-light'>Material</Label>
          <MaterialsSelector
            id='material'
            transparent
            center
            value={part.m}
            includeEmptyOption
            miscId={project.miscMaterial}
            emptyOptionLabel='Project Default'
            materialIds={project.materials}
            onValueChange={m => save({ m })}
          />
        </div>

        {materialType.partFields.includes('l') ?
          <InlineInput
            id='length'
            label='Length'
            type='inch'
            center
            outerClass={classes.length}
            numberVal={part.l}
            saveNumber={l => save({ l })}
          />
          : null
        }
        {materialType.partFields.includes('w') ?
          <InlineInput
            id='width'
            label='Width'
            type='inch'
            center
            outerClass={classes.width}
            numberVal={part.w}
            saveNumber={w => save({ w })}
          />
          : null
        }
        {materialType.partFields.includes('h') ?
          <InlineInput
            id='height'
            label='Height'
            type='inch'
            center
            outerClass={classes.height}
            numberVal={part.h}
            saveNumber={h => save({ h })}
          />
          : null
        }
        {materialType.partFields.includes('c') ?
          <InlineInput
            id='cost'
            type='currency'
            label='Cost'
            outerClass={classes.cost}
            numberVal={part.c}
            saveNumber={c => save({ c })}
          />
          : null
        }
        <InlineInput
          id='qty'
          label='Qty'
          type='quantity'
          outerClass={classes.qty}
          numberVal={part.qty}
          saveNumber={qty => save({ qty })}
        />
      </div>
      <div className={classes.right}>
        <button className={classes.addButton}><RxPlus /></button>
      </div>
    </div>
  );
}

export default PartInlineForm;