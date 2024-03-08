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

 // Example handlers for view and edit actions
 const handleView = (row) => {
    console.log('View action clicked for:', row);
    // Implement your logic for viewing the item
    // For example, you might want to navigate to a different page or open a modal
 };

 const handleEdit = (row) => {
    console.log('Edit action clicked for:', row);
    // Implement your logic for editing the item
    // Similar to handleView, you can navigate or open a modal
 };

 // Ensure the actions column uses the custom renderer
 const tableColumns = React.useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'name',
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
