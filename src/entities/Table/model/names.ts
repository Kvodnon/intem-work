import { createEffect, createEvent, restore, sample } from "effector";
import { supabase } from "shared/api/supabase";
import { ITable, TTables } from "../../../types";

const getTableNamesFx = createEffect(async () => {
  const { data, error } = await supabase.rpc("get_all_table_name");

  return data.map((value: ITable) => value.table_name);
});

const setCurrentTable = createEvent<TTables>();

const $tableNames = restore<any[]>(getTableNamesFx.doneData, []);
const $currentTable = restore<TTables>(setCurrentTable, null);

const getTableNames = createEvent();

sample({
  clock: getTableNames,
  target: getTableNamesFx,
});

export { $currentTable, $tableNames, getTableNames, setCurrentTable };
