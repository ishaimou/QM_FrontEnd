import React, { Component } from "react";
import {
  Table,
  Button,
  Icon,
  Modal,
  Select,
  Form,
  Col,
  Row,
  Spin,
  Upload,
} from "antd";
import { connect } from "react-redux";
import axios from "axios";
import { api } from "../../actions/config";
import { AddClient } from "../../actions/inspectionDetails";
const { Option } = Select;
const columns = [
  {
    title: "Clients",
    dataIndex: "Clients",
  },
  {
    title: "Destination",
    dataIndex: "Destination",
  },
];

class Clients extends Component {
  _IS_MOUNTED = false;
  state = {
    visible: false,
    data: [],
    isLoading: false,
  };
  showModal = () => {
    this.setState({ visible: true });
  };
  closeModal = () => {
    this.setState({ visible: false });
  };
  getData = () => {
    let data = [];
    this.props.inspection.clients.forEach((item, index) => {
      if (item.client) {
        let client = {
          key: index,
          Clients: item.client.name,
          Destination: item.client.destination,
        };
        data.push(client);
      }
    });
    if (this._IS_MOUNTED) {
      this.setState({ data: data });
    }
  };
  componentDidMount() {
    this._IS_MOUNTED = true;
    this.getData();
  }
  componentWillUnmount() {
    this._IS_MOUNTED = false;
  }
  form = Form.create({ name: "Add Client" })(
    class extends Component {
      _isMounted = false;
      state = {
        clients: [],
        filelist: [],
      };
      handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
          if (!err) {
            this.setState({ isLoading: true });
            AddClient(values, this.props.inspection.port.id).then(() => {
              this.props.close();
              this.setState({ isLoading: false });
              // setInterval(() => window.location.reload(), 3000);
            });
          }
        });
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
            .get(api + `client/`, config)
            .then((res) => {
              let client = [];
              res.data.results.forEach((item) => {
                client.push(item);
              });
              if (this._isMounted) {
                this.setState({
                  clients: client,
                });
              }
            })
            .catch((e) => console.log(e.response));
        }
      };
      componentWillUnmount() {
        this._isMounted = false;
      }
      UNSAFE_componentWillMount() {
        this._isMounted = true;
        this.getCombo();
      }
      customRequest = ({ onSuccess }) => {
        setTimeout(() => {
          onSuccess("ok");
        }, 0);
      };
      onChange = ({ fileList }) => {
        if (this._isMounted) this.setState({ filelist: fileList });
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
                <Form.Item label="Client">
                  {getFieldDecorator("Client", {
                    initialValue: this.state.clients[0]
                      ? this.state.clients[0].name
                      : "",
                    rules: [
                      {
                        required: true,
                        message: "Required!",
                      },
                    ],
                  })(
                    <Select
                      showSearch
                      filterOption={(input, option) =>
                        option.props.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                      placeholder="Client"
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
              getData={this.getData.bind(this)}
            />
          }
        </Modal>
        {this.props.inspection &&
        this.props.inspection.inspection_status !== "CLOSED" ? (
          <Button id="table-btn" onClick={this.showModal}>
            <Icon type="plus" id="table-icon" />
            Add Client
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

const mapStateToProps = (state) => ({
  inspection: state.inspectionDetails.inspection,
});

export default connect(mapStateToProps)(Clients);
