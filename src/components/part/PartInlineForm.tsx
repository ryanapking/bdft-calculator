import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../data/store.ts';
import InlineInput from '../inputs/InlineInput.tsx';
import { PartPartial, savePartPartial } from '../../data/partActions.ts';
import MaterialsSelector from '../inputs/MaterialsSelector.tsx';
import { getMaterialTypeFromId } from '../../data/dataTypes.ts';

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

  function savePart(changes: PartPartial) {
    dispatch(savePartPartial(partId, changes));
  }

  const classes = {
    container: 'w-full flex gap-12 items-center',
    titleInput: 'w-full max-w-md',
    allFields: 'w-full flex gap-3 justify-end',
    mandatoryFields: 'flex gap-3',
    conditionalFields: 'w-[250px] flex gap-3 ml-5 justify-between',
    narrowInput: 'w-[75px]',
  };

  return (
    <div className={classes.container}>
      <InlineInput
        id='title'
        stringVal={part.title}
        className={classes.titleInput}
        saveString={title => savePart({title})}
        autoFocus={autoFocus}
      />
      <div className={classes.allFields}>
        <div className={classes.mandatoryFields}>
          <InlineInput
            id='qty'
            label='qty'
            type='quantity'
            className={classes.narrowInput}
            numberVal={part.qty}
            saveNumber={qty => savePart({ qty })}
          />
          <MaterialsSelector
            id='material'
            value={part.m}
            includeEmptyOption
            miscId={project.miscMaterial}
            emptyOptionLabel='Project Default'
            materialIds={project.materials}
            onValueChange={m => savePart({ m })}
          />
        </div>
        <div className={classes.conditionalFields}>
          {materialType.partFields.includes('l') ?
            <InlineInput
              id='length'
              label='L'
              type='inch'
              className={classes.narrowInput}
              numberVal={part.l}
              saveNumber={l => savePart({ l })}
            />
            : null
          }
          {materialType.partFields.includes('w') ?
            <InlineInput
              id='width'
              label='W'
              type='inch'
              className={classes.narrowInput}
              numberVal={part.w}
              saveNumber={w => savePart({ w })}
            />
            : null
          }
          {materialType.partFields.includes('h') ?
            <InlineInput
              id='height'
              label='H'
              type='inch'
              className={classes.narrowInput}
              numberVal={part.h}
              saveNumber={h => savePart({ h })}
            />
            : null
          }
          {materialType.partFields.includes('c') ?
            <InlineInput
              id='cost'
              type='currency'
              numberVal={part.c}
              saveNumber={c => savePart({ c })}
            />
            : null
          }
        </div>
      </div>
    </div>
  );
}

export default PartInlineForm;