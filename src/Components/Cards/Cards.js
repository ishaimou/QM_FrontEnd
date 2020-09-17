import React, { Component } from "react";
import {
  Typography,
  Col,
  Icon,
  Progress,
  Descriptions,
  Row,
  Modal
} from "antd";
import "./Cards.css";
import ship from "../icons/ship";
import delay from "../icons/delay";
import calendar from "../icons/calendar";
import anchor from "../icons/anchor";
import { withRouter } from "react-router-dom";
import moment from "moment";

const { Title, Text } = Typography;
const iconspan = {
  xs: 24,
  sm: 24,
  md: 24,
  lg: 24,
  xl: 24
};

const columns = {
  xxl: 4,
  xl: 4,
  lg: 4,
  md: 4,
  sm: 4,
  xs: 4
};
class Card extends Component {
  state = {
    id: this.props.inspection.id,
    expand: false
  };
  routeChange() {
    let path = `inspection/${this.props.inspection.id}`;
    this.props.history.push(path);
  }
  onExpand = () => {
    this.setState({ expand: !this.state.expand });
  };
  getColor(status) {
    if (status === "INPROGRESS") return "#27ae60";
    else if (status === "ONHOLD") return "#e74c3c";
    else if (status === "CLOSED") return "#2c3e50";
    else if (status === "PENDED") return "#e67e22";
    else return "#fff";
  }
  getProducts = client => {
    if (client.product && client.product.productcategory) {
      if (
        client.product.productcategory.productfamily &&
        client.product.productcategory.productfamily.name
      )
        return client.product.productcategory.productfamily.name;
    }
  };
  render() {
    return (
      <React.Fragment>
        <div className="card">
          <div
            id="title-container"
            onClick={this.routeChange.bind(this)}
            style={{
              borderTop: `2px solid ${this.getColor(
                this.props.inspection.status
              )}`
            }}
          >
            <Title level={4} id="title">
              {this.props.inspection.docks.which_dock +
                "-" +
                this.props.inspection.port.port.name +
                " " +
                this.props.inspection.date.format("DD-MMM")}
            </Title>
          </div>
          <div id="sub-title">
            <Text strong id="username">
              {this.props.inspection.user.user.first_name +
                " " +
                this.props.inspection.user.user.last_name}
            </Text>

            <Text
              strong
              id="stat"
              style={{
                color: `${this.getColor(this.props.inspection.status)}`
              }}
            >
              <div
                id="circle"
                style={{
                  background: `${this.getColor(this.props.inspection.status)}`
                }}
              ></div>
              {this.props.inspection.status}
            </Text>
          </div>
          <div id="content">
            <div id="icons">
              <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                <Col span={18}>
                  <Col {...iconspan} id="icon">
                    <Icon
                      component={ship}
                      style={{ width: "70%", maxWidth: "24px" }}
                    />
                    <span>{this.props.inspection.vessel.name}</span>
                  </Col>
                  <Col {...iconspan} id="icon">
                    <Icon
                      component={anchor}
                      style={{ width: "100%", maxWidth: "24px" }}
                    />
                    <span>{this.props.inspection.vessel_berthed}</span>
                  </Col>
                  <Col {...iconspan} id="icon">
                    <Icon
                      component={delay}
                      style={{ width: "70%", maxWidth: "24px" }}
                    />
                    <span>{this.props.inspection.delay} Hour</span>
                  </Col>
                  <Col {...iconspan} id="icon">
                    <Icon
                      component={calendar}
                      style={{ width: "70%", maxWidth: "24px" }}
                    />
                    <span>
                      {this.props.inspection.date.format("YYYY/MM/DD HH:mm")}
                    </span>
                  </Col>
                </Col>
                <Col span={6}>
                  <div id="products">
                    {this.props.inspection && this.props.inspection.clients
                      ? this.props.inspection.clients.map((client, index) =>
                          client.product ? (
                            <React.Fragment key={index}>
                              <Col span={8}>
                                {client.loaded ? (
                                  <Icon type="check" id="products-icon" />
                                ) : (
                                  ""
                                )}
                              </Col>
                              <Col span={16}>
                                <p id="products-name">
                                  {this.getProducts(client)}
                                </p>
                              </Col>
                            </React.Fragment>
                          ) : (
                            ""
                          )
                        )
                      : ""}
                  </div>
                </Col>
                <Modal
                  visible={this.state.expand}
                  onCancel={this.onExpand}
                  width="40%"
                  footer={null}
                  title="Inspection Details"
                >
                  <Descriptions
                    bordered
                    style={{ width: "100%" }}
                    layout="vertical"
                  >
                    <Descriptions.Item label="Status" {...columns} span={1}>
                      {this.props.inspection
                        ? this.props.inspection.status
                        : ""}
                    </Descriptions.Item>
                    <Descriptions.Item label="Start Date" {...columns} span={1}>
                      {this.props.inspection
                        ? this.props.inspection.date.format("YYYY/MM/DD HH:mm")
                        : ""}
                    </Descriptions.Item>

                    <Descriptions.Item label="Vessel Berthed" {...columns}>
                      {this.props.inspection
                        ? this.props.inspection.vessel_berthed
                        : ""}
                    </Descriptions.Item>
                    <Descriptions.Item
                      label="Vessel Arrival"
                      {...columns}
                      span={1}
                    >
                      {this.props.inspection
                        ? this.props.inspection.vessel_arrived
                        : ""}
                    </Descriptions.Item>
                    <Descriptions.Item
                      label="Vessel Name"
                      {...columns}
                      span={1}
                    >
                      {this.props.inspection
                        ? this.props.inspection.vessel.name
                        : ""}
                    </Descriptions.Item>
                    <Descriptions.Item
                      label="Foreign Inspector"
                      {...columns}
                      span={1}
                    >
                      {this.props.inspection
                        ? this.props.inspection.foreign_inspector
                          ? "true"
                          : "false"
                        : ""}
                    </Descriptions.Item>
                  </Descriptions>
                </Modal>
                <Col span={24}>
                  <div id="expand" onClick={this.onExpand}>
                    <Icon type="plus" />
                  </div>
                </Col>
              </Col>
            </div>
          </div>
          <div id="footer">
            <Row>
              <Progress
                percent={
                  this.props.inspection &&
                  this.props.inspection.status === "CLOSED"
                    ? 100
                    : Math.round(
                        (moment().diff(this.props.inspection.date, "minutes") *
                          100) /
                          moment()
                            .add(1, "day")
                            .diff(this.props.inspection.date, "minutes")
                      )
                }
                status={
                  this.props.inspection.status !== "ONHOLD"
                    ? this.props.inspection.status === "CLOSED"
                      ? "success"
                      : "active"
                    : "exception"
                }
              />
            </Row>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(Card);
