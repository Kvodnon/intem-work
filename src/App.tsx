import { Col, Row } from "antd";
import { tableModel } from "entities/Table/model";
import { useEffect } from "react";
import { Sidebar } from "widgets/Sidebar";
import { DBTable } from "./components/DBTable";

function App() {
  useEffect(() => {
    tableModel.getForeignTableNames();
  }, []);

  return (
    <Row>
      <Col>
        <Sidebar />
      </Col>

      <Col flex="auto">
        <DBTable />
      </Col>
    </Row>
  );
}

export default App;
