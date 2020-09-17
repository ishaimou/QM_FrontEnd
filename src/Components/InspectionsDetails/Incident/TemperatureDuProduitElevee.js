import React, { Component } from "react";
import { Col, Form, DatePicker, TimePicker, InputNumber } from "antd";
import moment from "moment";

class TemperatureDuProduitElevee extends Component {
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
        <Col span={24}>
          <Form.Item label="Temperature">
            {this.props.getFieldDecorator("Temperature", {
              initialValue: "0",
              rules: [
                {
                  required: true,
                  message: "Please input the Temperature!"
                }
              ]
            })(
              <InputNumber
                min={0}
                max={2000}
                style={{ width: "100%" }}
                formatter={value => `${value}°`}
                parser={value => value.replace("°", "")}
              />
            )}
          </Form.Item>
        </Col>
      </React.Fragment>
    );
  }
}

export default TemperatureDuProduitElevee;