import React, { Component } from "react";
import MyContent from "../Content/MyContent";
import AppLayout from "../Layout/Layout";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

class Home extends Component {
  render() {
    if (!this.props.isAuth) return <Redirect to="/login" />;
    return <AppLayout component={<MyContent />} />;
  }
}

const mapStateToProps = state => ({
  isAuth: state.auth.isAuthenticated
});

export default connect(mapStateToProps)(Home);
