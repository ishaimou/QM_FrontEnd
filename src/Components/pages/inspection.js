import React, { Component } from "react";
import AppLayout from "../Layout/Layout";
import InspectionDetails from "../InspectionsDetails/InspectionsDetails";
export default class inspection extends Component {
  render() {
    return (
      <AppLayout
        component={<InspectionDetails id={this.props.match.params.id} />}
      />
    );
  }
}
