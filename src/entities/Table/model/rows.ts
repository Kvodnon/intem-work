import { createEffect, createEvent, restore, sample } from "effector";
import { supabase } from "shared/api/supabase";
import { TRecord } from "shared/types";
import { TTables } from "../../../types";
import { $columns, IColumn } from "./columns";
import { $foreignTableNames, IForeignRelates } from "./foreign";

const getTableData = createEvent<TTables>();

const getTableDataFx = createEffect(async (tableName: TTables) => {
  const { data } = await supabase.from(tableName).select();
  return data?.map((v, i) => ({ ...v, key: i.toString() })) || [];
});
const $rows = restore<TRecord[]>(getTableDataFx.doneData, []);

$rows.reset(getTableData);

sample({
  clock: getTableData,
  target: getTableDataFx,
});

const updateData = createEvent<TRecord[]>();

const $isPendingData = getTableDataFx.pending;

sample({ clock: updateData, target: $rows });

const fetchForeignData = createEvent<string>();

const fetchForeignDataFx = createEffect(
  async ({
    columns,
    columnName,
    foreignTableNames,
  }: {
    columns: Record<string, IColumn>;
    columnName: string;
    foreignTableNames: Record<
      IForeignRelates["conname"],
      IForeignRelates["reftab"]
    >;
  }) => {
    const constraintName = columns[columnName].constraint_name;
    const { data } = await supabase
      .from(foreignTableNames[constraintName])
      .select("id");

    return {
      [columnName]: data?.map((v) => v.id),
    };
  }
);

const $foreignData = restore<Record<string, number[]>>(
  fetchForeignDataFx.doneData,
  []
);
$foreignData.reset(fetchForeignData);

sample({
  clock: fetchForeignData,
  source: { columns: $columns, foreignTableNames: $foreignTableNames },
  fn: ({ columns, foreignTableNames }, columnName) => ({
    columns,
    foreignTableNames,
    columnName,
  }),
  target: fetchForeignDataFx,
});

const $isPendingForeignData = fetchForeignDataFx.pending;

export {
  $foreignData,
  $isPendingData,
  $isPendingForeignData,
  $rows,
  fetchForeignData,
  getTableData,
  updateData,
};
