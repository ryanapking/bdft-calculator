import { useSelector } from "react-redux";
import { RootState } from "../data/store.ts";
import { Dropdown } from 'flowbite-react';
import { useAppDispatch } from "../data/store.ts";
import { addPart, addGroup, deleteGroup } from "../data/thunkActions.ts";
import { getDataTypeFromId, PART, GROUP } from '../data/dataTypes.ts';
import Part from './Part.tsx';

function Group(props:{groupId: string, parentId: string, mainGroup?: boolean}) {
  const { mainGroup = false, groupId, parentId } = props;
  const group = useSelector((state: RootState) => state.groups.all[groupId]);
  const dispatch = useAppDispatch();

  const printChild = (childId: string) => {
    const childType = getDataTypeFromId(childId);
    switch (childType) {
      case PART: return <Part key={childId} partId={childId} parentId={groupId} />
      case GROUP: return <Group key={childId} groupId={childId} parentId={groupId} />
    }
  }

  return (
    <div className="m-2">
      <Dropdown inline label={`Group : ${groupId} : ${group.title}`}>
        <Dropdown.Item onClick={() => dispatch(addPart(groupId))}>Add Part</Dropdown.Item>
        <Dropdown.Item onClick={() => dispatch(addGroup(groupId))}>Add Subgroup</Dropdown.Item>
        {mainGroup ? null : <Dropdown.Item onClick={() => dispatch(deleteGroup(parentId, groupId))}>Delete Group</Dropdown.Item> }
      </Dropdown>
      <ul className="pl-6">
        {group.children.map(childId => printChild(childId))}
      </ul>
    </div>
  )
}

export default Group;