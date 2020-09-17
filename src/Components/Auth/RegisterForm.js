import React, { Component } from "react";
import "./Register.css";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { Form, Icon, Input, Button, Checkbox, Spin, Alert } from "antd";
import ReCAPTCHA from "react-google-recaptcha";
import { register, clearError } from "../../actions/auth";

function onChange(value) {
  // console.log("Captcha value:", value);
}

class RegisterForm extends Component {
  constructor(props) {
    super(props);
    this.errorMsgForm = React.createRef();
  }
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (this.props.register(values) === true)
          return <Redirect to="/login" />;
      }
    });
    console.log("submit");
  };
  render() {
    if (this.props.isAuthenticated) return <Redirect to="/" />;
    if (this.props.isRegistered) return <Redirect to="/login" />;
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
      if (this.errorMsgForm.current) {
        this.errorMsgForm.current.scrollTop = 0;
      }
    } else errorMsg = "";
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
          className=" form"
          style={{ display: this.props.isLoading ? "none" : "block" }}
          ref={this.errorMsgForm}
        >
          <Form.Item className="input">{errorMsg}</Form.Item>
          <Form.Item className="input" hasFeedback>
            {getFieldDecorator("first_name", {
              rules: [
                { required: true, message: "Please input your First Name!" }
              ]
            })(
              <Input
                size="large"
                className="Field"
                prefix={
                  <Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />
                }
                placeholder="First Name"
              />
            )}
          </Form.Item>
          <Form.Item className="input" hasFeedback>
            {getFieldDecorator("last_name", {
              rules: [
                { required: true, message: "Please input your Last Name!" }
              ]
            })(
              <Input
                size="large"
                className="Field"
                prefix={
                  <Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />
                }
                placeholder="Last Name"
              />
            )}
          </Form.Item>
          <Form.Item className="input" hasFeedback>
            {getFieldDecorator("cin", {
              rules: [{ required: true, message: "Please input your CIN!" }]
            })(
              <Input
                className="Field"
                size="large"
                prefix={
                  <Icon type="idcard" style={{ color: "rgba(0,0,0,.25)" }} />
                }
                placeholder="CIN"
              />
            )}
          </Form.Item>
          <Form.Item className="input" hasFeedback>
            {getFieldDecorator("Company", {
              rules: [{ required: true, message: "Please input your Company!" }]
            })(
              <Input
                className="Field"
                size="large"
                prefix={
                  <Icon type="bank" style={{ color: "rgba(0,0,0,.25)" }} />
                }
                placeholder="Company"
              />
            )}
          </Form.Item>
          <Form.Item className="input" hasFeedback>
            {getFieldDecorator("email", {
              rules: [
                { required: true, message: "Please input your Email Address!" }
              ]
            })(
              <Input
                size="large"
                className="Field"
                prefix={
                  <Icon type="mail" style={{ color: "rgba(0,0,0,.25)" }} />
                }
                placeholder="Email Address"
              />
            )}
          </Form.Item>
          <Form.Item className="input" hasFeedback>
            {getFieldDecorator("tel", {
              rules: [{ required: true, message: "Please input your Phone!" }]
            })(
              <Input
                size="large"
                className="Field"
                prefix={
                  <Icon type="phone" style={{ color: "rgba(0,0,0,.25)" }} />
                }
                placeholder="Phone Number"
              />
            )}
          </Form.Item>
          <Form.Item className="input" hasFeedback>
            {getFieldDecorator("password", {
              rules: [
                { required: true, message: "Please input your Password!" }
              ]
            })(
              <Input.Password
                size="large"
                className="Field"
                prefix={
                  <Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />
                }
                type="password"
                placeholder="Password"
              />
            )}
          </Form.Item>
          <div className="box">
            <Form.Item>
              {getFieldDecorator("recaptcha", {
                rules: [{ required: true, message: "Please input captcha!" }]
              })(
                <ReCAPTCHA
                  size="normal"
                  sitekey="6LdFsL0UAAAAAJzba8-4yPPku9jpZoDoMmkfxwna"
                  onChange={onChange}
                />
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator("agreement", {
                valuePropName: "checked",
                rules: [
                  { required: true, message: "Please Accept Our Agreement!" }
                ]
              })(
                <Checkbox>
                  I have read the <a href="_blank">agreement</a>
                </Checkbox>
              )}
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                className="login-form-button btn"
                id="sign-up"
              >
                Sign up
              </Button>
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                className="login-form-button btn"
                id="sign-in"
              >
                <Link to="/login" onClick={this.props.clearError}>
                  Sign in
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
  isRegistered: state.auth.isRegistered,
  errorMsg: state.auth.errorMsg,
  isLoading: state.auth.isLoading
});
const Register = Form.create()(RegisterForm);
export default connect(
  mapStateToProps,
  { register, clearError }
)(Register);
