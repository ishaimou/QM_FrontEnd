import React, { Component } from "react";
import {
  Upload,
  Button,
  Icon,
  Table,
  Tag,
  Divider,
  notification,
  Spin,
} from "antd";
import { connect } from "react-redux";
import axios from "axios";
import { api } from "../../actions/config";
import { UploadFile } from "../../actions/inspectionDetails";

const getTag = (line) => {
  if (line.incident_ref != null) return <Tag color="red"> INCIDENT</Tag>;
  else if (line.product_ref != null) return <Tag color="green"> PRODUCT</Tag>;
  else if (line.survey_ref != null) return <Tag color="geekblue"> SURVEY</Tag>;
  else if (line.client_ref != null) return <Tag color="purple"> CLIENT</Tag>;
  else if (line.hourlycheck_ref != null)
    return <Tag color="volcano"> HOURLYCHECK</Tag>;
  else return <Tag color="blue"> INSPECTION</Tag>;
};
class Uploads extends Component {
  state = {
    isLoading: false,
    data: [],
    loading: false,
  };
  download = (id) => {
    let link = "#";
    this.state.data.forEach((file) => {
      if (file.id === id) {
        link = file.file;
      }
    });
    let win = window.open(link);
    win.focus();
  };
  delete = async (id) => {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    if (token) {
      this.setState({ loading: true });
      await axios
        .delete(api + `file/${id}`, config)
        .then(() => {
          notification["success"]({
            message: "File Deleted successfully",
            description: "Your File was deleted avec success",
          });
          this.getData();
        })
        .catch((e) => {
          this.setState({ loading: false });
          notification["error"]({
            message: "Something went wrong",
            description: "please Upload the File again!",
          });
        });
    }
  };
  columns = [
    {
      title: "ID",
      dataIndex: "id",
      className: "hide",
    },
    {
      title: "File Name",
      dataIndex: "name",
    },
    {
      title: "Source",
      dataIndex: "Type",
      render: (_, record) => {
        return getTag(record);
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => {
        return (
          <>
            <Button type="danger" ghost onClick={() => this.delete(record.id)}>
              Delete
            </Button>
            <Divider type="vertical" />
            <Button
              type="primary"
              ghost
              onClick={() => this.download(record.id)}
            >
              Download
            </Button>
          </>
        );
      },
    },
  ];
  getData = () => {
    this.setState({ loading: true });
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    if (token) {
      axios
        .get(api + `file/?inspection_ref=${this.props.inspection.id}`, config)
        .then((res) => {
          this.setState({ data: res.data.results });
        });
    }
    this.setState({ loading: false });
  };
  customRequest = ({ file }) => {
    this.setState({ loading: true });
    UploadFile(file, this.props.inspection.id).then(() => {
      this.setState({ loading: false });
      this.getData();
    });
  };
  componentDidMount() {
    this.getData();
  }

  render() {
    return (
      <>
        <Upload
          customRequest={this.customRequest}
          multiple={true}
          fileList={[]}
        >
          <Button
            id="table-btn"
            style={{
              display:
                this.state.loading ||
                this.props.inspection.inspection_status === "CLOSED"
                  ? "none"
                  : "block",
            }}
          >
            <Icon type="upload" /> Upload
          </Button>
        </Upload>
        {this.state.loading ? (
          <div id="upload-spin">
            <Spin size="large" id="spin" />
          </div>
        ) : (
          <Table
            pagination={{ pageSize: 5 }}
            columns={this.columns}
            dataSource={this.state.data}
            size="small"
            bordered
          />
        )}
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  inspection: state.inspectionDetails.inspection,
});

export default connect(mapStateToProps)(Uploads);
