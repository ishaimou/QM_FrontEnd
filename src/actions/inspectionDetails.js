import axios from "axios";
import { api } from "./config";
import { ISLOADING, LOADINSPECTION, LOADINGFAILED, CLEARERROR } from "./types";
import { notification } from "antd";
export const LoadInspection = id => dispatch => {
  dispatch({ type: ISLOADING });
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  };
  if (token) {
    axios
      .get(api + `list/inspection/${id}`, config)
      .then(res => {
        let payload = {};
        payload.docks = res.data.docks;
        payload.foreign_inspector = res.data.foreign_inspector;
        payload.holds_filled = res.data.holds_filled;
        payload.id = res.data.id;
        payload.inspection_date = new Date(
          res.data.inspection_date
        ).toUTCString();
        payload.inspection_status = res.data.inspection_status;
        payload.port = res.data.port;
        payload.user = res.data.user;
        payload.clients = res.data.clients;
        payload.vessel = res.data.vessel;
        payload.inspection_date_end = res.data.inspection_date_end;
        payload.vessel_arrived = new Date(
          res.data.vessel_arrived
        ).toUTCString();
        payload.vessel_berthed = new Date(
          res.data.vessel_breathed
        ).toUTCString();
        payload.vessel_status = res.data.vessel_status;
        dispatch({ type: LOADINSPECTION, payload: payload });
      })
      .catch(e => {
        dispatch({ type: LOADINGFAILED, payload: "error" });
      });
  }
};

export const clearError = () => dispatch => {
  dispatch({ type: CLEARERROR });
};

const toFormData = (form, id) => {
  let data = new FormData();
  let upload = form.Upload;
  const newDate = new Date(form["Date"]);

  data.append("inspection_ref", id);
  data.append("temperature", form["Cargo_temp"]);
  data.append("humidity", form["Relative Humidity"]);
  data.append("debit", form["Debit"]);
  data.append("ambient_temperature", form["Ambient Temperature"]);
  data.append("date", newDate.toISOString());
  data.append("origin", form["Origine Marchandise"]);

  if (upload && upload.fileList) {
    upload.fileList.forEach(f => {
      data.append("file", f.originFileObj);
    });
  }
  return data;
};
export const HourlyCheck = (form, id) => {
  return async dispatch => {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    };

    if (token) {
      await axios
        .post(api + "hourlycheck/", toFormData(form, id), config)
        .then(() => {
          notification["success"]({
            message: "Survey Added",
            description: "Your Survey was added avec success"
          });
        })
        .catch(e => {
          notification["error"]({
            message: "Something went wrong",
            description: "Your Survey was not added!"
          });
        });
    } else {
      window.location.reload();
    }
  };
};

export const EditLoading = (form, id) => () => {
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  };
  const body = JSON.stringify({
    id: 1,
    nor_tendered_date: form["NOR"],
    loading_order_date: form["Ordre de Chargement"],
    loading_starting_date: form["Commenced loading"],
    loading_end_date: form["Completed loading"],
    cargo_condition: form["Conditions of Cargo"],
    uld_test_date: form["Uld test"]
  });
  if (token) {
    axios
      .patch(api + `loading/${id}/`, body, config)
      .then(() => {
        console.log("edited");
      })
      .catch(e => console.log(e.response));
  }
};

