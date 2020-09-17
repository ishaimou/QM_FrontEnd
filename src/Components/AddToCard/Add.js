import React, { Component } from "react";
import { Modal, Button, Col, Row } from "antd";
import "./Add.css";
class Add extends Component {
  render() {
    const { visible, onCancel } = this.props;
    return (
      <Modal
        visible={visible}
        title={null}
        okText="Create"
        width="50%"
        onCancel={onCancel}
        footer={null}
        className="Add"
      >
        <div id="Add_container">
          <Row>
            <Col sm={24} md={12} id="add-cols">
              <Button id="btn">Loading</Button>
            </Col>
            <Col sm={24} md={12} id="add-cols">
              <Button id="btn">Product</Button>
            </Col>
            <Col sm={24} md={12} id="add-cols">
              <Button id="btn">Client</Button>
            </Col>
            <Col sm={24} md={12} id="add-cols">
              <Button id="btn">Draught Survey</Button>
            </Col>
            <Col sm={24} md={12} id="add-cols">
              <Button id="btn">Temperature</Button>
            </Col>
            <Col sm={24} md={12} id="add-cols">
              <Button id="btn">Humidity</Button>
            </Col>
          </Row>
        </div>
      </Modal>
    );
  }
}

export default Add;
