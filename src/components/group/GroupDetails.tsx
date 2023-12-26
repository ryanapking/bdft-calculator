import GroupForm from './GroupForm.tsx';
import { useSelector } from 'react-redux';
import { RootState } from '../../data/store.ts';
import SortableProjectTree from '../project/sortable/SortableProjectTree.tsx';

function GroupDetails(props: { groupId: string, parentId: string }) {
  const { groupId, parentId} = props;
  const activeProject = useSelector((state: RootState) => state.projects.entities[state.display.activeProject]);

  if (groupId === activeProject.mainGroup) {
    return <SortableProjectTree />
  }

  return <GroupForm groupId={groupId} parentId={parentId} />;
}

export default GroupDetails;