import React, { Component } from "react";
import { connect } from "react-redux";
import { Descriptions } from "antd";

const columns = {
  xxl: 4,
  xl: 3,
  lg: 3,
  md: 3,
  sm: 2,
  xs: 1
};
class Details extends Component {
  render() {
    return (
      <Descriptions bordered style={{ width: "100%" }}>
        <Descriptions.Item label="Status" {...columns}>
          {this.props.inspection.inspection
            ? this.props.inspection.inspection.inspection_status
            : ""}
        </Descriptions.Item>
        <Descriptions.Item label="Start Date" {...columns}>
          {this.props.inspection.inspection
            ? this.props.inspection.inspection.inspection_date
            : ""}
        </Descriptions.Item>
        <Descriptions.Item label="Inspector" {...columns}>
          {this.props.inspection.inspection
            ? this.props.inspection.inspection.user.user.first_name +
              " " +
              this.props.inspection.inspection.user.user.last_name
            : ""}
        </Descriptions.Item>
        <Descriptions.Item label="Vessel Berthed" {...columns}>
          {this.props.inspection.inspection
            ? this.props.inspection.inspection.vessel_berthed
            : ""}
        </Descriptions.Item>
        <Descriptions.Item label="Vessel Arrival" {...columns}>
          {this.props.inspection.inspection
            ? this.props.inspection.inspection.vessel_arrived
            : ""}
        </Descriptions.Item>
        <Descriptions.Item label="Vessel Name" {...columns}>
          {this.props.inspection.inspection
            ? this.props.inspection.inspection.vessel.name
            : ""}
        </Descriptions.Item>
        <Descriptions.Item label="Number of Clients" {...columns}>
          {this.props.inspection.inspection
            ? this.props.inspection.inspection.clients.length
            : ""}
        </Descriptions.Item>
        <Descriptions.Item label="Port" {...columns}>
          {this.props.inspection.inspection
            ? this.props.inspection.inspection.port.port.name
            : ""}
        </Descriptions.Item>
        <Descriptions.Item label="Dock" {...columns}>
          {this.props.inspection.inspection
            ? this.props.inspection.inspection.docks.which_dock
            : ""}
        </Descriptions.Item>
      </Descriptions>
    );
  }
}

const mapStateToProps = state => ({
  inspection: state.inspectionDetails
});
export default connect(mapStateToProps)(Details);
