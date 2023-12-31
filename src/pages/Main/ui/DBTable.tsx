import { Button, Form, Popconfirm, Space, Spin, Table, Typography } from "antd";
import dayjs from "dayjs";
import { useStore } from "effector-react";
import { tableModel } from "entities/Table/model";
import { EditableCell } from "entities/Table/ui/EditableCell";
import { deleteRowModel } from "features/delete-row/model";
import { saveRowModel } from "features/save-row/model";
import { useEffect, useState } from "react";
import { TRecord } from "shared/types";

export const DBTable: React.FC = () => {
  const [form] = Form.useForm();
  const currentColumns = useStore(tableModel.$columns);
  const data = useStore(tableModel.$rows);
  const isPendingData = useStore(tableModel.$isPendingData);
  const [count, setCount] = useState(0);

  useEffect(() => {
    setEditingKey("");
  }, [data]);

  const [editingKey, setEditingKey] = useState("");
  const isEditing = (record: TRecord) => record.key === editingKey;
  const edit = (record: TRecord) => {
    const newRecord = { ...record };

    Object.keys(record).forEach((v) => {
      if (v.match("date") && newRecord[v]) {
        newRecord[v] = dayjs(newRecord[v]);
      }
    });

    form.setFieldsValue({
      ...Object.keys(currentColumns).reduce(
        (prev, curr) => ({ ...prev, [curr]: "" }),
        {}
      ),
      ...newRecord,
    });
    setEditingKey(record.key);
  };

  const handleAdd = () => {
    const newData = Object.keys(currentColumns).reduce(
      (prev, curr) => ({ ...prev, [curr]: "" }),
      { key: `new-row-${count}` }
    );
    tableModel.updateData([...data, newData]);
    setCount(count + 1);
  };

  const cancel = () => {
    setEditingKey("");
  };
  const handleDelete = (key: string) => {
    const newData = [...data];
    const index = newData.findIndex((item) => key === item.key);

    const item = newData[index];

    newData.splice(index, 1);

    if (item.id) {
      deleteRowModel.deleteRow(item.id);
    } else {
      tableModel.updateData(newData);
    }
  };

  const save = async (key: string) => {
    try {
      const row = await form.validateFields();
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);

      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        saveRowModel.saveRow({ ...newData[index], key: undefined });
      } else {
        newData.push(row);
        saveRowModel.saveRow(row);
      }

      tableModel.updateData(newData);
      setEditingKey("");
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const mergedColumns = Object.keys(currentColumns).map((v) => ({
    editable: true,
    dataIndex: v,
    title: v,
    onCell: (record: TRecord) => ({
      ...record,
      inputType: "text",
      dataIndex: v,
      title: v,
      editing: isEditing(record) && v !== "id",
    }),
  }));

  Object.keys(currentColumns).length > 0 &&
    mergedColumns.push({
      title: "Action",
      dataIndex: "action",
      render: (_: any, record: TRecord) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record.key)}
              style={{
                marginRight: 8,
              }}
            >
              Save
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <Space size="middle">
            <Typography.Link
              disabled={editingKey !== ""}
              onClick={() => edit(record)}
            >
              Edit
            </Typography.Link>
            <Typography.Link
              disabled={editingKey !== ""}
              onClick={() => handleDelete(record.key)}
            >
              Delete
            </Typography.Link>
          </Space>
        );
      },
    });

  return (
    <Form form={form} component={false}>
      <Button
        onClick={handleAdd}
        type="primary"
        disabled={Object.keys(currentColumns).length === 0 || isPendingData}
        style={{ marginBottom: 16 }}
      >
        Add a row
      </Button>
      <Spin spinning={isPendingData} tip="Loading...">
        <Table
          pagination={false}
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          bordered
          dataSource={data}
          columns={mergedColumns}
        />
      </Spin>
    </Form>
  );
};
