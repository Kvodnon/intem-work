import { Menu, MenuProps, Skeleton, Spin } from "antd";
import Sider from "antd/es/layout/Sider";
import { useStore } from "effector-react";
import { tableModel } from "entities/Table/model";
import { useEffect } from "react";

export const Sidebar: React.FC = () => {
  const tableNames = useStore(tableModel.$tableNames);
  const isPendingColumns = useStore(tableModel.$isPendingColumns);

  useEffect(() => {
    tableModel.getTableNames();
  }, []);

  const items: MenuProps["items"] = tableNames.map((key) => ({
    key,
    label: key,
    disabled: isPendingColumns,
    onClick: async () => {
      tableModel.getColumns(key);
      tableModel.getTableData(key);
      tableModel.setCurrentTable(key);
    },
  }));

  return (
    <Sider>
      <Skeleton
        paragraph={{ rows: 5, width: "100%" }}
        title={false}
        active
        loading={items.length === 0}
      />
      {items.length > 0 && (
        <Spin spinning={tableNames.length === 0} tip="Loading...">
          <Menu
            mode="inline"
            style={{ height: "100%", borderRight: 0 }}
            items={items}
          />
        </Spin>
      )}
    </Sider>
  );
};
