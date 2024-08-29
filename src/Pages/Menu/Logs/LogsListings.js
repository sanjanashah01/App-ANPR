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
import axios from "axios";
import Cookies from "js-cookie";

export default function LogsListings() {
  const isFetchingRef = useRef(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [cameraData, setCameraData] = useState([]);
  const [currentCamera, setCurrentCamera] = useState(null);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
  };

  const entryTypeCellRenderer = (params) => {
    const className =
      params === "in" ? "btn btn-sm btn-success" : "btn btn-sm btn-danger";
    return (
      <span className={className} style={{ width: "40px" }}>
        {capitalizeString(params)}
      </span>
    );
  };

  const columns = [
    {
      name: (
        <span className="font-weight-bold fs-13">
          <b>Camera ID</b>
        </span>
      ),
      selector: (row) => row.cameraId,
      sortable: true,
    },
    {
      name: (
        <span className="font-weight-bold fs-13">
          <b>Camera location</b>
        </span>
      ),
      selector: (row) => row.cameraLocation,
      sortable: true,
    },
    {
      name: (
        <span className="font-weight-bold fs-13">
          <b>Entry Type</b>
        </span>
      ),
      selector: (row) => entryTypeCellRenderer(row.entryType),
      sortable: true,
    },
    {
      name: (
        <span className="font-weight-bold fs-13">
          <b>Number Plate</b>
        </span>
      ),
      selector: (row) => row.numberPlate.toUpperCase(),
      sortable: true,
    },
    {
      name: (
        <span className="font-weight-bold fs-13">
          <b>Created At</b>
        </span>
      ),
      selector: (row) => formatDate(row.createdDate),
      sortable: true,
    },
    {
      name: (
        <span className="font-weight-bold fs-13">
          <b>Camera Image</b>
        </span>
      ),
      selector: (cell) => {
        return (
          <React.Fragment>
            <div>
              <img
                src={`data:image/jpeg;base64,${cell.cameraImage[0]}`}
                alt="camera-img"
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
            {/* <Link to={`/edit-log/${cell._id}`}>
              <button
              disabled
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
            </Link> */}
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
                  Delete order
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
                    currentCamera?.cameraId
                  } log?{" "}
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
                  onClick={() => deleteOrder()}
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

  const capitalizeString = (str) => {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  useEffect(() => {
    fetchLogs();
    const intervalId = setInterval(() => {
      if (!isFetchingRef.current) {
        isFetching(isFetchingRef);
        fetchLogs();
      }
    }, 5000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const fetchLogs = async () => {
    try {
      const token = Cookies.get("authToken");
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/logs`,
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
    isFetchingRef.current = false;
  };

  const deleteOrder = async () => {
    try {
      const token = Cookies.get("authToken");
      await axios.delete(
        `${process.env.REACT_APP_BASE_URL}/logs/${currentCamera._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setModalOpen(false);
      window.location.reload();
    } catch (error) {
      console.error(error);
      setToastMessage("Error deleting order.");
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Menu" breadcrumbItem="Logs" />
          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  <a href="/add-order">
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
