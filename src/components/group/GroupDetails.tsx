import GroupForm from './GroupForm.tsx';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../data/store.ts';
import SortableGroupTree from './sortable/SortableGroupTree.tsx';
import { Button, Dropdown } from 'flowbite-react';
import { setPendingDelete } from '../../data/displaySlice.ts';
import { addPart } from '../../data/partActions.ts';
import { addGroup, duplicateGroup, saveGroupUpdates as saveGroup } from '../../data/groupActions.ts';
import { CiEdit, CiRepeat, CiTrash, } from 'react-icons/ci';
import { useState } from 'react';
import TextInputModal from '../inputs/TextInputModal.tsx';

function GroupDetails(props: { groupId: string, parentId: string }) {
  const { groupId, parentId } = props;
  const group = useSelector((state: RootState) => state.groups.entities[groupId]);
  const activeProject = useSelector((state: RootState) => state.projects.entities[state.display.activeProject]);
  const dispatch = useAppDispatch();

  const [ editTitle, setEditTitle ] = useState(false);

  const isMainGroup = groupId === activeProject.mainGroup;
  const title = <h1 className='text-3xl font-semibold'>{isMainGroup ? 'Project Components' : group.title}</h1>;

  return (
    <div>
      <div className='mb-5'>
        {isMainGroup ?
          title :
          <Dropdown inline label={title}>
            <Dropdown.Item icon={CiEdit} onClick={() => setEditTitle(true)}>
              Edit Title
            </Dropdown.Item>
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
      {isMainGroup ?
        null :
        <div className='mb-10'>
          <GroupForm groupId={groupId} parentId={parentId}/>
        </div>
      }
      <div className='max-w-5xl'>
        <div className='flex gap-3 mb-5'>
          <Button outline color='light' onClick={() => dispatch(addPart(groupId, true, false))}>Add Component</Button>
          <Button outline color='light' onClick={() => dispatch(addGroup(groupId, true, false))}>Add Subgroup</Button>
        </div>
        <SortableGroupTree groupId={groupId}/>
      </div>
      {editTitle ?
        <TextInputModal
          id='title'
          submitText='Save'
          initialText={group.title}
          onSubmit={title => dispatch(saveGroup(groupId, { title }))}
          close={() => setEditTitle(false)}
        >
          <h3 className='text-3xl font-semibold mb-3'>Edit Group Title</h3>
        </TextInputModal>
        : null
      }
    </div>
  )
}

export default GroupDetails;