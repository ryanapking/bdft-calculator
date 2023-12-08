import { useSelector } from "react-redux";
import { RootState } from "../data/store.ts";
import { Dropdown } from 'flowbite-react';
import { useAppDispatch } from "../data/store.ts";
import { addPart,  addGroup } from "../data/thunkActions.ts";
import { getDataTypeFromId, PART, GROUP } from '../data/dataTypes.ts';
import Part from './Part.tsx';

function Group(props:{groupId:string}) {
  const { groupId } = props;
  const group = useSelector((state: RootState) => state.groups.all[groupId]);
  const dispatch = useAppDispatch();

  const printChild = (childId: string) => {
    const childType = getDataTypeFromId(childId);
    switch (childType) {
      case PART: return <Part key={childId} partId={childId} />
      case GROUP: return <Group key={childId} groupId={childId} />
    }
  }

  return (
    <>
      <Dropdown inline label={`Group : ${groupId} : ${group.title}`}>
        <Dropdown.Item onClick={() => dispatch(addPart(groupId))}>Add Part</Dropdown.Item>
        <Dropdown.Item onClick={() => dispatch(addGroup(groupId))}>Add Subgroup</Dropdown.Item>
      </Dropdown>
      <ul className="pl-6 pb-2">
        {group.children.map(childId => printChild(childId))}
      </ul>
    </>
  )
}

export default Group;