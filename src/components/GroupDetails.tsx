import { useSelector } from "react-redux";
import { RootState } from "../data/store.ts";
import { Dropdown } from 'flowbite-react';
import { useAppDispatch } from "../data/store.ts";
import { addPart, addGroup, deleteGroup } from "../data/thunkActions.ts";

function GroupDetails(props:{groupId: string, parentId: string, mainGroup?: boolean}) {
  const { mainGroup = false, groupId, parentId } = props;
  const group = useSelector((state: RootState) => state.groups.all[groupId]);
  const dispatch = useAppDispatch();

  if (!group) return null;

  return (
    <div className="m-2">
      <Dropdown inline label={`Group : ${groupId} : ${group.title}`}>
        <Dropdown.Item onClick={() => dispatch(addPart(groupId))}>Add Part</Dropdown.Item>
        <Dropdown.Item onClick={() => dispatch(addGroup(groupId))}>Add Subgroup</Dropdown.Item>
        {mainGroup ? null : <Dropdown.Item onClick={() => dispatch(deleteGroup(parentId, groupId))}>Delete Group</Dropdown.Item> }
      </Dropdown>
    </div>
  )
}

export default GroupDetails;