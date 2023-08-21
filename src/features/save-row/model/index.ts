import { message } from "antd";
import { createEffect, createEvent, sample } from "effector";
import { tableModel } from "entities/Table/model";
import { supabase } from "shared/api/supabase";

type TStatus = "updated" | "added";

const saveRow = createEvent();

const saveRowFx = createEffect(async ({ currentTable, data }: any) => {
  if (data.id) {
    await supabase.from(currentTable).update(data).eq("id", data.id);

    return "updated" as TStatus;
  } else {
    await supabase
      .from(currentTable)
      .insert({ ...data, id: undefined })
      .select();

    return "added" as TStatus;
  }
});

const openMessageFx = createEffect((status: TStatus) => {
  if (status === "updated") {
    message.success("Successfully updated");
  } else {
    message.success("Successfully added");
  }
});

sample({
  clock: saveRowFx.done,
  target: openMessageFx,
});
sample({
  clock: saveRowFx.done,
  source: tableModel.$currentTable,
  target: tableModel.getTableData,
});

sample({
  clock: saveRow,
  source: tableModel.$currentTable,
  fn: (currentTable, data) => ({ currentTable, data }),
  target: saveRowFx,
});

export const saveRowModel = { saveRow };
