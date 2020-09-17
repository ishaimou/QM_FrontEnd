import React, { Component } from "react";
import "./Profile.css";
import {
  Col,
  Form,
  Input,
  Button,
  Row,
  Icon
} from "antd";

class Profile extends Component {
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Row gutter={20}>
        <Form
          layout="vertical"
          onSubmit={this.handleSubmit}
          id="profile-container"
        >
          <Col span={12}>
            <Form.Item label="First Name">
              {getFieldDecorator("First Name")(
                <Input
                  placeholder="First Name"
                  prefix={
                    <Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />
                  }
                />
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Last Name">
              {getFieldDecorator("Last Name")(
                <Input
                  placeholder="Last Name"
                  prefix={
                    <Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />
                  }
                />
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Email Adress">
              {getFieldDecorator("Email Adress")(
                <Input
                  prefix={
                    <Icon type="mail" style={{ color: "rgba(0,0,0,.25)" }} />
                  }
                  placeholder="Email Adress"
                />
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Company">
              {getFieldDecorator("Company")(
                <Input
                  prefix={
                    <Icon type="bank" style={{ color: "rgba(0,0,0,.25)" }} />
                  }
                  placeholder="Company"
                />
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Password">
              {getFieldDecorator("password")(
                <Input.Password
                  prefix={
                    <Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />
                  }
                  type="password"
                  placeholder="Password"
                  name="password"
                />
              )}
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="Phone Number">
              {getFieldDecorator("tel")(
                <Input
                  prefix={
                    <Icon type="phone" style={{ color: "rgba(0,0,0,.25)" }} />
                  }
                  placeholder="Phone Number"
                />
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="CIN">
              {getFieldDecorator("cin")(
                <Input
                  prefix={
                    <Icon type="idcard" style={{ color: "rgba(0,0,0,.25)" }} />
                  }
                  placeholder="CIN"
                />
              )}
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item>
              <Button type="primary" htmlType="submit" id="profile-submit">
                Save
              </Button>
            </Form.Item>
          </Col>
        </Form>
      </Row>
    );
  }
}

export default Form.create()(Profile);
