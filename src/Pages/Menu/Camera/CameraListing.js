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

export default function CameraListing() {
  const isFetchingRef = useRef(false);
  const [cameraData, setCameraData] = useState([]);
  const [currentCamera, setCurrentCamera] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const columns = [
    {
      name: (
        <span className="font-weight-bold fs-13">
          <b>Camera Name</b>
        </span>
      ),
      selector: (row) => row.cameraName,
      sortable: true,
    },
    {
      name: (
        <span className="font-weight-bold fs-13">
          <b>Camera Location</b>
        </span>
      ),
      selector: (row) => row.cameraLocation,
      sortable: true,
    },
    {
      name: (
        <span className="font-weight-bold fs-13">
          <b>RTSP Url</b>
        </span>
      ),
      selector: (row) => row.rtspUrl,
      sortable: true,
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
            <Link to={`/edit-camera/${cell._id}`}>
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
                setCurrentCamera(cell);
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
                  Delete Camera
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
                <p>
                  {" "}
                  Are you sure you want to delete {
                    currentCamera?.cameraName
                  }{" "}
                  camera?{" "}
                </p>
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
                  onClick={() => deleteCamera()}
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
      fetchCameras();
    }
  }, []);

  const fetchCameras = async () => {
    try {
      const token = Cookies.get("authToken");
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/cameras`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCameraData(response.data);
    } catch (error) {
      console.error(error);
      setToastMessage("Error fetching orders data.");
    }
  };

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  const deleteCamera = async () => {
    try {
      const token = Cookies.get('authToken');
      await axios.delete(`${process.env.REACT_APP_BASE_URL}/cameras/${currentCamera._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      window.location.reload();
    } catch (error) {
      console.error(error);
      setToastMessage("Error deleting camera.");
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Menu" breadcrumbItem="Cameras" />
          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  <a href="/add-camera">
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
                  <DataTable columns={columns} data={cameraData} pagination />
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
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
    </React.Fragment>
  );
}
