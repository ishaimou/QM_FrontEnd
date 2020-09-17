import React, { Component } from "react";
import { Layout, Icon } from "antd";
import Logo from "./Logo.png";
import "./Sider.css";
import { connect } from "react-redux";
import { logout } from "../../actions/auth";
import { Link } from "react-router-dom";

const { Sider } = Layout;
class Siders extends Component {
  state = {
    width: this.props.width
  };
  render() {
    return (
      <Sider
        trigger={null}
        collapsed={true}
        collapsedWidth={this.state.width}
        breakpoint="md"
        onBreakpoint={isbreak => {
          this.setState({ width: isbreak ? 0 : 80 });
        }}
        className="my-sider"
        style={{
          background: "linear-gradient(-154deg,#616d86,#1f1c2c)",
          boxShadow: "inset 0px 0px 100px rgba(0,21,41,.6)"
        }}
      >
        <div className="logo">
          <img src={Logo} alt="Ocp Logo" />
        </div>
        <div id="side-menu">
          <Link to="/">
            <div className="item">
              <Icon type="home" />
            </div>
          </Link>
        </div>
        <div id="side-menu">
          <Link to="/filter">
            <div className="item">
              <Icon type="filter" />
            </div>
          </Link>
        </div>
        <div id="side-logout">
          <Icon type="logout" onClick={this.props.logout} id="s-logout" />
        </div>
      </Sider>
    );
  }
}

export default connect(
  null,
  { logout }
)(Siders);
