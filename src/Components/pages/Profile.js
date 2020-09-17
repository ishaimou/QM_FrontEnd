import React, { Component } from "react";
import AppLayout from "../Layout/Layout";
import Profile from "../Profile/Profile";
import { Redirect } from "react-router-dom";
import authService from "../../services/Auth";
class ProfilePage extends Component {
  render() {
    if (!authService.isAuthenticated()) {
      return <Redirect to="/login" />;
    }
    return <AppLayout component={<Profile />} />;
  }
}

export default ProfilePage;
