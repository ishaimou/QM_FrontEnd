import React, { Component } from "react";
import { Modal, Form, Input } from "antd";
import "./NewInspection.css";
import { DatePicker, Col, Row, Select, TimePicker, Spin } from "antd";
import axios from "axios";
import { api } from "../../actions/config";
import ProductCascader from "../ProductsCascader/ProductsCascader";

const InputGroup = Input.Group;
const { Option } = Select;
const column = {
  xs: 24,
  sm: 24,
  md: 12,
  lg: 12,
  xl: 12,
  xxl: 12,
};
class NewInspection extends Component {
  _isMounted = false;
  state = {
    clients: [],
    productfamily: [],
    productcategory: [],
    productype: [],
    productname: [],
    ports: [],
    vessel: [],
    productid: null,
  };
  componentWillUnmount() {
    this._isMounted = false;
  }
  UNSAFE_componentWillMount() {
    this._isMounted = true;
    this.getCombo();
  }
  getCombo = () => {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    if (token) {
      axios
        .get(api + `port/`, config)
        .then((res) => {
          let port = [];
          if (Array.isArray(res.data.results) && res.data.count !== 0) {
            res.data.results.forEach((item) => {
              port.push(item);
            });
            if (this._isMounted) {
              this.setState({
                ...this.state,
                ports: port,
              });
            }
          }
        })
        .catch((e) => console.log(e.response));
      axios
        .get(api + `vessel/`, config)
        .then((res) => {
          let vessel = [];
          if (Array.isArray(res.data.results) && res.data.count !== 0) {
            res.data.results.forEach((item) => {
              vessel.push(item);
            });
            if (this._isMounted) {
              this.setState({
                vessel: vessel,
              });
            }
          }
        })
        .catch((e) => console.log(e.response));
      axios
        .get(api + `client/`, config)
        .then((res) => {
          let client = [];
          if (Array.isArray(res.data.results) && res.data.count !== 0) {
            res.data.results.forEach((item) => {
              client.push(item);
            });
            if (this._isMounted) {
              this.setState({
                clients: client,
              });
            }
          }
        })
        .catch((e) => console.log(e.response));
    }
  };
  render() {
    const { visible, onCancel, onCreate, form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        visible={visible}
        title="Create a new inspection"
        okText="Create"
        onCancel={onCancel}
        width="50%"
        onOk={onCreate}
      >
        <React.Fragment>
          <div
            className="spinDiv"
            style={{ display: this.props.isLoading ? "block" : "none" }}
          >
            <Spin size="large" />
          </div>
          <Form
            layout="vertical"
            style={{
              width: "90%",
              margin: "auto",
              display: this.props.isLoading ? "none" : "block",
            }}
          >
            <Row gutter={10}>
              <Col {...column} className="col-input">
                <Form.Item>
                  <InputGroup compact>
                    {getFieldDecorator("Port", {
                      rules: [
                        {
                          required: true,
                          message: "Required!",
                        },
                      ],
                    })(
                      <Select
                        showSearch
                        placeholder="Port Loading"
                        style={{ width: "70%" }}
                        filterOption={(input, option) =>
                          option.props.children
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        {this.state.ports
                          ? this.state.ports.map((item) => (
                              <Option value={item.id} key={item.id}>
                                {item.name}
                              </Option>
                            ))
                          : ""}
                      </Select>
                    )}
                    {getFieldDecorator("Quai", {
                      rules: [
                        {
                          required: true,
                          message: "Required!",
                        },
                      ],
                    })(
                      <Select
                        showSearch
                        placeholder="Quai"
                        style={{ width: "30%" }}
                        filterOption={(input, option) =>
                          option.props.children
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        <Option value="1">1</Option>
                        <Option value="2">2</Option>
                        <Option value="3">3</Option>
                        <Option value="4">4</Option>
                        <Option value="5">5</Option>
                        <Option value="6">6</Option>
                        <Option value="7">7</Option>
                        <Option value="8">8</Option>
                        <Option value="9">9</Option>
                        <Option value="10">10</Option>
                      </Select>
                    )}
                  </InputGroup>
                </Form.Item>
              </Col>
              <Col {...column} className="col-input">
                <Form.Item>
                  {getFieldDecorator("Vessel_ID", {
                    rules: [
                      {
                        required: true,
                        message: "Required!",
                      },
                    ],
                  })(
                    <Select
                      showSearch
                      placeholder="Vessel Name"
                      filterOption={(input, option) =>
                        option.props.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {this.state.vessel
                        ? this.state.vessel.map((item) => (
                            <Option value={item.id} key={item.id}>
                              {item.name}
                            </Option>
                          ))
                        : ""}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col {...column} className="col-input">
                <Form.Item>
                  <InputGroup compact>
                    {getFieldDecorator("Vessel_Arrived", {
                      rules: [
                        {
                          required: true,
                          message: "Required!",
                        },
                      ],
                    })(
                      <DatePicker
                        style={{ width: "65%" }}
                        placeholder="Arrived"
                      />
                    )}
                    {getFieldDecorator("Vessel_Arrived", {
                      rules: [
                        {
                          required: true,
                          message: "Required!",
                        },
                      ],
                    })(<TimePicker style={{ width: "35%" }} format="HH:mm" />)}
                  </InputGroup>
                </Form.Item>
              </Col>
              <Col {...column} className="col-input">
                <Form.Item>
                  <InputGroup compact>
                    {getFieldDecorator("Vessel_Berthed", {
                      rules: [
                        {
                          required: true,
                          message: "Required!",
                        },
                      ],
                    })(
                      <DatePicker
                        style={{ width: "65%" }}
                        placeholder="Berthed"
                      />
                    )}
                    {getFieldDecorator("Vessel_Berthed", {
                      rules: [
                        {
                          required: true,
                          message: "Required!",
                        },
                      ],
                    })(<TimePicker style={{ width: "35%" }} format="HH:mm" />)}
                  </InputGroup>
                </Form.Item>
              </Col>
              <Col {...column} className="col-input">
                <Form.Item>
                  {getFieldDecorator("Client_ID", {
                    rules: [
                      {
                        required: true,
                        message: "Required!",
                      },
                    ],
                  })(
                    <Select
                      showSearch
                      placeholder="Client"
                      filterOption={(input, option) =>
                        option.props.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {this.state.clients
                        ? this.state.clients.map((item) => (
                            <Option value={item.id} key={item.id}>
                              {item.name}
                            </Option>
                          ))
                        : ""}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col {...column}>
                <Form.Item>
                  <ProductCascader setProductId={this.props.setProductId} />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </React.Fragment>
      </Modal>
    );
  }
}

export default Form.create({ name: "New Inspection" })(NewInspection);
