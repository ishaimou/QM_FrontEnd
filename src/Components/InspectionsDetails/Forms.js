import React, { Component } from "react";
import { Tabs } from "antd";
import Product from "./Product";
import Clients from "./Clients";
import Survey from "./Survey";
import Loading from "./Loading";
import Hourly from "./HourlyCheck";
import Uploads from "./Upload";

const { TabPane } = Tabs;

class Forms extends Component {
  state = {
    id: 10,
    fill: true
  };

  render() {
    if (this.props.inspection && this.state.fill) {
      this.setState({
        id: this.props.inspection.port.id,
        fill: false
      });
    }
    return (
      <Tabs defaultActiveKey="1" style={{ margin: "5% 0" }}>
        <TabPane tab="Loading" key="1">
          <Loading
            Load={this.props.Load}
            id={this.props.id}
            cantEdit={this.props.cantEdit}
          />
        </TabPane>
        <TabPane tab="Product" key="2">
          <Product cantEdit={this.props.cantEdit} />
        </TabPane>
        <TabPane tab="Client" key="3">
          <Clients cantEdit={this.props.cantEdit} />
        </TabPane>
        <TabPane tab="Intermediate Draught Survey" key="4">
          <Survey cantEdit={this.props.cantEdit} />
        </TabPane>
        <TabPane tab="Temperature and Humidity" key="5">
          <Hourly
            update={this.props.update}
            check={this.props.check}
            id={this.props.id}
          />
        </TabPane>
        <TabPane tab="Upload a file" key="6">
          <Uploads />
        </TabPane>
      </Tabs>
    );
  }
}

export default Forms;
