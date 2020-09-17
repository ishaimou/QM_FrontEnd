import React, { Component } from "react";
import { Icon, Avatar, Menu, Dropdown } from "antd";
import "./Navbar.css";
import { Link } from "react-router-dom";

const menu = (
  <Menu className="menu">
    <Menu.Item key="0">
      <Link to="/profile">Profile</Link>
    </Menu.Item>
    <Menu.Divider />
    <Menu.Item key="3">
      <Link to="/setting">Setting</Link>
    </Menu.Item>
  </Menu>
);

export default class Navbar extends Component {
  render() {
    return (
      <div className="nav">
        <Dropdown overlay={menu} trigger={["click"]}>
          <div className="avatar-div">
            <Avatar icon="user" />
          </div>
        </Dropdown>

        <div className="notif-div">
          <Icon type="info-circle" />
        </div>
        {/* <div className="search">
          <Input.Search
            id="input"
            placeholder="input search text"
            onSearch={value => console.log(value)}
          />
        </div> */}
      </div>
    );
  }
}
