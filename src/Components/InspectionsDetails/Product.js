import React, { Component } from "react";
import {
  Table,
  Button,
  Icon,
  Modal,
  Form,
  Col,
  Row,
  Select,
  Popover,
  Upload,
  Spin,
  Typography,
  notification,
  InputNumber,
} from "antd";
import { connect } from "react-redux";
import axios from "axios";
import { api } from "../../actions/config";
import { AddProduct } from "../../actions/inspectionDetails";
import ProductCascader from "../ProductsCascader/ProductsCascader";
import auth from "../../services/Auth";
const { Option } = Select;
const { Text } = Typography;

const columns = [
  {
    title: "Id Product",
    dataIndex: "ID",
  },
  {
    title: "Product family",
    dataIndex: "Family",
  },
  {
    title: "Product Category",
    dataIndex: "Category",
  },
  {
    title: "Product name",
    dataIndex: "Name",
  },
  {
    title: "N° Ech",
    dataIndex: "Ech",
  },
  {
    title: "Origine",
    dataIndex: "Origine",
  },
  {
    title: "Status",
    dataIndex: "Status",
  },
];

class Product extends Component {
  state = {
    visible: false,
    data: [],
    isLoading: false,
    origin: null,
    value: null,
    qte: null,
  };
  showModal = () => {
    this.setState({ visible: true });
  };
  closeModal = () => {
    this.setState({ visible: false });
  };
  EditProduct(id) {
    const token = auth.getToken();
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    let edit = (id) => {
      let body = JSON.stringify({
        loading_id: this.props.inspection.port.id,
        product_id: id,
        origin_id: this.state.value,
      });
      axios
        .patch(api + "editproduct/", body, config)
        .then(() => window.location.reload())
        .catch(() => console.log("error"));
    };
    let handleChange = (value) => {
      this.setState({ value: value });
    };
    return (
      <Row>
        <Col span={24}>
          <Select
            style={{ width: "100%" }}
            showSearch
            placeholder="Origine"
            filterOption={(input, option) =>
              option.props.children
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
            }
            onChange={handleChange}
          >
            {this.state.origin
              ? this.state.origin.map((item) => (
                  <Option value={item.id} key={item.id}>
                    {item.name}
                  </Option>
                ))
              : ""}
          </Select>
        </Col>
        <Col span={24}>
          <Button
            onClick={() => edit(id)}
            style={{ width: "100%", margin: "10px 0" }}
            type="primary"
          >
            Save
          </Button>
        </Col>
      </Row>
    );
  }
  saveQte(id) {
    const token = auth.getToken();
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    let loaded = (id) => {
      if (token) {
        let data = JSON.stringify({
          loading_id: this.props.inspection.port.id,
          product_id: id,
          product_status: "LOADED",
          qte: this.state.qte,
        });
        axios
          .patch(api + `editproduct/`, data, config)
          .then(() => {
            notification["success"]({
              message: "Product Loaded",
            });
            setTimeout(() => window.location.reload(), 2000);
          })
          .catch((e) => {
            notification["error"]({
              message: "Something went wrong",
              description: "please Load the Product again!",
            });
          });
      }
    };
    let handleChange = (value) => {
      this.setState({ qte: value });
    };
    return (
      <Row>
        <Col span={24}>
          <InputNumber
            min={1}
            max={1000000}
            onChange={handleChange}
            formatter={(value) => `${value}MT`}
            parser={(value) => value.replace("MT", "")}
          />
        </Col>
        <Col span={24}>
          <Button
            onClick={() => loaded(id)}
            style={{ width: "100%", margin: "10px 0" }}
            type="primary"
          >
            Save
          </Button>
        </Col>
      </Row>
    );
  }
  getData = () => {
    const token = auth.getToken();
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
          this.setState({ origin: res.data.results });
        })
        .then(() => {
          let data = [];
          this.props.inspection.clients.forEach((item, index) => {
            if (item.product) {
              let client = {
                key: index,
                ID: item.product.productcategory.productfamily.productype.name,
                Family: item.product.productcategory.productfamily.name,
                Category: item.product.productcategory.name,
                Name: item.product.name,
                Origine: item.origin ? (
                  item.origin.name
                ) : (
                  <Popover
                    content={this.EditProduct(item.product.id)}
                    title="Edit Origin"
                    trigger="click"
                  >
                    <Button type="primary" ghost>
                      Edit
                    </Button>
                  </Popover>
                ),
                Status: item.loaded ? (
                  <Text style={{ padding: "0 10px", color: "green" }}>
                    Loaded
                  </Text>
                ) : (
                  <>
                    <Text code style={{ padding: "0 10px" }}>
                      Pending
                    </Text>
                    <Popover
                      content={this.saveQte(item.product.id)}
                      title="Quantity Loaded"
                      trigger="click"
                    >
                      <Button type="primary" ghost>
                        is Loaded
                      </Button>
                    </Popover>
                  </>
                ),
              };
              data.push(client);
            }
          });
          this.setState({ data: data });
        })
        .catch((e) => console.log(e.response));
    }
  };

  componentWillMount() {
    this.getData();
  }
  form = Form.create({ name: "edit" })(
    class extends Component {
      _isMounted = false;
      state = {
        origin: [],
        filelist: [],
        productid: null,
      };
      setProductId(id) {
        this.setState({ productid: id });
      }
      getCombo = () => {
        const token = auth.getToken();
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
            .catch((e) => console.log(e.response));
        }
      };
      handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
          if (!err) {
            this.setState({ isLoading: true, filelist: [] });
            values["Product Name"] = this.state.productid;
            AddProduct(values, this.props.inspection.port.id).then(() => {
              this.props.close();
              this.setState({ isLoading: false });
              setInterval(() => window.location.reload(), 2000);
            });
          }
        });
      };
      componentDidMount() {
        this._isMounted = true;
        this.getCombo();
      }
      componentWillUnmount() {
        this._isMounted = false;
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
                <Form.Item label="Product Name">
                  <ProductCascader
                    setProductId={this.setProductId.bind(this)}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Origin">
                  {getFieldDecorator("Origine")(
                    <Select
                      showSearch
                      placeholder="Origin"
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
              getData={this.getData}
            />
          }
        </Modal>
        {this.props.inspection &&
        this.props.inspection.inspection_status !== "CLOSED" ? (
          <Button id="table-btn" onClick={this.showModal}>
            <Icon type="plus" id="table-icon" />
            Add Product
          </Button>
        ) : (
          ""
        )}
        <Table
          bordered
          columns={columns}
          dataSource={this.state.data}
          size="middle"
          pagination={{ pageSize: 5 }}
        />
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  inspection: state.inspectionDetails.inspection,
});

export default connect(mapStateToProps)(Product);
