import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';

const PaginatedGrid = ({
  rows,
  columns,
  getRowId = (row) => row.id,
  page: externalPage,
  setPage: externalSetPage,
  pageSize: externalPageSize,
  setPageSize: externalSetPageSize,
  checkboxSelection = false 
}) => {
  const [internalPageSize, setInternalPageSize] = useState(10);
  const [internalPage, setInternalPage] = useState(0);
  const [selectionModel, setSelectionModel] = useState([]);

  const pageSize = externalPageSize ?? internalPageSize;
  const setPageSize = externalSetPageSize ?? setInternalPageSize;
  const page = externalPage ?? internalPage;
  const setPage = externalSetPage ?? setInternalPage;

  return (
    <DataGrid
      className="datagrid"
      rows={rows}
      columns={columns}
      getRowId={getRowId}
      pageSize={pageSize}
      onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
      page={page}
      onPageChange={(newPage) => setPage(newPage)}
      rowsPerPageOptions={[5, 10, 25, 50]}
      pagination
      paginationMode="client"
      rowCount={rows.length}
      disableSelectionOnClick={false}
      style={{ fontSize: "12px" }}
      autoHeight
      checkboxSelection={checkboxSelection}
      selectionModel={selectionModel}
      onSelectionModelChange={(newSelection) => {
        setSelectionModel(newSelection);
        console.log("Selected row IDs:", newSelection); // ✅ shows selected row ids
      }}
    />
  );
};

export default PaginatedGrid;
