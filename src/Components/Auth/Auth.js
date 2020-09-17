import React, { Component } from "react";
import "./Auth.css";
import Logo from "../QmLogo.svg";
import { Layout, Col } from "antd";
export default class Login extends Component {
  render() {
    return (
      <Layout className="login">
        <div className="Layer">
          <Col
            xs={{ span: 24 }}
            md={{ span: 16 }}
            lg={{ span: 12 }}
            xl={{ span: 10 }}
            xxl={{ span: 8 }}
          >
            <div className="auth-form">
              <div className="logo-form">
                <img src={Logo} alt="QM logo" />
              </div>
              {<this.props.component/>}
            </div>
          </Col>
        </div>
      </Layout>
    );
  }
}
