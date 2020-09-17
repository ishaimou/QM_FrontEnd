import React, { Component } from "react";
import "./Login.css";
import { Form, Icon, Input, Button, Col, Checkbox, Alert, Spin } from "antd";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { login, clearError } from "../../actions/auth";

class LoginForm extends Component {
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.login(values.email, values.password);
      }
    });
  };

  render() {
    let errorMsg;
    if (this.props.errorMsg) {
      errorMsg = (
        <div>
          <Alert
            message="Error"
            description={this.props.errorMsg}
            type="error"
            showIcon
          />
        </div>
      );
    } else errorMsg = "";
    if (this.props.isAuthenticated) return <Redirect to="/" />;
    const { getFieldDecorator } = this.props.form;
    return (
      <React.Fragment>
        <div
          className="spinDiv"
          style={{ display: this.props.isLoading ? "block" : "none" }}
        >
          <Spin size="large" />
        </div>
        <Form
          onSubmit={this.handleSubmit}
          className=" l-form"
          style={{ display: this.props.isLoading ? "none" : "block" }}
        >
          {errorMsg}
          <Form.Item className="l-input" hasFeedback>
            {getFieldDecorator("email", {
              rules: [
                {
                  type: "email",
                  message: "The input is not valid E-mail!"
                },
                { required: true, message: "Please input your email!" }
              ]
            })(
              <Input
                className="l-Field"
                size="large"
                prefix={
                  <Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />
                }
                placeholder="email"
                name="email"
              />
            )}
          </Form.Item>
          <Form.Item hasFeedback>
            {getFieldDecorator("password", {
              rules: [
                { required: true, message: "Please input your Password!" }
              ]
            })(
              <Input.Password
                size="large"
                className="l-Field"
                prefix={
                  <Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />
                }
                type="password"
                placeholder="Password"
                name="password"
              />
            )}
          </Form.Item>
          <Form.Item>
            <Col span={12} xs={{ span: 24 }} sm={{ span: 12 }}>
              {getFieldDecorator("remember", {
                valuePropName: "checked",
                initialValue: true
              })(<Checkbox>Remember me</Checkbox>)}
            </Col>
            <Col span={12} xs={{ span: 24 }} sm={{ span: 12 }}>
              <a className="l-forgot" href="/forgot">
                Forgot password
              </a>
            </Col>
          </Form.Item>
          <div className="l-flex">
            <div>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  className="l-login-form-button btn"
                >
                  Sign in
                </Button>
              </Form.Item>
            </div>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                className="l-login-form-button btn"
                id="l-sign-up"
              >
                <Link to="/register" onClick={this.props.clearError}>
                  Sign up
                </Link>
              </Button>
            </Form.Item>
          </div>
        </Form>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  errorMsg: state.auth.errorMsg,
  isLoading: state.auth.isLoading
});
const Login = Form.create()(LoginForm);
export default connect(
  mapStateToProps,
  { login, clearError }
)(Login);
