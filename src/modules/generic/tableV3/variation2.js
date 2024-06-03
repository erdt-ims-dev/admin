import React from 'react';
import { useTable } from 'react-table';
import Table from 'react-bootstrap/Table';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'


// 4 skeleton columns variation, used in applicant - view application status


function TableComponent({ columns, data, isLoading }) {
 const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
 } = useTable({ columns, data, isLoading });

 // Custom cell renderer for the actions column
 const renderActions = (cell) => {
    return (
      <div>
        <button onClick={() => handleView(cell.row.original)}>View</button>
        <button onClick={() => handleEdit(cell.row.original)}>Edit</button>
      </div>
    );
 };
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
            Header: 'Application Date',
            accessor: 'application_date',
        },
        {
            Header: 'Status',
            accessor: 'status',
        },
        {
            Header: 'View Files',
            accessor: 'view_files',
        },
        {
            Header: 'Tracking',
            accessor: 'tracking',
            Cell: renderActions,
        },
    ],
    []
 );

 return isLoading? (
  
  <Table bordered hover>
<thead>
      {headerGroups.map(headerGroup => (
        <tr {...headerGroup.getHeaderGroupProps()}>
          {headerGroup.headers.map(column => (
            <th {...column.getHeaderProps()}>{column.render('Header')}</th>
          ))}
        </tr>
      ))}
    </thead>
    <tbody>
    <tr>
          <td ><Skeleton baseColor='lightgrey'/></td>
          <td ><Skeleton baseColor='lightgrey'/></td>
          <td ><Skeleton baseColor='lightgrey'/></td>
          <td ><Skeleton baseColor='lightgrey'/></td>
        </tr>
    </tbody>
    <tbody>
        <tr>
          <td ><Skeleton baseColor='lightgrey'/></td>
          <td ><Skeleton baseColor='lightgrey'/></td>
          <td ><Skeleton baseColor='lightgrey'/></td>
          <td ><Skeleton baseColor='lightgrey'/></td>
        </tr>
    </tbody>
    <tbody>
    <tr>
          <td ><Skeleton baseColor='lightgrey'/></td>
          <td ><Skeleton baseColor='lightgrey'/></td>
          <td ><Skeleton baseColor='lightgrey'/></td>
          <td ><Skeleton baseColor='lightgrey'/></td>
        </tr>
    </tbody>
  </Table>
) : (
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
)
}

export default TableComponent;
