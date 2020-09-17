import React, { Component } from "react";
import { Button, Col, Spin, Modal, Result, Icon } from "antd";
import "./InspectionsDetails.css";
import NewHourlyCheck from "./newHourlyCheck";
import { connect } from "react-redux";
import { LoadInspection, clearError } from "../../actions/inspectionDetails";
import Details from "./Details";
import Progress from "./Progress";
import Forms from "./Forms";
import Stop from "./stop";
import Resume from "./Resume";
import { api } from "../../actions/config";
import axios from "axios";
import moment from "moment";
import reload from "../icons/reload";
import Total from "./Total";
// import excel from "../icons/excel";
const { confirm } = Modal;

class InspectionsDetails extends Component {
  state = {
    id: this.props.id,
    inspection: this.props.inspection,
    visible: false,
    update: false,
    total_incident: 0,
    total_halt: 0,
    total_progress: 0,
    total_weather: 0
  };
  UNSAFE_componentWillMount() {
    this.props.clearError();
    this.props.LoadInspection(this.state.id);
  }

  onCreate = () => {
    this.setState({ visible: false });
  };
  showModal = () => {
    this.setState({ visible: true });
  };
  onCancel = () => {
    this.setState({ visible: false });
  };
  update = () => {
    this.setState({ update: !this.state.update });
  };
  showReopenConfirm = () => {
    confirm({
      title: "Are you sure You Want to Re-open?",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: () => {
        const token = localStorage.getItem("token");
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        };
        if (token && this.props.inspection.inspection) {
          const body = JSON.stringify({
            inspection_status: "CLOSED",
            inspection_date_end: moment(),
            port: {
              id: this.props.inspection.inspection.port.id
            }
          });
          axios
            .patch(
              api + `list/inspection/${this.props.inspection.inspection.id}/`,
              body,
              config
            )
            .then(() => {
              this.props.LoadInspection(this.state.id);
            })
            .catch(e => console.log(e.response));
        }
      }
    });
  };
  showDeleteConfirm = () => {
    confirm({
      title: "Are you sure Close this Inspection?",
      content: "By closing this inspection you will have 48h to edit",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: () => {
        const token = localStorage.getItem("token");
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        };
        if (token && this.props.inspection.inspection) {
          const body = JSON.stringify({
            inspection_status: "CLOSED",
            inspection_date_end: moment(),
            port: {
              id: this.props.inspection.inspection.port.id
            }
          });
          axios
            .patch(
              api + `list/inspection/${this.props.inspection.inspection.id}/`,
              body,
              config
            )
            .then(() => {
              this.props.LoadInspection(this.state.id);
            })
            .catch(e => console.log(e.response));
        }
      }
    });
  };
  Total = (incident, halt, progress, weather) => {
    this.setState({
      total_incident: incident,
      total_halt: halt,
      total_progress: progress,
      total_weather: weather
    });
  };
  cantEdit = () => {
    if (this.props.inspection.inspection) {
      if (
        moment(this.props.inspection.inspection.inspection_date_end).isValid()
      ) {
        if (
          moment().diff(
            moment(this.props.inspection.inspection.inspection_date_end),
            "hours"
          ) > 24
        ) {
          return true;
        }
      }
    }
    return false;
  };
  toRender() {
    if (this.props.inspection.isLoading)
      return (
        <div id="spinDiv">
          <Spin size="large" id="spin" />
        </div>
      );
    else {
      return (
        <React.Fragment>
          <NewHourlyCheck
            visible={this.state.visible}
            onCancel={this.onCancel}
            onCreate={this.onCreate}
            id={this.state.id}
            update={this.update}
          />
          <Result
            status="500"
            style={{
              display: this.props.inspection.errorMsg === "" ? "none" : "block"
            }}
            title="500"
            subTitle="Sorry, something went wrong."
            extra={
              <Button type="primary" onClick={() => window.location.reload()}>
                Reload
              </Button>
            }
          />
          <div
            style={{
              display: this.props.inspection.errorMsg === "" ? "block" : "none"
            }}
          >
            <div id="inspection-head">
              <Col span={18}>
                <Col span={6}>
                  <Button
                    type="primary"
                    onClick={() => window.location.reload()}
                  >
                    <Icon
                      component={reload}
                      style={{
                        maxWidth: "24px",
                        width: "15px",
                        height: "20px",
                        fill: "#fff"
                      }}
                    />
                  </Button>
                  {/* <Tooltip
                    placement="bottom"
                    title="Export Inspection"
                    trigger="hover"
                  >
                    <Icon
                      component={excel}
                      style={{
                        maxWidth: "34px",
                        width: "100%",
                        marginLeft: "20px"
                      }}
                    />
                  </Tooltip> */}
                </Col>
                <Total
                  total_incident={this.state.total_incident}
                  total_halt={this.state.total_halt}
                  total_progress={this.state.total_progress}
                  total_weather={this.state.total_weather}
                />
              </Col>
              <Col span={6}>
                {this.props.inspection.inspection &&
                this.props.inspection.inspection.inspection_status ===
                  "CLOSED" ? (
                  <React.Fragment>
                    {!this.cantEdit() ? (
                      <Button
                        id="btn"
                        style={{ width: "60%", float: "left" }}
                        onClick={this.showReopenConfirm}
                      >
                        Re-open
                      </Button>
                    ) : (
                      ""
                    )}
                    <Icon
                      type="lock"
                      style={{ fontSize: "50px", float: "right", width: "25%" }}
                    />
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <Col md={24} lg={12}>
                      <Button
                        id="btn"
                        style={{ width: "90%" }}
                        onClick={this.showModal}
                      >
                        Survey
                      </Button>
                    </Col>
                    <Col md={24} lg={12}>
                      {this.props.inspection.inspection &&
                      this.props.inspection.inspection.inspection_status ===
                        "INPROGRESS" ? (
                        <Stop
                          Load={this.props.LoadInspection}
                          id={this.state.id}
                        />
                      ) : (
                        <Resume
                          Load={this.props.LoadInspection}
                          id={this.state.id}
                        />
                      )}
                    </Col>
                  </React.Fragment>
                )}
              </Col>
            </div>
            <Col span={24}>
              <Progress Total={this.Total} />
            </Col>
            <Col span={24}>
              <Details />
            </Col>
            <Col span={24}>
              <Forms
                update={this.update}
                check={this.state.update}
                id={this.state.id}
                cantEdit={this.cantEdit.bind(this)}
              />
            </Col>
            <Col span={24}>
              <Col xs={24} sm={12} lg={4} style={{ float: "right" }}>
                {this.props.inspection.inspection &&
                this.props.inspection.inspection.inspection_status ===
                  "INPROGRESS" ? (
                  <Button
                    id="close"
                    type="primary"
                    style={{ width: "100%" }}
                    onClick={this.showDeleteConfirm.bind(this)}
                  >
                    Close
                  </Button>
                ) : (
                  ""
                )}
              </Col>
            </Col>
          </div>
        </React.Fragment>
      );
    }
  }
  render() {
    return <React.Fragment>{this.toRender()}</React.Fragment>;
  }
}

const mapStateToProps = state => ({
  inspection: state.inspectionDetails
});

export default connect(mapStateToProps, { LoadInspection, clearError })(
  InspectionsDetails
);
