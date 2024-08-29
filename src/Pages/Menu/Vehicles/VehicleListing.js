import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Modal,
  Row,
  UncontrolledAlert,
} from "reactstrap";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import DataTable from "react-data-table-component";
import { isFetching } from "../../../helpers/utilityFunctions";
import { isEmpty } from "lodash";
import { Link } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

export default function VehicleListing() {
  const isFetchingRef = useRef(false);
  const [vehicleData, setVehicleData] = useState([]);
  const [currentVehicle, setCurrentVehicle] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const columns = [
    {
      name: (
        <span className="font-weight-bold fs-13">
          <b>Name</b>
        </span>
      ),
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: (
        <span className="font-weight-bold fs-13">
          <b>Phone Number</b>
        </span>
      ),
      selector: (row) => row.phoneNumber,
      sortable: true,
    },
    {
      name: (
        <span className="font-weight-bold fs-13">
          <b>Vehicle Number</b>
        </span>
      ),
      selector: (row) => row.vehicleNumber,
      sortable: true,
    },
    {
      name: (
        <span className="font-weight-bold fs-13">
          <b>vehicle Image</b>
        </span>
      ),
      selector: (cell) => {
        return (
          <React.Fragment>
            <div>
              <img
                src={`data:image/jpeg;base64,${cell.vehicleImgUrl[0]}`}
                alt="vehicle"
                width="70%"
                height="90%"
                style={{
                  borderRadius: "12px",
                  marginTop: "5px",
                  marginBottom: "5px",
                }}
              />
            </div>
          </React.Fragment>
        );
      },
    },
    {
      name: (
        <span className="font-weight-bold fs-13">
          <b>Action</b>
        </span>
      ),
      sortable: true,
      cell: (cell) => {
        return (
          <>
            <Link to={`/edit-vehicle/${cell._id}`}>
              <button
                title="Edit"
                style={{
                  backgroundColor: "transparent",
                  color: "skyblue",
                  border: "none",
                  paddingLeft: "0px",
                }}
              >
                <i
                  className="bx bxs-edit align-bottom me-1"
                  style={{ fontSize: "1.125rem" }}
                ></i>
              </button>
            </Link>
            <button
              title="Delete"
              style={{
                backgroundColor: "transparent",
                color: "#111742",
                border: "none",
              }}
              onClick={() => {
                setCurrentVehicle(cell);
                setModalOpen(true);
              }}
            >
              <i
                className="bx bxs-trash align-bottom me-1"
                style={{ fontSize: "1.125rem" }}
              ></i>
            </button>
            <Modal
              isOpen={modalOpen}
              toggle={() => {
                toggleModal();
              }}
            >
              <div className="modal-header">
                <h5 className="modal-title mt-0" id="myModalLabel">
                  Delete Vehicle
                </h5>
                <button
                  type="button"
                  onClick={() => {
                    setModalOpen(false);
                  }}
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <p> Are you sure you want to delete {currentVehicle?.name} ?</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  onClick={() => {
                    toggleModal();
                  }}
                  className="btn btn-secondary "
                  data-dismiss="modal"
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => deleteVehicle()}
                >
                  <span class="bx bxs-trash"></span> Delete
                </button>
              </div>
            </Modal>
          </>
        );
      },
    },
  ];

  useEffect(() => {
    if (!isFetchingRef.current) {
      isFetching(isFetchingRef);
      fetchVehicles();
    }
  }, []);

  const fetchVehicles = async () => {
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
      setVehicleData(response.data.data);
    } catch (error) {
      console.error(error);
      setToastMessage("Error fetching users data.");
    }
  };

  const deleteVehicle = async () => {
    try {
      const token = Cookies.get("authToken");
      await axios.delete(
        `${process.env.REACT_APP_BASE_URL}/vehicles/${currentVehicle._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      window.location.reload();
    } catch (error) {
      console.error(error);
      setToastMessage("Error deleting vehicle data.");
    }
  };

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Menu" breadcrumbItem="Vehicles" />
          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  <a href="/add-vehicle">
                    <Button type="button" color="primary">
                      <i className="bx bx-plus "></i> Add
                    </Button>
                  </a>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  <DataTable columns={columns} data={vehicleData} pagination />
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
        {!isEmpty(toastMessage) ? (
          <div
            className="position-fixed top-0 end-0 p-3"
            style={{ zIndex: "1005" }}
          >
            <UncontrolledAlert
              color="light"
              role="alert"
              className="card border mt-4 mt-lg-0 p-0 mb-0"
            >
              <div className="card-header bg-danger-subtle">
                <div className="d-flex">
                  <div className="flex-grow-1">
                    <h5 className="font-size-16 text-danger my-1">Oops!</h5>
                  </div>
                  <div className="flex-shrink-0"></div>
                </div>
              </div>
              <CardBody>
                <div className="text-center">
                  <p className="mb-0">{toastMessage}</p>
                </div>
              </CardBody>
            </UncontrolledAlert>
          </div>
        ) : null}
      </div>
    </React.Fragment>
  );
}
