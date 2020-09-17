import React, { Component } from "react";
import { Provider } from "react-redux";
import store from "../store";
import { BrowserRouter as Router } from "react-router-dom";
import { loadUser } from "../actions/auth";
import RootRoute from "../routes/RootRoute";

class App extends Component {
  componentDidMount() {
    store.dispatch(loadUser());
  }
  render() {
    return (
      <Provider store={store}>
        <Router>
          <RootRoute />
        </Router>
      </Provider>
    );
  }
}

export default App;