export const AddSurvey = async (form, id) => {
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  };
  let data = new FormData();
  let upload = form.Upload;
  const Initial = new Date(form["Initial"]);
  const Final = new Date(form["Final"]);

  data.append("start_inter_draugth_surv", Initial.toISOString());
  data.append("end_inter_draugth_surv", Final.toISOString());
  data.append("loading_ref", id);
  if (upload && upload.fileList) {
    upload.fileList.forEach(f => {
      data.append("file", f.originFileObj);
    });
  }
  if (token) {
    await axios
      .post(api + `inter/`, data, config)
      .then(() => {
        notification["success"]({
          message: "Draught Survey Added",
          description: "Your Draught Survey was added avec success"
        });
      })
      .catch(e => {
        notification["error"]({
          message: "Something went wrong",
          description: "Your Draught Survey was not added!"
        });
      });
  }
};
export const AddProduct = async (form, id) => {
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  };
  let data = new FormData();
  let upload = form.Upload;

  data.append("loading_id", id);
  data.append("Name", form["Product Name"]);
  data.append("origin", form["Origine"]);
  if (upload && upload.fileList) {
    upload.fileList.forEach(f => {
      data.append("file", f.originFileObj);
    });
  }
  if (token) {
    await axios
      .post(api + `createproduct/`, data, config)
      .then(() => {
        notification["success"]({
          message: "Product Added",
          description: "Your Product was added avec success"
        });
      })
      .catch(e => {
        notification["error"]({
          message: "Something went wrong",
          description: e.response.data
            ? e.response.data.msg
            : "please Add the Product again!"
        });
      });
  }
};
export const AddClient = async (form, id) => {
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  };
  let data = new FormData();
  let upload = form.Upload;

  data.append("loading_id", id);
  data.append("client_id", form["Client"]);
  if (upload && upload.fileList) {
    upload.fileList.forEach(f => {
      data.append("file", f.originFileObj);
    });
  }
  if (token) {
    await axios
      .post(api + `clientinsert/`, data, config)
      .then(() => {
        notification["success"]({
          message: "Client Added",
          description: "Your Client was added avec success"
        });
      })
      .catch(() => {
        notification["error"]({
          message: "Something went wrong",
          description: "please Add the Client again!"
        });
      });
  }
};
export const CreateIncident = async (form, id) => {
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  };
  let data = new FormData();
  let upload = form.Upload;
  const newDate = new Date(form["Date"]);

  data.append("stopping_hour", newDate.toISOString());
  data.append("description", form["Description"]);
  if (form["Type"] === "Halt") {
    data.append("inspection_ref", id);
    data.append("halt_ref", form["Name"]);
    data.append("incident_spec_ref", null);
    data.append("halt_or_incident", "Halt");
  } else {
    data.append("inspection_ref", id);
    data.append("halt_ref", null);
    data.append("incident_spec_ref", form["Name"]);
    data.append("halt_or_incident", "Incident");
  }
  if (upload && upload.fileList) {
    upload.fileList.forEach(f => {
      data.append("file", f.originFileObj);
    });
  }
  if (token) {
    await axios
      .post(api + `list/incident/`, data, config)
      .then(() => {
        notification["success"]({
          message: "Inspection Stopped",
          description: "Inspection was stopped avec success"
        });
      })
      .catch(e => {
        console.log(e.response);
        notification["error"]({
          message: "Something went wrong",
          description: "please Stop the Inspection again!"
        });
      });
  }
};
export const ResumeIncident = async (form, id, inspect_id, type) => {
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  };
  let data = new FormData();
  let upload = form.Upload;
  const newDate = new Date();

  data.append("id", id);
  data.append("inspection_ref", inspect_id);
  data.append("resuming_hour", newDate.toISOString());
  data.append("qte_by_kgs", form["Quantite"]);
  data.append("temperature", form["Temperatue"]);
  data.append("possible_cause", form["Cause"]);
  data.append("humidity_rate", form["Humidity"]);
  data.append("description", form["Description"]);
  if (upload && upload.fileList) {
    upload.fileList.forEach(f => {
      data.append("file", f.originFileObj);
    });
  }
  if (token) {
    await axios
      .patch(api + `list/incident/`, data, config)
      .then(() => {
        notification["success"]({
          message: "Inspection Resumed",
          description: "Inspection was Resumed avec success"
        });
      })
      .catch(e => {
        console.log(e.response);
        notification["error"]({
          message: "Something went wrong",
          description: "please Resume the Inspection again!"
        });
      });
  }
};

export const UploadFile = async (file, id) => {
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  };
  let data = new FormData();
  data.append("inspection_ref", id);
  data.append("file", file);
  if (token) {
    await axios
      .post(api + `file/`, data, config)
      .then(() => {
        notification["success"]({
          message: "File Uploaded successfully",
          description: "Your File was uploaded avec success"
        });
      })
      .catch(e => {
        console.log(e.response);
        notification["error"]({
          message: "Something went wrong",
          description: "please Upload the File again!"
        });
      });
  }
};
