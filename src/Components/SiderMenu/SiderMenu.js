import React, { Component } from "react";
import { Icon, Drawer, Menu, Avatar, Input } from "antd";
import "./SiderMenu.css";
import { connect } from "react-redux";
import { logout } from "../../actions/auth";
import { Link } from "react-router-dom";
const { SubMenu } = Menu;
class SiderMenu extends Component {
  render() {
    return (
      <Drawer
        title={
          <React.Fragment>
            <Avatar src="https://www.w3schools.com/howto/img_avatar.png" />
            <span id="header-username">Username </span>
          </React.Fragment>
        }
        placement="left"
        closable={false}
        className="draw"
        onClose={this.props.onClose}
        visible={this.props.visible}
      >
        <Menu
          style={{
            width: "100%",
            float: "left",
            height: "100%",
            position: "absolute",
            left: 0
          }}
          defaultSelectedKeys={["1"]}
          defaultOpenKeys={["sub1"]}
          mode="vertical"
        >
          <Menu.Item key="5" selectable={false}>
            <Input.Search
              id="input"
              placeholder="input search text"
              onSearch={value => console.log(value)}
            />
          </Menu.Item>
          <Menu.Item key="12">
            <Link to="/">
              <Icon type="home" />
              Home
            </Link>
          </Menu.Item>
          <SubMenu
            key="sub4"
            title={
              <span>
                <Icon type="setting" />
                <span>Setting</span>
              </span>
            }
          >
            <Menu.Item key="9">
              <Link to="/setting">
                <Icon type="setting" />
                Setting
              </Link>
            </Menu.Item>
            <Menu.Item key="10">
              <Link to="/profile">
                <Icon type="user" />
                Profile
              </Link>
            </Menu.Item>
          </SubMenu>
          <Menu.Item key="8" onClick={this.props.logout}>
            <Icon type="home" />
            Logout
          </Menu.Item>
        </Menu>
      </Drawer>
    );
  }
}

export default connect(
  null,
  { logout }
)(SiderMenu);
