import * as React from 'react';
import TablePagination from '@mui/material/TablePagination';

const PaginationComponent = ({ count, page, rowsPerPage, onPageChange, onRowsPerPageChange }) => {
  return (
    <TablePagination
      component="div"
      count={count}
      page={page}
      rowsPerPage={rowsPerPage}
      onPageChange={onPageChange}
      onRowsPerPageChange={onRowsPerPageChange}
      rowsPerPageOptions={[5, 10, 20, 50]}
    />
  );
};

export default PaginationComponent;
