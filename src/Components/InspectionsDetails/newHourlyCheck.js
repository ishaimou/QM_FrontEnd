import React, { Component } from "react";
import {
  Form,
  Input,
  Modal,
  Col,
  Row,
  Button,
  DatePicker,
  TimePicker,
  Select,
  InputNumber,
  Upload,
  Icon,
  Spin,
} from "antd";
import moment from "moment";
import axios from "axios";
import { api } from "../../actions/config";
import { HourlyCheck } from "../../actions/inspectionDetails";
import { connect } from "react-redux";
const { Option } = Select;
class NewHourlyCheck extends Component {
  _isMounted = false;
  state = {
    origin: [],
    filelist: [],
    isLoading: false,
    closable: true,
  };
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.form.resetFields();
        this.setState({ isLoading: true, filelist: [], closable: false });
        this.props.HourlyCheck(values, this.props.id).then((e) => {
          this.setState({ isLoading: false, closable: true });
          this.props.onCancel();
          this.props.update();
        });
      }
    });
  };
  getCombo = () => {
    this._isMounted = true;

    const token = localStorage.getItem("token");
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    if (token) {
      axios
        .get(api + `origin/`, config)
        .then((res) => {
          if (this._isMounted) {
            this.setState({ origin: res.data.results });
          }
        })
        .catch((e) => console.log(e));
    }
  };
  componentWillUnmount() {
    this._isMounted = false;
  }
  componentDidMount() {
    this.getCombo();
  }

  customRequest = ({ onSuccess }) => {
    setTimeout(() => {
      onSuccess("ok");
    }, 0);
  };
  onChange = ({ fileList }) => {
    this.setState({ filelist: fileList });
  };
  render() {
    const { visible, onCancel, form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        visible={visible}
        title={null}
        okText="Create"
        onCancel={onCancel}
        width="35%"
        footer={null}
        closable={false}
        maskClosable={this.state.closable}
      >
        {this.state.isLoading ? (
          <div id="newhourly-spin">
            <Spin size="large" id="spin" />
          </div>
        ) : (
          <Row gutter={10}>
            <Form layout="vertical" onSubmit={this.handleSubmit}>
              <Col span={12}>
                <Form.Item label="Date">
                  {getFieldDecorator("Date", {
                    initialValue: moment(),
                    rules: [
                      {
                        required: true,
                        message: "Please input the Date!",
                      },
                    ],
                  })(<DatePicker style={{ width: "100%" }} />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Hour">
                  {getFieldDecorator("Date", {
                    rules: [
                      {
                        required: true,
                        message: "Please input the Hour!",
                      },
                    ],
                  })(<TimePicker format="HH:mm" style={{ width: "100%" }} />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Cargo Temperature">
                  {getFieldDecorator("Cargo_temp", {
                    rules: [
                      {
                        required: true,
                        message: "Please input the Cargo Temperature!",
                      },
                    ],
                  })(
                    <InputNumber
                      min={-10}
                      max={60}
                      style={{ width: "100%" }}
                      formatter={(value) => `${value}°`}
                      parser={(value) => value.replace("°", "")}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Relative Humidity">
                  {getFieldDecorator("Relative Humidity", {
                    rules: [
                      {
                        required: true,
                        message: "Please input the Relative Humidity!",
                      },
                    ],
                  })(
                    <InputNumber
                      min={0}
                      style={{ width: "100%" }}
                      max={120}
                      formatter={(value) => `${value}%`}
                      parser={(value) => value.replace("%", "")}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Ambient Temperature">
                  {getFieldDecorator("Ambient Temperature", {
                    rules: [
                      {
                        required: true,
                        message: "Please input the Ambient Temperature!",
                      },
                    ],
                  })(
                    <InputNumber
                      min={0}
                      style={{ width: "100%" }}
                      max={120}
                      formatter={(value) => `${value}°`}
                      parser={(value) => value.replace("°", "")}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Commodity Origin">
                  {getFieldDecorator("Origine Marchandise", {
                    rules: [
                      {
                        required: true,
                        message: "Required!",
                      },
                    ],
                  })(
                    <Select
                      showSearch
                      style={{ width: "100%" }}
                      placeholder="Commodity Origin"
                      filterOption={(input, option) =>
                        option.props.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {this.state.origin
                        ? this.state.origin.map((item) => (
                            <Option value={item.id} key={item.id}>
                              {item.name}
                            </Option>
                          ))
                        : ""}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Debit">
                  {getFieldDecorator("Debit", {
                    rules: [
                      {
                        required: true,
                        message: "Please input the Debit (MT/Hr)!",
                      },
                    ],
                  })(<Input placeholder="Debit (MT/Hr)" />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Upload">
                  {getFieldDecorator(
                    "Upload",
                    {}
                  )(
                    <Upload
                      customRequest={this.customRequest}
                      fileList={this.state.filelist}
                      onChange={this.onChange}
                      multiple={true}
                    >
                      {this.state.filelist.length < 8 ? (
                        <Button>
                          <Icon type="upload" /> Upload
                        </Button>
                      ) : (
                        ""
                      )}
                    </Upload>
                  )}
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="login-form-button"
                  >
                    Save
                  </Button>
                </Form.Item>
              </Col>
            </Form>
          </Row>
        )}
      </Modal>
    );
  }
}

export default connect(null, { HourlyCheck })(Form.create()(NewHourlyCheck));
