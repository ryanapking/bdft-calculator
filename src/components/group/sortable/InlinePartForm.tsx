import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../../data/store.ts';
import InlineInput from '../../inputs/InlineInput.tsx';
import { addPart, savePartUpdates } from '../../../data/partActions.ts';
import MaterialsSelector from '../../inputs/MaterialsSelector.tsx';
import { getMaterialTypeFromId } from '../../../data/dataTypes.ts';
import { PartPartial } from '../../../data/partsSlice.ts';
import { RxComponent1, RxComponentInstance } from 'react-icons/rx';
import { Label } from 'flowbite-react';
import Classes from './inlineFormStyles.ts';
import { addGroup } from '../../../data/groupActions.ts';

type Props = {
  partId: string,
  parentId: string,
  partIndex: number,
  focusNext: () => void,
  autoFocus?: boolean,
}

function InlinePartForm(props: Props) {
  const { partId, parentId, partIndex, focusNext, autoFocus = false } = props;
  const part = useSelector((state: RootState) => state.parts.entities[partId]);
  const project = useSelector((state: RootState) => state.projects.entities[state.display.activeProject]);
  const dispatch = useAppDispatch();

  const currentMaterialId = part.m ? part.m : project.defaultMaterial;
  const currentMaterial = useSelector((state: RootState) => state.materials.entities[currentMaterialId]);
  const materialType = getMaterialTypeFromId(currentMaterial.type);

  function save(changes: PartPartial) {
    dispatch(savePartUpdates(partId, changes));
  }

  function addSiblingGroup() {
    focusNext();
    dispatch(addGroup(parentId, partIndex + 1, false));
  }

  function addSiblingPart() {
    focusNext();
    dispatch(addPart(parentId, partIndex + 1, false));
  }

  return (
    <div className={Classes.container}>
      <div className={Classes.left.base}>
        <RxComponentInstance />
        <InlineInput
          id='title'
          stringVal={part.title}
          className={Classes.left.title}
          saveString={title => save({title})}
          autoFocus={autoFocus}
          large
        />
      </div>
      <div className={Classes.center.base}>
        <div className={Classes.center.material}>
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
            outerClass={Classes.center.length}
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
            outerClass={Classes.center.width}
            numberVal={part.w}
            saveNumber={w => save({ w })}
          />
          : null
        }
        {materialType.partFields.includes('c') ?
          <InlineInput
            id='cost'
            type='currency'
            label='Cost'
            outerClass={Classes.center.cost}
            numberVal={part.c}
            saveNumber={c => save({ c })}
          />
          : null
        }
        <InlineInput
          id='qty'
          label='Qty'
          type='quantity'
          outerClass={Classes.center.qty}
          numberVal={part.qty}
          saveNumber={qty => save({ qty })}
        />
      </div>
      <div className={Classes.right.base}>
        <Label className='text-xs font-light' value='+ New Sibling'/>
        <div className={Classes.right.buttonGroup}>
          <button type='button' className={Classes.right.button} onClick={addSiblingGroup}><RxComponent1/></button>
          <button className={Classes.right.button} onClick={addSiblingPart}><RxComponentInstance/></button>
        </div>
      </div>
    </div>
  );
}

export default InlinePartForm;