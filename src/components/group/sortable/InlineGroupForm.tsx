import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../../data/store.ts';
import InlineInput from '../../inputs/InlineInput.tsx';
import { addGroup, saveGroupUpdates } from '../../../data/groupActions.ts';
import { addPart } from '../../../data/partActions.ts';
import { GroupPartial } from '../../../data/groupsSlice.ts';
import { RxComponent1, RxComponentInstance } from 'react-icons/rx';
import Classes from './inlineFormStyles.ts';
import { Label } from 'flowbite-react';

type Props = {
  groupId: string,
  focusNext: () => void,
  autoFocus?: boolean,
}
function InlineGroupForm(props: Props) {
  const { groupId, focusNext, autoFocus = false } = props;
  const group = useSelector((state: RootState) => state.groups.entities[groupId]);
  const dispatch = useAppDispatch();

  function save(changes: GroupPartial) {
    dispatch(saveGroupUpdates(groupId, changes));
  }

  function addChildGroup() {
    focusNext();
    dispatch(addGroup(groupId, 0, false));
  }

  function addChildPart() {
    focusNext();
    dispatch(addPart(groupId, 0, false));
  }

  return (
    <div className={Classes.container}>
      <div className={Classes.left.base}>
        <RxComponent1/>
        <InlineInput
          id='title'
          large
          stringVal={group.title}
          outerClass={Classes.left.title}
          saveString={title => save({ title })}
          autoFocus={autoFocus}
        />
      </div>
      <div className={Classes.center.base}>
        <InlineInput
          id='qty'
          label='qty'
          type='quantity'
          numberVal={group.qty}
          outerClass={Classes.center.qty}
          saveNumber={qty => save({ qty })}
        />
      </div>
      <div className={Classes.right.base}>
        <Label className='text-xs font-light' value='+ New Child'/>
        <div className={Classes.right.buttonGroup}>
          <button className={Classes.right.button} onClick={addChildGroup}><RxComponent1/></button>
          <button className={Classes.right.button} onClick={addChildPart}><RxComponentInstance/></button>
        </div>
      </div>
    </div>
  );
}

export default InlineGroupForm;