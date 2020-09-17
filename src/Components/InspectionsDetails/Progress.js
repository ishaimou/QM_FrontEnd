import React, { Component } from "react";
import { connect } from "react-redux";
import { api } from "../../actions/config";
import axios from "axios";
import moment from "moment";
import { Popover } from "antd";
import Time from "../../services/Time";
class Progress extends Component {
  _iS_MOUNTED = false;
  state = {
    incident: [],
    bars: null,
    one: true,
    future: null,
  };
  getIncident = () => {
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
            `incidentdetails/?inspection_ref=${this.props.inspection.id}&ordering=stopping_hour`,
          config
        )
        .then((res) => {
          if (this._iS_MOUNTED) this.setState({ incident: res.data.results });
          this.createProgressBar();
        });
    }
  };

  createProgressBar() {
    if (this.props.inspection) {
      let incident = 0,
        bars = [],
        halt = 0,
        progress = 0,
        weather = 0,
        stop = 0,
        resume = 0,
        before = {},
        after = {};
      let left = moment(this.props.inspection.inspection_date);
      let end = moment(this.props.inspection.inspection_date_end).isValid()
        ? moment(this.props.inspection.inspection_date_end)
        : moment();
      let future = moment(this.props.inspection.inspection_date_end).isValid()
        ? moment(this.props.inspection.inspection_date_end)
        : moment().add(1, "day");
      let length = end.diff(left, "seconds");
      let percent = moment(this.props.inspection.inspection_date_end).isValid()
        ? 100
        : (length * 100) / future.diff(left, "seconds"); // get active part of progress
      this.setState({ future: future });
      this.state.incident.forEach((item) => {
        stop = moment(item.stopping_hour);
        resume = moment(item.resuming_hour);
        before = {};
        after = {};
        if (stop.diff(left, "seconds") > 0) {
          before = {
            width: Math.max(
              (stop.diff(left, "seconds") * percent) / length,
              0.8
            ),
            color: "green",
            start: left,
            end: stop,
            item: null,
          };
          progress += stop.diff(left, "seconds");
          bars.push(before);
          left = stop;
        }
        if (resume.isValid()) {
          if (resume.diff(stop, "seconds") > 0) {
            after = {
              width: Math.max(
                (resume.diff(stop, "seconds") * percent) / length,
                0.8
              ),
              color:
                item.halt_or_incident === "Halt"
                  ? item.related === "HALT"
                    ? "orange"
                    : "black"
                  : "red",
              start: stop,
              end: resume,
              item: item,
            };
            if (item.halt_or_incident === "Halt") {
              if (item.related === "HALT") halt += resume.diff(stop, "seconds");
              else weather += resume.diff(stop, "seconds");
            } else incident += resume.diff(stop, "seconds");
            bars.push(after);
            left = resume;
          }
        } else {
          let sum = 0;
          bars.forEach((item) => {
            sum += item.width;
          });
          bars.push({
            width: Math.max(percent - sum, 0.8),
            color:
              item.halt_or_incident === "Halt"
                ? item.related === "HALT"
                  ? "aniorange"
                  : "aniblack"
                : "anired",
            start: left,
            end: end,
            item: item,
          });
          if (item.halt_or_incident === "Halt") {
            if (item.related === "HALT") {
              halt += end.diff(stop, "seconds");
            } else weather += end.diff(stop, "seconds");
          } else incident += end.diff(left, "seconds");
          left = end;
        }
      });

      if (end.diff(left, "seconds") > 0) {
        let sum = 0;
        bars.forEach((item) => {
          sum += item.width;
        });
        let last = {
          width: Math.max(percent - sum, 0.8),
          color:
            this.props.inspection.inspection_status === "INPROGRESS"
              ? "animated"
              : "green",
          start: left,
          end: end,
          item: null,
        };
        progress += end.diff(left, "seconds");
        bars.push(last);
        left = end;
      }
      this.props.Total(incident, halt, progress, weather);
      this.setState({ bars: bars });
    }
  }
  componentDidMount() {
    this._iS_MOUNTED = true;
    this.getIncident();
    this.interval = setInterval(() => this.createProgressBar(), 1000);
  }
  componentWillUnmount() {
    this._iS_MOUNTED = false;
    clearInterval(this.interval);
  }
  getClassName = (Name) => {
    return Name === "green"
      ? "bg-success"
      : Name === "red"
      ? "bg-danger"
      : Name === "orange"
      ? "bg-warning"
      : Name === "black"
      ? "bg-dark"
      : Name === "anired"
      ? "bg-danger  progress-bar-striped progress-bar-animated"
      : Name === "aniorange"
      ? "bg-warning  progress-bar-striped progress-bar-animated"
      : Name === "aniblack"
      ? "bg-dark  progress-bar-striped progress-bar-animated"
      : "bg-success  progress-bar-striped progress-bar-animated";
  };
  render() {
    return (
      <div className="progress" id="progress" style={{ margin: "80px 0" }}>
        <span id="start-tooltip">
          {" "}
          {this.props.inspection
            ? moment(this.props.inspection.inspection_date).format(
                "YYYY-MM-DD HH:mm"
              )
            : ""}
        </span>
        {this.state.bars
          ? this.state.bars.map((item, index) => {
              return (
                <Popover
                  key={index}
                  trigger="click"
                  placement="bottom"
                  content={
                    <div>
                      <p>Start: {item.start.format("YYYY-MM-DD HH:mm")}</p>
                      <p>End: {item.end.format("YYYY-MM-DD HH:mm")}</p>
                      <p>
                        Event:{" "}
                        {item.item
                          ? item.item.halt_or_incident === "Halt"
                            ? item.item.halt.halt_event
                            : item.item.incident
                            ? item.item.incident.incident_event
                            : "Good"
                          : "Good"}
                      </p>
                      <p>
                        Period:{" "}
                        {Time.getTime(item.end.diff(item.start, "seconds"))}
                      </p>
                    </div>
                  }
                >
                  <div
                    key={index}
                    className={`progress-bar ${this.getClassName(item.color)}`}
                    role="progressbar"
                    style={{ width: `${item.width}%` }}
                    aria-valuenow={item.width}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  ></div>
                </Popover>
              );
            })
          : ""}
        <span id="end-tooltip">
          {" "}
          {this.props.inspection
            ? moment(this.state.future).format("YYYY-MM-DD HH:mm")
            : ""}
        </span>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  inspection: state.inspectionDetails.inspection,
});

export default connect(mapStateToProps)(Progress);
