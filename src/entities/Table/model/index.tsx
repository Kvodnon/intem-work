import { $columns, $isPendingColumns, getColumns } from "./columns";
import { $foreignTableNames, getForeignTableNames } from "./foreign";
import {
  $currentTable,
  $tableNames,
  getTableNames,
  setCurrentTable,
} from "./names";
import {
  $foreignData,
  $isPendingData,
  $isPendingForeignData,
  $rows,
  fetchForeignData,
  getTableData,
  updateData,
} from "./rows";

export const tableModel = {
  $columns,
  $foreignData,
  getColumns,
  $tableNames,
  getTableNames,
  $rows,
  $isPendingColumns,
  getTableData,
  updateData,
  $currentTable,
  setCurrentTable,
  $isPendingData,
  fetchForeignData,
  $foreignTableNames,
  getForeignTableNames,
  $isPendingForeignData,
};
