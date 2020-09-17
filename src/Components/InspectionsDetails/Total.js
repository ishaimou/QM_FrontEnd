import React, { Component } from "react";
import { Col, Row, Tooltip } from "antd";
import Time from "../../services/Time";

export default class Total extends Component {
  render() {
    return (
      <Col span={16}>
        <Row gutter={30}>
          <Col sm={12} md={12} lg={6}>
            <Tooltip placement="bottom" title="Good Progress" trigger="click">
              <div className="total-events" id="total-1">
                <p id="total-content">
                  <i>{Time.getTime(this.props.total_progress)}</i>
                </p>
              </div>
            </Tooltip>
          </Col>
          <Col sm={12} md={12} lg={6}>
            <Tooltip
              placement="bottom"
              title="Quality Incident"
              trigger="click"
            >
              <div className="total-events" id="total-2">
                <p id="total-content">
                  <i>{Time.getTime(this.props.total_incident)}</i>
                </p>
              </div>
            </Tooltip>
          </Col>
          <Col sm={12} md={12} lg={6}>
            <Tooltip placement="bottom" title="Halt Stop" trigger="click">
              <div className="total-events" id="total-3">
                <p id="total-content">
                  <i>{Time.getTime(this.props.total_halt)}</i>
                </p>
              </div>
            </Tooltip>
          </Col>
          <Col sm={12} md={12} lg={6}>
            <Tooltip placement="bottom" title="Weather Stop" trigger="click">
              <div className="total-events" id="total-4">
                <p id="total-content">
                  <i>{Time.getTime(this.props.total_weather)}</i>
                </p>
              </div>
            </Tooltip>
          </Col>
        </Row>
      </Col>
    );
  }
}
