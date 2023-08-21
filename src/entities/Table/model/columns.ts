import { createEffect, createEvent, restore, sample } from "effector";
import { supabase } from "shared/api/supabase";
import { TTables } from "../../../types";

export interface IColumn {
  column_name: string;
  data_type: string;
  constraint_name: string;
  foreign_table_name: TTables;
}

const getColumnsFx = createEffect(async (tableName: TTables) => {
  const { data } = await supabase.rpc("get_table_columns", {
    table_needle: tableName,
  });

  return data.reduce(
    (prev: Record<string, IColumn>, curr: IColumn) => ({
      ...prev,
      [curr.column_name]: curr,
    }),
    {}
  );
});

const getColumns = createEvent<TTables>();

const $columns = restore<Record<string, IColumn>>(getColumnsFx.doneData, {});

$columns.reset(getColumns);

sample({
  clock: getColumns,
  target: getColumnsFx,
});

const $isPendingColumns = getColumnsFx.pending;

export { $columns, $isPendingColumns, getColumns };
