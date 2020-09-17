import React, { Component } from "react";
import { Table } from "antd";
import { api } from "../../actions/config";
import axios from "axios";
import moment from "moment";
const columns = [
  {
    title: "Date",
    dataIndex: "Date",
  },
  {
    title: "Cargo Temperature",
    dataIndex: "Temperature",
  },
  {
    title: "Relative Humidity",
    dataIndex: "Humidity",
  },
  {
    title: "Ambient Temperature",
    dataIndex: "Ambient_Temperature",
  },
  {
    title: "Origine Marchandise",
    dataIndex: "Marchandise",
  },
  {
    title: "Debit (MT/Hr)",
    dataIndex: "Debit",
  },
];

export default class HourlyCheck extends Component {
  state = {
    Survey: [],
  };
  getData = () => {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    if (token) {
      axios
        .get(
          api + `hourlycheck/?inspection_ref=${this.props.id}&ordering=-date`,
          config
        )
        .then((res) => {
          let data = [];
          res.data.results.forEach((item) => {
            let survey = {
              key: item.id,
              Date: moment(item.date).format("MM/DD/YYYY HH:mm"),
              Temperature: item.temperature,
              Humidity: item.humidity,
              Ambient_Temperature: item.ambient_temperature,
              Marchandise: item.origin,
              Debit: item.debit,
            };
            data.push(survey);
          });
          this.setState({ Survey: data });
        });
    }
  };
  componentDidMount() {
    this.getData();
  }
  render() {
    if (this.props.check) {
      this.getData();
      this.props.update();
    }
    return (
      <Table
        pagination={{ pageSize: 5 }}
        columns={columns}
        dataSource={this.state.Survey}
        size="middle"
        bordered
      />
    );
  }
}
