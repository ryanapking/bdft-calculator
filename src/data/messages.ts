import { GROUP, MATERIAL, PART, PROJECT } from './dataTypes.ts';

const deleteMessages = {
  [PART.idPrefix]: 'Are you sure you want to delete this part?',
  [GROUP.idPrefix]: 'Are you sure you want to delete this group? All its parts and subgroups will also be deleted.',
  [MATERIAL.idPrefix]: 'Are you sure you want to delete this material? All parts using this material will be switched to the project default material.',
  [PROJECT.idPrefix]: 'Are you sure you want to delete this project? All parts, groups, and materials will be deleted.',
};

const deleteAlerts = {
  [PART.idPrefix]: '',
  [GROUP.idPrefix]: '',
  [MATERIAL.idPrefix]: 'The default material cannot be deleted. If you want to delete this material, set a different material as the project default.',
  [PROJECT.idPrefix]: '',
};

export { deleteAlerts, deleteMessages };