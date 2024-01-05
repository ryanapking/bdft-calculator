import GroupForm from './GroupForm.tsx';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../data/store.ts';
import SortableGroupTree from './sortable/SortableGroupTree.tsx';
import { Button, Dropdown } from 'flowbite-react';
import { setPendingDelete } from '../../data/displaySlice.ts';
import { addPart } from '../../data/partActions.ts';
import { addGroup, duplicateGroup } from '../../data/groupActions.ts';
import { CiRepeat, CiTrash, } from 'react-icons/ci';

function GroupDetails(props: { groupId: string, parentId: string }) {
  const { groupId, parentId } = props;
  const group = useSelector((state: RootState) => state.groups.entities[groupId]);
  const activeProject = useSelector((state: RootState) => state.projects.entities[state.display.activeProject]);
  const dispatch = useAppDispatch();

  const isMainGroup = groupId === activeProject.mainGroup;
  const title = <h1 className='text-3xl font-semibold'>{isMainGroup ? 'Project Components' : group.title}</h1>;

  return (
    <div>
      <div className='mb-5'>
        {isMainGroup ? title :
          <Dropdown inline label={title}>
            <Dropdown.Item icon={CiRepeat} onClick={() => dispatch(duplicateGroup(parentId, groupId))}>
              Duplicate Group
            </Dropdown.Item>
            <Dropdown.Item icon={CiTrash} onClick={() => dispatch(setPendingDelete({ id: groupId, parentId }))}>
              Delete Group
            </Dropdown.Item>
          </Dropdown>
        }
        <h5 className='text-xs font-light'>Component Group</h5>
      </div>
      <div className='flex gap-3 mb-5'>
        <Button outline color='light' onClick={() => dispatch(addPart(groupId, true, false))}>Add Part</Button>
        <Button outline color='light' onClick={() => dispatch(addGroup(groupId, true, false))}>Add Subgroup</Button>
      </div>
      <SortableGroupTree groupId={groupId}/>
      {isMainGroup ? null :
        <GroupForm groupId={groupId} parentId={parentId}/>
      }
    </div>
  )
}

export default GroupDetails;