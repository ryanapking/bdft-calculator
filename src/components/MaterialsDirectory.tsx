import MaterialLink from './MaterialLink.tsx';

function MaterialsDirectory(props: {materials: Array<string>, projectId: string}) {
  const { materials, projectId } = props;
  return (
    <div className={'mt-2'}>
      <h1>Project Materials</h1>
      <ul>
        {materials.map(id => <MaterialLink key={id} materialId={id} parentId={projectId} /> )}
      </ul>
    </div>
  )
}

export default MaterialsDirectory;