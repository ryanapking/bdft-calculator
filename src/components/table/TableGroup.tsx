import { RecursiveChild } from '../../data/displaySlice.ts';
import { useState } from 'react';
import TableRow from './TableRow.tsx';
import { GROUP } from '../../data/dataTypes.ts';

type Props = {
  group: RecursiveChild,
  depth: number,
  multiplier: number,
  keepExpanded: boolean,
  excludeGroupRow: boolean
}

function TableGroup(props: Props) {
  const {
    group,
    multiplier,
    keepExpanded = false,
    depth = 0,
    excludeGroupRow = false,
  } = props;

  const [ expanded, setExpanded ] = useState(false);

  const nextDepth = depth + 1;

  function printChild(child: RecursiveChild) {
    switch (child.type) {
      case GROUP: return <TableGroup key={child.id} depth={nextDepth} group={child} multiplier={group.qty * multiplier} />;
      default: return <TableRow key={child.id} rowData={child} depth={nextDepth} multiplier={group.qty * multiplier}/>;
    }
  }

  return (
    <div>
      {excludeGroupRow ? null : <TableRow rowData={group} excludeTotals={expanded || keepExpanded} depth={depth} titleAction={keepExpanded ? null : () => setExpanded(!expanded)} />}
      {keepExpanded || expanded ? group.children.map(child => printChild(child)) : null}
    </div>

  )
}

export default TableGroup;