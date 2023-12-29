import GroupForm from './GroupForm.tsx';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../data/store.ts';
import SortableGroupTree from '../project/sortable/SortableGroupTree.tsx';
import { Button, Dropdown } from 'flowbite-react';
import { setPendingDelete } from '../../data/displaySlice.ts';
import { addPart } from '../../data/partActions.ts';
import { addGroup } from '../../data/groupActions.ts';

function GroupDetails(props: { groupId: string, parentId: string }) {
  const { groupId, parentId} = props;
  const group = useSelector((state: RootState) => state.groups.entities[groupId]);
  const activeProject = useSelector((state: RootState) => state.projects.entities[state.display.activeProject]);
  const dispatch = useAppDispatch();

  return (
    <div>
      <div className='mb-5'>
        <Dropdown inline label={<h1 className='text-3xl'>{group.title}</h1>}>
          <Dropdown.Item onClick={() => dispatch(setPendingDelete({id: groupId, parentId}))}>Delete Group</Dropdown.Item>
        </Dropdown>
      </div>
      <div className='flex gap-3 mb-5'>
        <Button outline color='light' onClick={() => dispatch(addPart(groupId, true, false))}>Add Part</Button>
        <Button outline color='light' onClick={() => dispatch(addGroup(groupId, true, false))}>Add Subgroup</Button>
      </div>
      <SortableGroupTree groupId={groupId}/>
      {groupId === activeProject.mainGroup ? null :
        <GroupForm groupId={groupId} parentId={parentId} />
      }
    </div>
  )
}

export default GroupDetails;