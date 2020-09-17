import React, { Component } from "react";
import { Col, Form, DatePicker, TimePicker } from "antd";
import moment from "moment";
class ArretOCP extends Component {
  render() {
    return (
      <React.Fragment>
        <Col span={24}>
          <Form.Item label="Resuming Date">
            {this.props.getFieldDecorator("Date", {
              initialValue: moment(),
              rules: [
                {
                  required: true,
                  message: "Please input the Date!"
                }
              ]
            })(<DatePicker style={{ width: "100%" }} />)}
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item label="Resuming Hour">
            {this.props.getFieldDecorator("Date", {
              rules: [
                {
                  required: true,
                  message: "Please input the Hour!"
                }
              ]
            })(<TimePicker format="HH:mm" style={{ width: "100%" }} />)}
          </Form.Item>
        </Col>
      </React.Fragment>
    );
  }
}

export default ArretOCP;