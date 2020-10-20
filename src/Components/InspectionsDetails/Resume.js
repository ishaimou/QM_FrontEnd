import React, { Component } from "react";
import { Button, Modal, Row, Col, Form, Spin, Upload, Icon, Input } from "antd";
import { api } from "../../actions/config";
import axios from "axios";
import { connect } from "react-redux";
import moment from "moment";
import Contamination from "./Incident/ContaminationParUnAutreProduit";
import { ResumeIncident } from "../../actions/inspectionDetails";
import Motte from "./Incident/PresenceDeMottes";
import PresenceDeCorpEtranger from "./Incident/PresenceDeCorpEtranger";
import TemperatureDuProduitElevee from "./Incident/TemperatureDuProduitElevee";
import ProduiNonFreeFlowing from "./Incident/ProduiNonFreeFlowing";
import CouleurDuProduit from "./Incident/CouleurDuProduit";
import HumiditeElevee from "./Incident/HumiditeElevee";
import TauxDePoussiereEleve from "./Incident/TauxDePoussiereEleve";
import ArretOCP from "./Halt/ArretOCP";
import ArretParNavire from "./Halt/ArretParNavire";
import AttenteOCPChargement from "./Halt/AttenteOCPChargement";
import DraughtSurvey from "./Halt/DraughtSurvey";
import MauvaisTemps from "./Halt/MauvaisTemps";
class Resume extends Component {
  _isMounted = false;
  state = {
    visible: false,
    incident: {},
    isLoading: false,
    filelist: [],
  };
  getCombo = () => {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    if (token && this.props.inspection) {
      axios
        .get(
          api +
            `incidentdetails/?inspection_ref=${this.props.inspection.id}&ordering=-stopping_hour`,
          config
        )
        .then((res) => {
          res.data.results.forEach((item) => {
            if (!moment(item.resuming_hour).isValid()) {
              this.setState({ incident: item });
            }
          });
        })
        .catch((e) => console.log(e.response));
    }
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (this.state.incident) {
          this.setState({ isLoading: true, filelist: [] });
          ResumeIncident(
            values,
            this.state.incident.id,
            this.state.incident.inspection_ref,
            this.state.incident.halt_or_incident
          ).then(() => {
            this.setState({ isLoading: false });
            this.Close();
            setInterval(() => window.location.reload(), 2000);
          });
        }
      }
    });
  };
  componentDidMount() {
    this.getCombo();
  }
  Close = () => {
    this.setState({ visible: false });
    this._isMounted = false;
  };
  show = () => {
    this.setState({ visible: true });
    this._isMounted = true;
    this.getForm();
  };
  getForm = () => {
    if (this.state.incident && this._isMounted) {
      if (this.state.incident.halt_or_incident === "Incident") {
        switch (this.state.incident.incident.incident_event) {
          case "Taux de poussière élevé":
            return (
              <TauxDePoussiereEleve
                getFieldDecorator={this.props.form.getFieldDecorator}
              />
            );
          case "Couleur du produit":
            return (
              <CouleurDuProduit
                getFieldDecorator={this.props.form.getFieldDecorator}
              />
            );
          case "Non-Free flowing":
            return (
              <ProduiNonFreeFlowing
                getFieldDecorator={this.props.form.getFieldDecorator}
              />
            );
          case "Humidity":
            return (
              <HumiditeElevee
                getFieldDecorator={this.props.form.getFieldDecorator}
              />
            );
          case "Temperature":
            return (
              <TemperatureDuProduitElevee
                getFieldDecorator={this.props.form.getFieldDecorator}
              />
            );
          case "Contamination":
            return (
              <Contamination
                getFieldDecorator={this.props.form.getFieldDecorator}
              />
            );
          case "Motte":
            return (
              <Motte getFieldDecorator={this.props.form.getFieldDecorator} />
            );
          case "Débris de Caoutchouc / Corps étranger":
            return (
              <PresenceDeCorpEtranger
                getFieldDecorator={this.props.form.getFieldDecorator}
              />
            );
          default:
            return "unknown";
        }
      } else if (this.state.incident.halt_or_incident === "Halt") {
        switch (this.state.incident.halt.halt_event) {
          case "Arrêt OCP pour Intermediat Draft Survey":
            return (
              <DraughtSurvey
                getFieldDecorator={this.props.form.getFieldDecorator}
              />
            );
          case "Arrêt OCP":
            return (
              <ArretOCP getFieldDecorator={this.props.form.getFieldDecorator} />
            );
          case "Arrêt causé par NAVIRE":
            return (
              <ArretParNavire
                getFieldDecorator={this.props.form.getFieldDecorator}
              />
            );
          case "Attente OCP pour début chargement":
            return (
              <AttenteOCPChargement
                getFieldDecorator={this.props.form.getFieldDecorator}
              />
            );
          case "Pluie":
          case "Mauvais temps":
            return (
              <MauvaisTemps
                getFieldDecorator={this.props.form.getFieldDecorator}
              />
            );
          default:
            return "unknown";
        }
      }
    }
  };
  customRequest = ({ onSuccess }) => {
    setTimeout(() => {
      onSuccess("ok");
    }, 0);
  };
  onFileChange = ({ fileList }) => {
    if (this._isMounted) this.setState({ filelist: fileList });
  };
  render() {
    return (
      <React.Fragment>
        <Button type="danger" id="stat" onClick={this.show}>
          Resume
        </Button>
        <Modal
          visible={this.state.visible}
          title={null}
          okText="Create"
          onCancel={this.Close}
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
                {this.getForm()}
                <Col span={24}>
                  <Form.Item label="Upload">
                    {this.props.form.getFieldDecorator("Upload")(
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
                    {this.props.form.getFieldDecorator("Description")(
                      <Input.TextArea />
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
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  inspection: state.inspectionDetails.inspection,
});
export default connect(mapStateToProps)(Form.create()(Resume));
