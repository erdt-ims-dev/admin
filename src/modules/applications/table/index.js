import React from 'react';
import { useTable } from 'react-table';
import Table from 'react-bootstrap/Table'; // Import React Bootstrap Table

function TableComponent({ columns, data }) {
 const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
 } = useTable({ columns, data });

 return (
    <Table  bordered hover> {/* Apply Bootstrap classes here */}
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th {...column.getHeaderProps()}>{column.render('Header')}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map(row => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map(cell => (
                <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </Table>
 );
}

export default TableComponent;
