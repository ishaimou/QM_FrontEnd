import React, { useState, useEffect } from "react";
import { Cascader, notification } from "antd";
import axios from "axios";
import { api } from "../../actions/config";
import auth from "../../services/Auth";

export default function ProductsCascader(props) {
  const [Products, setProducts] = useState([]);
  function onChange(value) {
    props.setProductId(value["3"]);
  }
  useEffect(() => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth.getToken()}`
      }
    };
    axios
      .get(api + "productree/", config)
      .then(res => {
        setProducts(res.data);
      })
      .catch(e => {
        console.log(e.reponse);
        notification["error"]({
          message: "Connection error"
        });
      });
  }, []);

  return (
    <Cascader
      options={Products}
      onChange={onChange}
      placeholder="Please select"
    />
  );
}
