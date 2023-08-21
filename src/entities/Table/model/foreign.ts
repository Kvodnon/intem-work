import { createEffect, createEvent, restore, sample } from "effector";
import { supabase } from "shared/api/supabase";
import { TTables } from "types";

export interface IForeignRelates {
  conname: string;
  reftab: TTables;
}

const getForeignTableNames = createEvent();
const getForeignTableNamesFx = createEffect(async () => {
  const { data } = await supabase.rpc("get_foreign_table_name");

  return data.reduce(
    (
      prev: Record<IForeignRelates["conname"], IForeignRelates["reftab"]>,
      curr: IForeignRelates
    ) => ({ ...prev, [curr.conname]: curr.reftab }),
    {}
  );
});

sample({
  clock: getForeignTableNames,
  target: getForeignTableNamesFx,
});

const $foreignTableNames = restore<IForeignRelates>(
  getForeignTableNamesFx,
  null
);

export { $foreignTableNames, getForeignTableNames };
