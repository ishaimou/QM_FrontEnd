import React, { Component } from "react";
import AppLayout from "../Layout/Layout";
import Filter from "../Filter/Filter";
import { Redirect } from "react-router-dom";
import authService from "../../services/Auth";
class FilterPage extends Component {
  render() {
    if (!authService.isAuthenticated()) {
      return <Redirect to="/login" />;
    }
    return <AppLayout component={<Filter />} />;
  }
}

export default FilterPage;
