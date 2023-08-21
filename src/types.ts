
export type TTables = "User" | "Role" | "Group" | "Currency" | "Rate";

export interface ITable {
    table_name: TTables;
  }

  
export interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: "number" | "text";
  record: any;
  index: number;
  children: React.ReactNode;
}