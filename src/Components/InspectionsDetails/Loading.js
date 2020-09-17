import React, { Component } from "react";
import {
  Form,
  Col,
  Descriptions,
  Button,
  Icon,
  Modal,
  Row,
  DatePicker,
  TimePicker,
  Select,
  Input
} from "antd";
import { connect } from "react-redux";
import { EditLoading } from "../../actions/inspectionDetails";
import moment from "moment";

const columns = {
  xxl: 4,
  xl: 3,
  lg: 3,
  md: 3,
  sm: 2,
  xs: 1
};
const InputGroup = Input.Group;
const { Option } = Select;

class Loading extends Component {
  state = {
    visible: false
  };
  showModal = () => {
    this.setState({ visible: true });
  };
  closeModal = () => {
    this.setState({ visible: false });
  };
  form = Form.create({ name: "edit" })(
    class extends Component {
      handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
          if (!err) {
            this.props.EditLoading(values, this.props.inspection.port.id);
            this.props.close();
            setInterval(() => window.location.reload(), 1000);
          }
        });
      };
      render() {
        const { form } = this.props;
        const { getFieldDecorator } = form;
        return (
          <Row gutter={10}>
            <Form layout="vertical" onSubmit={this.handleSubmit}>
              <Col span={24}>
                <Form.Item label="N.O.R. tendered" className="edit-input">
                  <InputGroup compact>
                    {getFieldDecorator("NOR")(
                      <DatePicker
                        style={{ width: "65%" }}
                        placeholder="N.O.R. tendered"
                        suffixIcon={false}
                      />
                    )}
                    {getFieldDecorator("NOR")(
                      <TimePicker style={{ width: "35%" }} format="HH:mm" />
                    )}
                  </InputGroup>
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label="Loading Order" className="edit-input">
                  <InputGroup compact>
                    {getFieldDecorator("Ordre de Chargement")(
                      <DatePicker
                        style={{ width: "65%" }}
                        placeholder="Ordre de Chargement"
                        suffixIcon={false}
                      />
                    )}
                    {getFieldDecorator("Ordre de Chargement")(
                      <TimePicker style={{ width: "35%" }} format="HH:mm" />
                    )}
                  </InputGroup>
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label="Loading Start" className="edit-input">
                  <InputGroup compact>
                    {getFieldDecorator("Commenced loading")(
                      <DatePicker
                        style={{ width: "65%" }}
                        placeholder="Loading Start"
                        suffixIcon={false}
                      />
                    )}
                    {getFieldDecorator("Commenced loading")(
                      <TimePicker style={{ width: "35%" }} format="HH:mm" />
                    )}
                  </InputGroup>
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label="Completed loading" className="edit-input">
                  <InputGroup compact>
                    {getFieldDecorator("Completed loading")(
                      <DatePicker
                        style={{ width: "65%" }}
                        placeholder="Completed loading"
                        suffixIcon={false}
                      />
                    )}
                    {getFieldDecorator("Completed loading")(
                      <TimePicker style={{ width: "35%" }} format="HH:mm" />
                    )}
                  </InputGroup>
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label="Uld test" className="edit-input">
                  <InputGroup compact>
                    {getFieldDecorator("Uld test")(
                      <DatePicker
                        style={{ width: "65%" }}
                        placeholder="Uld test"
                        suffixIcon={false}
                      />
                    )}
                    {getFieldDecorator("Uld test")(
                      <TimePicker style={{ width: "35%" }} format="HH:mm" />
                    )}
                  </InputGroup>
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label="Cargo Conditions" className="edit-input">
                  {getFieldDecorator("Conditions of Cargo")(
                    <Select showSearch placeholder="Cargo Conditions">
                      <Option value="GOOD">Good</Option>
                      <Option value="BAD">Bad</Option>
                    </Select>
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
            />
          }
        </Modal>
        {this.props.inspection &&
        this.props.inspection.inspection_status !== "CLOSED" ? (
          <Col sm={24} md={12} lg={6}>
            <Button htmlType="submit" id="table-btn" onClick={this.showModal}>
              <Icon type="edit" /> Edit
            </Button>
          </Col>
        ) : (
          ""
        )}
        <Col span={24}>
          <Descriptions bordered style={{ width: "100%" }}>
            <Descriptions.Item label="N.O.R. tendered" {...columns}>
              {this.props.inspection
                ? this.props.inspection.port
                  ? moment(this.props.inspection.port.nor_tendered_date).format(
                      "YYYY-MM-DD HH:mm"
                    )
                  : ""
                : ""}
            </Descriptions.Item>
            <Descriptions.Item label="Loading Order" {...columns}>
              {this.props.inspection
                ? this.props.inspection.port
                  ? moment(
                      this.props.inspection.port.loading_order_date
                    ).format("YYYY-MM-DD HH:mm")
                  : ""
                : ""}
            </Descriptions.Item>
            <Descriptions.Item label="Loading Start" {...columns}>
              {this.props.inspection
                ? this.props.inspection.port
                  ? moment(
                      this.props.inspection.port.loading_starting_date
                    ).format("YYYY-MM-DD HH:mm")
                  : ""
                : ""}
            </Descriptions.Item>
            <Descriptions.Item label="Completed loading" {...columns}>
              {this.props.inspection
                ? this.props.inspection.port
                  ? moment(this.props.inspection.port.loading_end_date).format(
                      "YYYY-MM-DD HH:mm"
                    )
                  : ""
                : ""}
            </Descriptions.Item>
            <Descriptions.Item label="Cargo Conditions" {...columns}>
              {this.props.inspection
                ? this.props.inspection.port
                  ? moment(this.props.inspection.port.cargo_condition).format(
                      "YYYY-MM-DD HH:mm"
                    )
                  : ""
                : ""}
            </Descriptions.Item>
            <Descriptions.Item label="Cargo Temperature" {...columns}>
              {this.props.inspection
                ? this.props.inspection.port
                  ? this.props.inspection.port.air_temperature
                  : ""
                : ""}
            </Descriptions.Item>
            <Descriptions.Item label="Humidity" {...columns}>
              {this.props.inspection
                ? this.props.inspection.port
                  ? this.props.inspection.port.humidity_percentage
                  : ""
                : ""}
            </Descriptions.Item>
            <Descriptions.Item label="Initial" {...columns}>
              {this.props.inspection
                ? this.props.inspection.port
                  ? moment(
                      this.props.inspection.port.initial_draugth_surv
                    ).format("YYYY-MM-DD HH:mm")
                  : ""
                : ""}
            </Descriptions.Item>
            <Descriptions.Item label="Final" {...columns}>
              {this.props.inspection
                ? this.props.inspection.port
                  ? moment(
                      this.props.inspection.port.final_draugth_surv
                    ).format("YYYY-MM-DD HH:mm")
                  : ""
                : ""}
            </Descriptions.Item>
            <Descriptions.Item label="Uld test" {...columns}>
              {this.props.inspection
                ? this.props.inspection.port
                  ? moment(this.props.inspection.port.uld_test_date).format(
                      "YYYY-MM-DD HH:mm"
                    )
                  : ""
                : ""}
            </Descriptions.Item>
            <Descriptions.Item label="Foreign Inspector" {...columns}>
              {this.props.inspection
                ? this.props.inspection.foreign_inspector
                  ? "True"
                  : "False"
                : ""}
            </Descriptions.Item>
          </Descriptions>
        </Col>
      </React.Fragment>
    );
  }
}
const mapStateToProps = state => ({
  inspection: state.inspectionDetails.inspection
});

export default connect(mapStateToProps, { EditLoading })(
  Form.create()(Loading)
);
