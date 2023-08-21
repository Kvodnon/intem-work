import { message } from "antd";
import { createEffect, createEvent, sample } from "effector";
import { tableModel } from "entities/Table/model";
import { supabase } from "shared/api/supabase";

const deleteRow = createEvent();

const deleteRowFx = createEffect(
  async ({ tableName, rowId }: { tableName: string; rowId: string }) => {
    const { error } = await supabase.from(tableName).delete().eq("id", rowId);

    return error;
  }
);

sample({
  clock: deleteRow,
  source: tableModel.$currentTable,
  fn: (tableName, rowId) => ({ tableName, rowId }),
  target: deleteRowFx,
});

sample({
  clock: deleteRowFx.doneData,
  fn: (err) => {
    if (err) {
      message.error(err.message);
    } else {
      message.success("Successfully deleted");
    }
  },
});

sample({
  clock: deleteRowFx.doneData,
  filter: (_, err) => !err,
  source: tableModel.$currentTable,
  target: tableModel.getTableData,
});

export const deleteRowModel = { deleteRow };
