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
  Upload,
  Icon,
  Spin
} from "antd";
import { api } from "../../actions/config";
import axios from "axios";
import { connect } from "react-redux";
import moment from "moment";
import { CreateIncident } from "../../actions/inspectionDetails";
const { Option } = Select;

class Stop extends Component {
  _isMounted = false;
  state = {
    visible: false,
    Halt: [],
    Incident: [],
    data: [],
    filelist: [],
    isLoading: false
  };
  getCombo = () => {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    };
    if (token) {
      axios
        .get(api + `incident/`, config)
        .then(res => {
          if (this._isMounted) {
            this.setState({ Incident: res.data });
          }
        })
        .catch(e => console.log(e.response));
      axios
        .get(api + `haltevent/`, config)
        .then(res => {
          if (this._isMounted) {
            this.setState({ Halt: res.data });
          }
        })
        .catch(e => console.log(e.response));
    }
  };
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.setState({ isLoading: true, filelist: [] });
        CreateIncident(values, this.props.inspection.id).then(() => {
          this.setState({ isLoading: false });
          this.onCreate();
          setInterval(() => window.location.reload(), 2000);
        });
      }
    });
  };
  customRequest = ({ onSuccess }) => {
    setTimeout(() => {
      onSuccess("ok");
    }, 0);
  };
  onFileChange = ({ fileList }) => {
    if (this._isMounted) this.setState({ filelist: fileList });
  };
  componentDidMount() {
    this._isMounted = true;
    this.getCombo();
  }
  componentWillUnmount() {
    this._isMounted = false;
  }
  onCancel = () => {
    this.setState({ visible: false });
  };
  show = () => {
    this.setState({ visible: true });
  };
  onCreate = () => {
    this.setState({ visible: false });
  };
  onChange = v => {
    if (v === "Halt" && this._isMounted) {
      this.setState({ data: this.state.Halt });
    } else if (v === "Incident" && this._isMounted) {
      this.setState({ data: this.state.Incident });
    }
  };
  disabledDate = current => {
    return (
      current &&
      current < moment(this.props.inspection.inspection_date).endOf("minutes")
    );
  };
  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <React.Fragment>
        <Modal
          visible={this.state.visible}
          title={null}
          okText="Create"
          onCancel={this.onCancel}
          width="35%"
          footer={null}
          closable={false}
        >
          {this.state.isLoading ? (
            <div id="newhourly-spin">
              <Spin size="large" id="spin" />
            </div>
          ) : (
            <Row gutter={10}>
              <Form layout="vertical" onSubmit={this.handleSubmit}>
                <Col span={12}>
                  <Form.Item label="Type">
                    {getFieldDecorator("Type", {
                      rules: [
                        {
                          required: true,
                          message: "Required!"
                        }
                      ]
                    })(
                      <Select
                        showSearch
                        onChange={this.onChange}
                        placeholder="Type of incident"
                        filterOption={(input, option) =>
                          option.props.children
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        <Option value="Halt" key="1">
                          Halt
                        </Option>
                        <Option value="Incident" key="2">
                          Incident
                        </Option>
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Name:">
                    {getFieldDecorator("Name", {
                      rules: [
                        {
                          required: true,
                          message: "Required!"
                        }
                      ]
                    })(
                      <Select
                        showSearch
                        placeholder="Name of Incident"
                        filterOption={(input, option) =>
                          option.props.children
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        {this.state.data
                          ? this.state.data.map(item => (
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
                  <Form.Item label="Stopping Date">
                    {getFieldDecorator("Date", {
                      initialValue: moment(),
                      rules: [
                        {
                          required: true,
                          message: "Please input the Date!"
                        }
                      ]
                    })(<DatePicker disabledDate={this.disabledDate} />)}
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item label="Stopping Hour">
                    {getFieldDecorator("Date", {
                      rules: [
                        {
                          required: true,
                          message: "Please input the Hour!"
                        }
                      ]
                    })(<TimePicker format="HH:mm" />)}
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item label="Upload">
                    {getFieldDecorator(
                      "Upload",
                      {}
                    )(
                      <Upload
                        customRequest={this.customRequest}
                        fileList={this.state.filelist}
                        onChange={this.onFileChange}
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
                  <Form.Item label="Description">
                    {getFieldDecorator("Description")(<Input.TextArea />)}
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
        <Button type="primary" id="stat" onClick={this.show}>
          Stop
        </Button>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  inspection: state.inspectionDetails.inspection
});
export default connect(mapStateToProps)(Form.create()(Stop));
