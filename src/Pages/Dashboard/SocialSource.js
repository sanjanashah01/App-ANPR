import React from "react";
import RadialChart from "./RadialChart";
import { useState, useEffect } from 'react';
import APIMiddleware from "../../helpers/APIMiddleware";

import { Card, CardBody, Col, Row } from "reactstrap";

// import { SocialSourceData } from "../../CommonData/Data/index";

const SocialSource = () => {

  const [orderStatusesCount, setOrderStatusesCount] = useState({});
  
  const fetchOrderStatusesCount = async () => {
    try {
      const response = await APIMiddleware.get(`${process.env.REACT_APP_BASE_URL}/orders/get-order-statuses-count`);
      const data = await response.data;
      setOrderStatusesCount(data);
    } catch (error) {
      console.error(error);
    }
  };
  
  useEffect(() => {
    fetchOrderStatusesCount();
  }, []);
  return (
    <React.Fragment>
      <Col xl={12}>
        <Card>
          <CardBody>
            <div className="d-flex  align-items-center">
              <div className="flex-grow-1">
                <h5 className="card-title">Order Stats</h5>
              </div>
            </div>
            {/* RadialChart */}
            <RadialChart orderStatusesCount = {orderStatusesCount}/>
            <Row>
            {orderStatusesCount && (
                <>
                  <div className="col-4">
                    <div className="social-source text-center mt-3">
                      <h5 className="font-size-15">Accepted</h5>
                      <p className="text-muted mb-0">{orderStatusesCount.approved} orders</p>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="social-source text-center mt-3">
                      <h5 className="font-size-15">Rejected</h5>
                      <p className="text-muted mb-0">{orderStatusesCount.rejected} orders</p>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="social-source text-center mt-3">
                      <h5 className="font-size-15">Pending</h5>
                      <p className="text-muted mb-0">{orderStatusesCount.pending} orders</p>
                    </div>
                  </div>
                </>
              )}
              {/* {SocialSourceData.map((item, key) => (
                <div key={key} className="col-4">
                  <div className="social-source text-center mt-3">
                    <div className="avatar-xs mx-auto mb-3">
                      <span
                        className={
                          "avatar-title rounded-circle font-size-18 bg-" +
                          item.bgcolor
                        }
                      >
                        <i className={item.icon + " text-white"}></i>
                      </span>
                    </div>
                    <h5 className="font-size-15">{item.title}</h5>
                    <p className="text-muted mb-0">{item.count} sales</p>
                  </div>
                </div>
              ))} */}
            </Row>
          </CardBody>
        </Card>
      </Col>
    </React.Fragment>
  );
};

export default SocialSource;
