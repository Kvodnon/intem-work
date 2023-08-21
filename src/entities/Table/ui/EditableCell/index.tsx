import { DatePicker, Form, Input, Select } from "antd";
import { useStore } from "effector-react";
import { tableModel } from "entities/Table/model";

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: string;
  inputType: "number" | "text";
  record: any;
  index: number;
  children: React.ReactNode;
}

export const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}: EditableCellProps) => {
  const columns = useStore(tableModel.$columns);
  const foreignData = useStore(tableModel.$foreignData);
  const isPending = useStore(tableModel.$isPendingForeignData);

  const listData = foreignData[dataIndex]
    ? foreignData[dataIndex].map((v) => ({ value: v, label: v }))
    : [];

  const handleClick = () => tableModel.fetchForeignData(dataIndex);

  const showInput = () => {
    if (columns[dataIndex].constraint_name?.match("fkey"))
      return (
        <Select onFocus={handleClick} options={listData} loading={isPending} />
      );

    if (columns[dataIndex].data_type?.match("date")) {
      return <DatePicker />;
    }

    return <Input />;
  };

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: false,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {showInput()}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};
