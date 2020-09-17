import React, { Component } from "react";
import {
  Table,
  Button,
  Icon,
  Modal,
  Form,
  Col,
  Row,
  DatePicker,
  TimePicker,
  Input,
  Upload,
  Spin
} from "antd";
import axios from "axios";
import { api } from "../../actions/config";
import moment from "moment";
import { connect } from "react-redux";
import { AddSurvey } from "../../actions/inspectionDetails";

const InputGroup = Input.Group;
const columns = [
  {
    title: "Initial",
    dataIndex: "Initial"
  },
  {
    title: "Final",
    dataIndex: "Final"
  }
];

class Survey extends Component {
  state = {
    visible: false,
    data: []
  };
  showModal = () => {
    this.setState({ visible: true });
  };
  closeModal = () => {
    this.setState({ visible: false });
  };
  getData = () => {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    };
    if (token) {
      axios
        .get(
          api + `inter/?loading_ref=${this.props.inspection.port.id}`,
          config
        )
        .then(res => {
          let data = [];
          res.data.forEach(item => {
            let survey = {
              key: item.id,
              Initial: moment(item.start_inter_draugth_surv).format(
                "MM/DD/YYYY HH:mm"
              ),
              Final: moment(item.end_inter_draugth_surv).format(
                "MM/DD/YYYY HH:mm"
              )
            };
            data.push(survey);
          });
          this.setState({ data: data });
        })
        .catch(e => console.log(e.response));
    }
  };
  componentDidMount() {
    this.getData();
  }

  form = Form.create({ name: "edit" })(
    class extends Component {
      state = {
        filelist: [],
        isLoading: false
      };
      customRequest = ({ onSuccess }) => {
        setTimeout(() => {
          onSuccess("ok");
        }, 0);
      };
      onFileChange = ({ fileList }) => {
        this.setState({ filelist: fileList });
      };
      handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
          if (!err) {
            this.setState({ isLoading: true, filelist: [] });
            AddSurvey(values, this.props.id).then(() => {
              this.setState({ isLoading: false });
              setInterval(() => this.props.getData(), 2000);
              this.props.close();
            });
          }
        });
      };

      render() {
        const { form } = this.props;
        const { getFieldDecorator } = form;
        return this.state.isLoading ? (
          <div id="newhourly-spin">
            <Spin size="large" id="spin" />
          </div>
        ) : (
          <Row gutter={10}>
            <Form layout="vertical" onSubmit={this.handleSubmit}>
              <Col span={24}>
                <Form.Item label="Initial">
                  <InputGroup compact>
                    {getFieldDecorator("Initial", {
                      initialValue: moment(),
                      rules: [
                        {
                          required: true,
                          message: "Required!"
                        }
                      ]
                    })(
                      <DatePicker
                        style={{ width: "65%" }}
                        placeholder="Initial"
                        suffixIcon={false}
                      />
                    )}
                    {getFieldDecorator("Initial", {
                      rules: [
                        {
                          required: true,
                          message: "Required!"
                        }
                      ]
                    })(<TimePicker style={{ width: "35%" }} format="HH:mm" />)}
                  </InputGroup>
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label="Final">
                  <InputGroup compact>
                    {getFieldDecorator("Final", {
                      rules: [
                        {
                          required: true,
                          message: "Required!"
                        }
                      ]
                    })(
                      <DatePicker
                        style={{ width: "65%" }}
                        placeholder="Final"
                        suffixIcon={false}
                      />
                    )}
                    {getFieldDecorator("Final", {
                      rules: [
                        {
                          required: true,
                          message: "Required!"
                        }
                      ]
                    })(<TimePicker style={{ width: "35%" }} format="HH:mm" />)}
                  </InputGroup>
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label="Upload">
                  {getFieldDecorator("Upload")(
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
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    className="edit-btn"
                  >
                    Save
                  </Button>
                </Form.Item>
              </Col>
            </Form>
          </Row>
        );
      }
    }
  );
  render() {
    return (
      <React.Fragment>
        <Modal
          visible={this.state.visible}
          title={null}
          okText="Create"
          onCancel={this.closeModal}
          footer={null}
        >
          {
            <this.form
              inspection={this.props.inspection}
              EditLoading={this.props.EditLoading}
              close={this.closeModal}
              getData={this.getData}
              id={this.props.inspection.port.id}
            />
          }
        </Modal>
        {this.props.inspection &&
        this.props.inspection.inspection_status !== "CLOSED" ? (
          <Button id="table-btn" onClick={this.showModal}>
            <Icon type="plus" id="table-icon" />
            Add Survey
          </Button>
        ) : (
          ""
        )}
        <Table
          pagination={{ pageSize: 5 }}
          columns={columns}
          dataSource={this.state.data}
          size="middle"
          bordered
        />
      </React.Fragment>
    );
  }
}
const mapStateToProps = state => ({
  inspection: state.inspectionDetails.inspection
});

export default connect(mapStateToProps)(Survey);
