import React from "react";
import { Card, CardBody, Col, Row } from "reactstrap";
import { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import RadialChart1 from "./userpanelChart1";
import RadialChart2 from "./userpanelChart2";
import RadialChart3 from "./userpanelChart3";
import RadialChart4 from "./userpanelChart4";

const UserPanel = () => {
  const [totalCount, setTotalCount] = useState(0);
  const [unregCount, setUnregCount] = useState(0);
  const [entry, setEntry] = useState(0);
  const [exit, setExit] = useState(0);
  
  const fetchOrderStatusesCount = async () => {
    try {
      const token = Cookies.get("authToken");
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/vehicles`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTotalCount(response.data.totalVehicles);
      setUnregCount(0);
      setEntry(0);
      setExit(0);
    } catch (error) {
      console.error(error);
    }
  };
  
  useEffect(() => {
    fetchOrderStatusesCount();
  }, []);

  return (
    <React.Fragment>
      <Row>
        <Col xl={3} sm={6}>
        <a href="/vehicles">
        <Card className="order-data-card">
            <CardBody>
              <div className="d-flex text-muted">
                <div className="flex-shrink-0 me-3 align-self-center">
                  <div id="radialchart-1" className="apex-charts" dir="ltr">
                    <RadialChart1 totalOrders={totalCount} />
                  </div>
                </div>                
                <div className="flex-grow-1 overflow-hidden">
                  <p className="">Registered Vehicles</p>
                  <h5 className="">{totalCount}</h5>
                </div>
              </div>
            </CardBody>
          </Card>
          </a>
        </Col>

        <Col xl={3} sm={6}>
          <Card className="order-data-card">
            <CardBody>
              <div className="d-flex">
                <div className="flex-shrink-0 me-3 align-self-center">
                  <RadialChart2
                    id="radialchart-2"
                    className="apex-charts"
                    dir="ltr"
                    totalOrders={totalCount} 
                    acceptedOrders={unregCount} 
                  />
                </div>

                <div className="flex-grow-1 overflow-hidden">
                  <p className="">Un-Registered Vehicles</p>
                  <h5 className="">{unregCount}</h5>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>

        <Col xl={3} sm={6}>
          <Card className="order-data-card">
            <CardBody>
              <div className="d-flex text-muted">
                <div className="flex-shrink-0 me-3 align-self-center">
                  <RadialChart3
                    id="radialchart-3"
                    className="apex-charts"
                    dir="ltr"
                    totalOrders={totalCount} 
                    rejectedOrders={entry} 
                  />
                </div>

                <div className="flex-grow-1 overflow-hidden">
                  <p className="">Entry</p>
                  <h5 className="">{entry}</h5>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>

        <Col xl={3} sm={6}>
          <Card className="order-data-card">
            <CardBody>
            <div className="d-flex text-muted">
                <div className="flex-shrink-0 me-3 align-self-center">
                  <RadialChart4
                    id="radialchart-4"
                    className="apex-charts"
                    dir="ltr"
                    totalOrders={totalCount} 
                    pendingOrders={exit} 
                  />
                </div>
                <div className="flex-grow-1 overflow-hidden">
                  <p className="">Exit</p>
                  <h5 className="">{exit}</h5>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default UserPanel;
