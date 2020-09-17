import axios from "axios";
import { api } from "./config";
import { LOADINSPECTIONS, ISLOADING, CREATION_FAILED } from "./types";
import moment from "moment";

export const loadInspections = (form, page) => dispatch => {
  dispatch({ type: ISLOADING });
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  };
  // Headers
  if (token && form) {
    let status = "";
    let filter = "";
    if (form["Status"] && form["Status"].length > 0) {
      form["Status"].forEach(item => {
        status += item + ",";
      });
      filter += "inspection_status=" + status + "&";
    }
    if (form["Port"])
      filter += "loading_ref__loading_port=" + form["Port"] + "&";
    if (form["Vessel"]) filter += "vessel_ref=" + form["Vessel"] + "&";
    if (form["User"]) filter += "user_ref=" + form["User"] + "&";
    if (form["Foreign"]) filter += "foreign_inspector=" + form["Foreign"] + "&";
    if (form["Company"])
      filter += "user_ref__profile__company_name=" + form["Company"] + "&";
    if (form["Ordering"]) filter += "ordering=" + form["Ordering"] + "&";
    if (form["Range"] && form["Range"].length > 0)
      filter +=
        "date_start=" +
        moment(form["Range"][0]).format("YYYY-MM-DD") +
        "&date_end=" +
        moment(form["Range"][1]).format("YYYY-MM-DD") +
        "&";
    if (filter === "")
      filter = "inspection_status=INPROGRESS,ONHOLD,CLOSED&page=" + page;
    axios
      .get(api + `list/inspection/?${filter}`, config)
      .then(res => {
        var inspections = [];
        res.data.results.forEach(inspection => {
          let payload = {};
          payload.id = inspection["id"];
          payload.dock = inspection["dock"];
          payload.user = inspection["user"];
          payload.vessel = inspection["vessel"];
          payload.port = inspection["port"];
          payload.docks = inspection["docks"];
          payload.vessel_status = inspection["vessel_status"];
          payload.status = inspection["inspection_status"];
          payload.date = moment(inspection["inspection_date"]);
          payload.end = moment(inspection["inspection_date_end"]);
          payload.vessel_arrived = moment(inspection["vessel_arrived"]).format(
            "YYYY/MM/DD HH:mm"
          );
          payload.vessel_berthed = moment(inspection["vessel_breathed"]).format(
            "YYYY/MM/DD HH:mm"
          );
          payload.delay = moment().diff(payload.date, "hours");
          inspections.push(payload);
        });
        dispatch({
          type: LOADINSPECTIONS,
          payload: { inspections: inspections, count: res.data.count }
        });
      })
      .catch(e => {
        console.log(e);
        dispatch({ type: CREATION_FAILED, payload: e.response });
      });
  } else dispatch({ type: CREATION_FAILED });
};
