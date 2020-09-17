import React, { Component } from "react";
import {
  Row,
  Button,
  Col,
  Empty,
  Collapse,
  Typography,
  Form,
  Select,
  Spin,
  Icon,
  DatePicker,
  Pagination,
} from "antd";
import "./Filter.css";
import { connect } from "react-redux";
import Card from "../Cards/Cards";
import { loadInspections } from "../../actions/filter";
import axios from "axios";
import { api } from "../../actions/config";
import reload from "../icons/reload";

const { Title } = Typography;
const { Panel } = Collapse;
const { Option } = Select;
const { RangePicker } = DatePicker;
const span = {
  xs: 24,
  sm: 24,
  md: 12,
  lg: 8,
  xl: 8,
  xxl: 6,
};
const OPTIONS = ["ONHOLD", "CLOSED", "INPROGRESS"];

class Filter extends Component {
  _isMounted = false;
  state = {
    visible: false,
    selectedItems: [],
    vessels: [],
    users: [],
    company: [],
    ports: [],
    values: null,
    page: 1,
  };
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
        .get(api + `vessel/`, config)
        .then((res) => {
          if (this._isMounted) {
            this.setState({ vessels: res.data.results });
          }
        })
        .catch((e) => console.log(e.response));
      axios
        .get(api + `port/`, config)
        .then((res) => {
          if (this._isMounted) {
            this.setState({ ports: res.data.results });
          }
        })
        .catch((e) => console.log(e.response));
      axios
        .get(api + `users/`, config)
        .then((res) => {
          if (this._isMounted) {
            this.setState({ users: res.data.results });
            let data = [];
            res.data.forEach((item) => {
              data.push(item.profile.company_name);
            });
            this.setState({ company: new Set(data) });
          }
        })
        .catch((e) => console.log(e.response));
    }
  };
  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };

  saveFormRef = (formRef) => {
    this.formRef = formRef;
  };
  componentDidMount() {
    this._isMounted = true;
    this.props.loadInspections("clear", this.state.page);
    this.getCombo();
  }
  handleChange = (selectedItems) => {
    this.setState({ selectedItems });
  };
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.setState({ values: values });
        this.props.loadInspections(values, 2);
      }
    });
  };
  componentWillUnmount() {
    this._isMounted = false;
  }
  clear = () => {
    this.props.form.resetFields();
    this.props.loadInspections("clear", this.state.page);
  };
  onChange = (page) => {
    this.setState({ page: page });
    if (this.state.values) this.props.loadInspections(this.state.values, page);
    else this.props.loadInspections("clear", page);
  };
  render() {
    const { selectedItems } = this.state;
    const { getFieldDecorator } = this.props.form;
    const filteredOptions = OPTIONS.filter((o) => !selectedItems.includes(o));
    if (this.props.count == null)
      return (
        <Spin
          id="spin"
          indicator={<Icon type="loading" id="spin-icon" spin />}
        />
      );
    return (
      <React.Fragment>
        <div
          style={{ display: this.props.isLoading ? "block" : "none" }}
          id="loading"
        >
          <Spin
            id="spin"
            indicator={<Icon type="loading" id="spin-icon" spin />}
          />
        </div>
        <div style={{ display: !this.props.isLoading ? "block" : "none" }}>
          <div className="head">
            <Col span={22}>
              <Collapse bordered={false} defaultActiveKey={["1"]}>
                <Panel header={<Title level={4}>Inspections Filter</Title>}>
                  <Form
                    className="ant-advanced-search-form"
                    onSubmit={this.handleSubmit}
                  >
                    <Row gutter={20}>
                      <Col span={6}>
                        <Form.Item>
                          {getFieldDecorator("Status", {
                            setFieldsValue: selectedItems,
                          })(
                            <Select
                              mode="multiple"
                              allowClear
                              placeholder="Select Inspections Status"
                              onChange={this.handleChange}
                            >
                              {filteredOptions.map((item) => (
                                <Select.Option key={item} value={item}>
                                  {item}
                                </Select.Option>
                              ))}
                            </Select>
                          )}
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item>
                          {getFieldDecorator(
                            "Vessel",
                            {}
                          )(
                            <Select
                              showSearch
                              allowClear
                              placeholder="Vessel"
                              filterOption={(input, option) =>
                                option.props.children
                                  .toLowerCase()
                                  .indexOf(input.toLowerCase()) >= 0
                              }
                            >
                              {this.state.vessels
                                ? this.state.vessels.map((item) => (
                                    <Option value={item.id} key={item.id}>
                                      {item.name}
                                    </Option>
                                  ))
                                : ""}
                            </Select>
                          )}
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item>
                          {getFieldDecorator(
                            "Port",
                            {}
                          )(
                            <Select
                              showSearch
                              allowClear
                              placeholder="Port"
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
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item>
                          {getFieldDecorator(
                            "User",
                            {}
                          )(
                            <Select
                              showSearch
                              allowClear
                              placeholder="Username"
                              filterOption={(input, option) =>
                                option.props.children
                                  .toLowerCase()
                                  .indexOf(input.toLowerCase()) >= 0
                              }
                            >
                              {this.state.users
                                ? this.state.users.map((item) => (
                                    <Option value={item.id} key={item.id}>
                                      {item.first_name + " " + item.last_name}
                                    </Option>
                                  ))
                                : ""}
                            </Select>
                          )}
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item>
                          {getFieldDecorator(
                            "Company",
                            {}
                          )(
                            <Select
                              showSearch
                              allowClear
                              placeholder="Company"
                              filterOption={(input, option) =>
                                option.props.children
                                  .toLowerCase()
                                  .indexOf(input.toLowerCase()) >= 0
                              }
                            >
                              {this.state.company
                                ? [...this.state.company].map((item) => (
                                    <Option value={item} key={item}>
                                      {item}
                                    </Option>
                                  ))
                                : ""}
                            </Select>
                          )}
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item>
                          {getFieldDecorator(
                            "Foreign",
                            {}
                          )(
                            <Select
                              allowClear
                              placeholder="Foreign Inspector Presence"
                            >
                              <Option value="true" key="1">
                                True
                              </Option>
                              <Option value="false" key="2">
                                False
                              </Option>
                            </Select>
                          )}
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item>
                          {getFieldDecorator(
                            "Ordering",
                            {}
                          )(
                            <Select allowClear placeholder="Order By Date">
                              <Option value="inspection_date" key="1">
                                Ascending
                              </Option>
                              <Option value="-inspection_date" key="2">
                                Descending
                              </Option>
                            </Select>
                          )}
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item>
                          {getFieldDecorator(
                            "Range",
                            {}
                          )(
                            <RangePicker
                              format="YYYY-MM-DD"
                              style={{ width: "100%" }}
                            />
                          )}
                        </Form.Item>
                      </Col>
                      <Col span={24} style={{ textAlign: "right" }}>
                        <Button
                          type="primary"
                          htmlType="submit"
                          id="filter-btn"
                        >
                          Search
                        </Button>
                        <Button onClick={this.clear} id="filter-btn">
                          Clear
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                </Panel>
              </Collapse>
            </Col>
            <Col span={2}>
              <Button
                type="primary"
                onClick={() => window.location.reload()}
                style={{ float: "rigth" }}
              >
                <Icon
                  component={reload}
                  style={{
                    maxWidth: "24px",
                    width: "15px",
                    height: "20px",
                    fill: "#fff",
                  }}
                />
              </Button>
            </Col>
          </div>
          <div id="content">
            <div className="cards">
              <Row style={{ margin: "0 auto", textAlign: "center" }}>
                {this.props.inspections &&
                this.props.inspections.length !== 0 ? (
                  this.props.inspections.map((inspection) => (
                    <Col {...span} key={inspection.id}>
                      <Card value={100} inspection={inspection} />
                    </Col>
                  ))
                ) : (
                  <Empty />
                )}
              </Row>
            </div>
            {this.props.inspections.length > 0 ? (
              <div style={{ marginTop: "50px" }}>
                <Pagination
                  current={this.state.page}
                  onChange={this.onChange}
                  total={this.props.count}
                  pageSize={1}
                />
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  isLoading: state.inspections.isLoading,
  errorMsg: state.inspections.errorMsg,
  inspections: state.inspections.inspections,
  count: state.inspections.count,
});
export default connect(mapStateToProps, { loadInspections })(
  Form.create()(Filter)
);
