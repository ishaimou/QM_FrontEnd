import React, { Component } from "react";
import Navbar from "../Navbar/Navbar";
import Sider from "../Sider/Sider";
import { Layout, Icon } from "antd";
import "./Layout.css";
import SiderMenu from "../SiderMenu/SiderMenu";
import Logo from "../../Logo.png";
const { Header, Content } = Layout;

class AppLayout extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.onClose = this.onClose.bind(this);
  }
  state = {
    visible: false
  };

  showDrawer = () => {
    if (this._isMounted)
      this.setState({
        visible: true
      });
  };

  onClose = () => {
    if (this._isMounted)
      this.setState({
        visible: false
      });
  };
  componentWillMount() {
    this._isMounted = true;
  }
  componentWillUnmount() {
    this._isMounted = false;
  }
  render() {
    return (
      <Layout style={{ minHeight: "100vh" }}>
        <Sider with={this.state.collapsed} />
        <SiderMenu onClose={this.onClose} visible={this.state.visible} />
        <Layout>
          <Header id="header">
            <Icon className="l-trigger" type="menu" onClick={this.showDrawer} />
            <div className="md-logo">
              <img src={Logo} alt="Ocp Logo" />
            </div>
            <Navbar />
          </Header>

          <Content id="Content">{this.props.component}</Content>
        </Layout>
      </Layout>
    );
  }
}

export default AppLayout;
