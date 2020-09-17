import React, { Component } from "react";
import { Row, Button, Col, Empty, Spin, Icon, Pagination } from "antd";
import "./MyContent.css";
import NewInspection from "../NewInspection/NewInspection";
import { connect } from "react-redux";
import { CreateNew } from "../../actions/newIncpection";
import Card from "../Cards/Cards";
import { loadInspections } from "../../actions/newIncpection";
import reload from "../icons/reload";

const span = {
  xs: 24,
  sm: 24,
  md: 12,
  lg: 8,
  xl: 8,
  xxl: 6
};
class MyContent extends Component {
  state = { visible: false, productid: null, page: 1 };

  showModal = () => {
    this.setState({
      visible: true
    });
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };

  handleCreate = () => {
    const { form } = this.formRef.props;
    form.validateFields((err, values) => {
      if (!err) {
        form.resetFields();
        values["Product Name"] = this.state.productid;
        this.props.CreateNew(values);
        this.setState({ visible: this.props.isLoading ? true : false });
      }
    });
  };
  setProductId(id) {
    this.setState({ productid: id });
  }
  saveFormRef = formRef => {
    this.formRef = formRef;
  };
  componentDidMount() {
    this.props.loadInspections(this.state.page);
  }
  onChange = page => {
    this.setState({ page: page });
    this.props.loadInspections(page);
  };
  render() {
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
            <Row className="new-btn">
              <Button type="primary" icon="plus" onClick={this.showModal}>
                New Inspection
              </Button>
              <Button onClick={() => window.location.reload()}>
                <Icon
                  component={reload}
                  style={{
                    maxWidth: "24px",
                    width: "15px",
                    height: "20px",
                    fill: "#1890ff"
                  }}
                />
              </Button>
            </Row>
          </div>
          <NewInspection
            wrappedComponentRef={this.saveFormRef}
            visible={this.state.visible}
            onCancel={this.handleCancel}
            onCreate={this.handleCreate}
            isLoading={this.props.isLoading}
            setProductId={this.setProductId.bind(this)}
          />
          <div id="content">
            <div className="cards">
              <Row style={{ margin: "0 auto", textAlign: "center" }}>
                {this.props.inspections &&
                this.props.inspections.length !== 0 ? (
                  this.props.inspections.map(inspection => (
                    <Col {...span} key={inspection.id}>
                      <Card value={100} inspection={inspection} />
                    </Col>
                  ))
                ) : (
                  <Empty />
                )}
              </Row>
            </div>
            {this.props.inspections && this.props.inspections.length > 0 ? (
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

const mapStateToProps = state => ({
  isLoading: state.inspections.isLoading,
  errorMsg: state.inspections.errorMsg,
  inspections: state.inspections.inspections,
  count: state.inspections.count
});
export default connect(mapStateToProps, { CreateNew, loadInspections })(
  MyContent
);
