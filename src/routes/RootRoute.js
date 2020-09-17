import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import PrivateRoute from "./privateRoute";
import Home from "../Components/pages/Home";
import Filter from "../Components/pages/Filter";
import Profile from "../Components/pages/Profile";
import Auth from "../Components/Auth/Auth";
import Login from "../Components/Auth/LoginForm";
import Register from "../Components/Auth/RegisterForm";
import NotFound from "../Components/pages/notFound";
import InspectionDetails from "../Components/pages/inspection";
import { connect } from "react-redux";

class RootRoute extends Component {
  render() {
    return (
      <Switch>
        <PrivateRoute
          exact
          path="/inspection/:id"
          component={InspectionDetails}
        />
        <PrivateRoute exact path="/" component={Home} />
        <PrivateRoute exact path="/filter" component={Filter} />
        <PrivateRoute exact path="/profile" component={Profile} />
        <Route
          path="/login"
          exact
          render={props => <Auth {...props} component={Login} />}
        />
        <Route
          path="/register"
          exact
          render={props => <Auth {...props} component={Register} />}
        />
        <Route path="*" component={NotFound} />
      </Switch>
    );
  }
}

const mapStateToProps = state => ({
  loggedIn: state.auth.isAuthenticated
});
export default connect(mapStateToProps)(RootRoute);
