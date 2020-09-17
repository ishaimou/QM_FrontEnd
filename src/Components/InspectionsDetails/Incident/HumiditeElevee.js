import React, { Component } from "react";
import { Col, Form, DatePicker, TimePicker, Input } from "antd";
import moment from "moment";

class HumiditeElevee extends Component {
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
          <Form.Item label="Resuming Hours">
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
        <Col span={24}>
          <Form.Item label="Humidity level">
            {this.props.getFieldDecorator("Humidity", {
              initialValue: "0",
              rules: [
                {
                  required: true,
                  message: "Please input the Humidity!"
                }
              ]
            })(<Input placeholder="Humidity level" />)}
          </Form.Item>
        </Col>
      </React.Fragment>
    );
  }
}

export default HumiditeElevee;
