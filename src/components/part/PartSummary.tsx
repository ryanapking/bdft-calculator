import { useSelector } from 'react-redux';
import { RootState } from '../../data/store.ts';
import { getMaterialTypeFromId, MISC } from '../../data/dataTypes.ts';
import { Table } from 'flowbite-react';

function PartSummary(props: {partId: string}) {
  const { partId } = props;
  const part = useSelector((state: RootState) => state.parts.entities[partId]);
  const usage = part.calc.entities[part.calc.ids[0]];
  const materialType = getMaterialTypeFromId(usage.type);

  if (materialType === MISC) return null;

  return (
    <div>
      <h5 className='text-sm font-semibold mb-2 text-gray-900'>Calculated Usage (Quantity not included)</h5>
      <Table className='max-w-md'>
        <Table.Head>
          <Table.HeadCell>{materialType.label}</Table.HeadCell>
          <Table.HeadCell>Cost</Table.HeadCell>
        </Table.Head>
        <Table.Body>
          <Table.Row>
            <Table.Cell>{usage.amt}</Table.Cell>
            <Table.Cell>${usage.cost.toFixed(2)}</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    </div>

  )
}

export default PartSummary;