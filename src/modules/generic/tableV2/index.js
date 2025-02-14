import React from 'react';
import { useTable } from 'react-table';
import Table from 'react-bootstrap/Table';

function TableComponent({ columns, data }) {
 const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
 } = useTable({ columns, data });

 // Custom cell renderer for the actions column
 const renderActions = (cell) => {
    return (
      <div>
        <button onClick={() => handleView(cell.row.original)}>View</button>
        <button onClick={() => handleEdit(cell.row.original)}>Edit</button>
      </div>
    );
 };



 // Ensure the actions column uses the custom renderer
 const tableColumns = React.useMemo(
    () => [
        {
            Header: 'Last Name',
            accessor: 'last_name',
        },
        {
            Header: 'First Name',
            accessor: 'first_name',
        },
        {
            Header: 'Program of Study',
            accessor: 'pos',
        },
        {
            Header: 'Actions',
            accessor: 'actions',
            Cell: renderActions,
        },
    ],
    []
 );

 return (
    <Table bordered hover {...getTableProps()}>
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
