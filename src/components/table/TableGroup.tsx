import { RecursiveChild } from '../../data/displaySlice.ts';
import { useState } from 'react';
import TableRow from './TableRow.tsx';
import { GROUP } from '../../data/dataTypes.ts';

type Props = {
  group: RecursiveChild,
  depth?: number,
  multiplier?: number,
  keepExpanded?: boolean,
  excludeGroupRow?: boolean,
  shadeIndex?: number,
}

function TableGroup(props: Props) {
  const {
    group,
    depth = 0,
    multiplier = 1,
    keepExpanded = false,
    excludeGroupRow = false,
    shadeIndex = 0,
  } = props;

  const [ expanded, setExpanded ] = useState(false);

  const nextDepth = depth + 1;

  function printChild(child: RecursiveChild, childShadeIndex: number) {
    switch (child.type) {
      case GROUP: return (
        <TableGroup
          key={child.id}
          depth={nextDepth}
          group={child}
          multiplier={group.qty * multiplier}
          shadeIndex={childShadeIndex}
        />
      );
      default: return (
        <TableRow
          shaded={!!(childShadeIndex % 2)}
          key={child.id}
          rowData={child}
          depth={nextDepth}
          multiplier={multiplier}
        />
      );
    }
  }

  function printChildren(children: Array<RecursiveChild>) {
    return children.map((child, index) => {
      return printChild(child, shadeIndex + index + 1);
    });
  }

  return (
    <div>
      {excludeGroupRow ? null :
        <TableRow
          rowData={group}
          depth={depth}
          multiplier={multiplier}
          shaded={!!(shadeIndex % 2)}
          excludeTotals={expanded || keepExpanded}
          titleAction={keepExpanded ? null : () => setExpanded(!expanded)}
          expandable={!keepExpanded && !expanded}
          collapsible={!keepExpanded && expanded}
        />
      }
      {keepExpanded || expanded ? printChildren(group.children) : null}
    </div>

  )
}

export default TableGroup;