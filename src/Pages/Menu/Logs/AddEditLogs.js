import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  FormFeedback,
  FormGroup,
  Input,
  Label,
  Row,
  Form,
  InputGroup,
  UncontrolledAlert,
} from "reactstrap";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { useFormik } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import { isFetching } from "../../../helpers/utilityFunctions";
import APIMiddleware from "../../../helpers/APIMiddleware";
import { isEmpty } from "lodash";

export default function AddEditLogs() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isFetchingRef = useRef(false);
  const [orderDetails, setOrderDetails] = useState({});
  const [productsDatasource, setProductsDatasource] = useState([]);
  const [requestFromDatasource, setRequestFromDatasource] = useState([]);
  const [addressesDatasource, setAddressesDatasource] = useState([]); // Added state for addresses
  const [regionalManagerDatasource, setRegionalManagerDatasource] = useState(
    []
  );
  const [maxQuantities, setMaxQuantities] = useState({});

  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedRequestFrom, setSelectedRequestFrom] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null); // Added state for selected address

  const [toastMessage, setToastMessage] = useState("");

  const orderStatusOptions = [
    { label: "Pending", value: "pending" },
    { label: "Approved", value: "approved" },
    { label: "Dispatched", value: "dispatched" },
    { label: "In transit", value: "in transit" },
    { label: "Delivered", value: "delivered" },
    { label: "Rejected", value: "rejected" },
  ];

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      productQuantities: orderDetails.productQuantities || [
        { product: null, quantity: 0 },
      ],
      orderStatus: orderDetails.orderStatus || null,
      requestFrom: orderDetails.requestFrom || null,
      address: orderDetails.address || null, // Added initial value for address
    },
    validationSchema: Yup.object({
      productQuantities: Yup.array()
        .of(
          Yup.object({
            product: Yup.object().required("Please select a product"),
            quantity: Yup.number()
              .required("Please enter quantity")
              .min(0, "Quantity must be greater than zero")
              .typeError("Please enter quantity and it must be a number."),
            orderType: Yup.object().required("Please select order type"),
          })
        )
        .min(1, "Please select at least one product"),
      orderStatus: Yup.object().required("Order Status can't be empty."),
      requestFrom: Yup.object().required("Request from can't be empty."),
      address: Yup.object().required("Please select a Address."), // Added validation for address
    }),
    onSubmit: (values) => {
      if (id) {
        updateOrders(values);
      } else {
        addOrders(values);
      }
    },
  });

  useEffect(() => {
    if (!isFetchingRef.current) {
      isFetching(isFetchingRef);
      fetchDropdownData();
      fetchAddresses();
      if (id) {
        fetchOrderDetails(id);
      }
    }
  }, []);

  const fetchDropdownData = async () => {
    try {
      const [productResponse, userResponse, regionalManagerResponse] =
        await Promise.all([
          APIMiddleware.get(`${process.env.REACT_APP_BASE_URL}/product`),
          APIMiddleware.get(`${process.env.REACT_APP_BASE_URL}/employees`),
          APIMiddleware.get(
            `${process.env.REACT_APP_BASE_URL}/regional-manager`
          ),
        ]);
      setRegionalManagerDatasource(regionalManagerResponse.data);

      const transformedProductOptions = productResponse.data.map((product) => ({
        value: product._id,
        label: product.productName,
      }));
      setProductsDatasource(transformedProductOptions);

      const transformedRequestFromOptions = userResponse.data.map((user) => ({
        value: user._id,
        label: user.employeeName,
        rm: user.regionalManager,
      }));
      setRequestFromDatasource(transformedRequestFromOptions);
    } catch (error) {
      console.error(error);
      setToastMessage("Error fetching dropdown data.");
    }
  };

  const fetchAddresses = async () => {
    try {
      const response = await APIMiddleware.get(
        `${process.env.REACT_APP_BASE_URL}/address`
      );
      const transformedAddressOptions = response.data.map((address) => ({
        value: address._id,
        label: address.addressDetails,
      }));
      setAddressesDatasource(transformedAddressOptions);
    } catch (error) {
      console.error(error);
      setToastMessage("Error fetching addresses.");
    }
  };

  const fetchOrderDetails = async (id) => {
    try {
      const response = await APIMiddleware.get(
        `${process.env.REACT_APP_BASE_URL}/orders/${id}`
      );
      const { product, orderStatus, requestFrom, address } = response.data;
      const productQuantities = product.map((item) => ({
        product: {
          label: item.productName,
          value: item._id,
        },
        quantity: item.quantity,
        orderType: {
          label: item.orderType,
          value: item.orderType,
        },
      }));

      const statusOption = orderStatusOptions.find(
        (option) => option.value === orderStatus
      );

      setOrderDetails({
        productQuantities,
        orderStatus: statusOption,
        requestFrom: {
          label: requestFrom.employeeName,
          value: requestFrom._id,
          rm: requestFrom.regionalManager,
        },
        address: {
          label: address.addressDetails,
          value: address._id,
        },
      });

      const maxQtyCheck = {
        value: requestFrom._id,
        label: requestFrom.employeeName,
        rm: requestFrom.regionalManager,
      };
      setSelectedRequestFrom(maxQtyCheck);

      setSelectedStatus(statusOption);
    } catch (error) {
      console.error(error);
      setToastMessage("Error fetching order details.");
    }
  };

  const handleProductChange = (index, selectedProduct) => {
    const newProductQuantities = [...validation.values.productQuantities];
    newProductQuantities[index].product = selectedProduct;
    validation.setFieldValue("productQuantities", newProductQuantities);
    if (selectedRequestFrom) handleRequestFromChange(selectedRequestFrom);
    const selectedProductValue = selectedProduct.value;
    const maxQuantity = maxQuantities[selectedProductValue];

    if (maxQuantity === null || maxQuantity === 0) {
      newProductQuantities[index].product = null;
      setToastMessage(
        `Product ${selectedProduct.label} is out of stock in this region.`
      );
    } else {
      setToastMessage("");
    }
  };

  const handleQuantityChange = (index, quantity) => {
    const newProductQuantities = [...validation.values.productQuantities];
    newProductQuantities[index].quantity = quantity;
    validation.setFieldValue("productQuantities", newProductQuantities);
    if (selectedRequestFrom) handleRequestFromChange(selectedRequestFrom);
    setToastMessage("");
  };

  const handleOrderTypeChange = (index, selectedOrderType) => {
    const newProductQuantities = [...validation.values.productQuantities];
    newProductQuantities[index].orderType = selectedOrderType;
    validation.setFieldValue("productQuantities", newProductQuantities);
  };

  const addProductQuantity = () => {
    const newProductQuantities = [
      ...validation.values.productQuantities,
      { product: null, quantity: 0, orderType: null },
    ];
    validation.setFieldValue("productQuantities", newProductQuantities);
  };

  const removeProductQuantity = (index) => {
    const newProductQuantities = [...validation.values.productQuantities];
    newProductQuantities.splice(index, 1);
    validation.setFieldValue("productQuantities", newProductQuantities);
    setToastMessage("");
  };

  const handleOrderStatusChange = (selectedStatus) => {
    setSelectedStatus(selectedStatus);
    validation.setFieldValue("orderStatus", selectedStatus);
  };

  const handleRequestFromChange = (selectedRequestFrom) => {
    setSelectedRequestFrom(selectedRequestFrom);
    const selectedRM = regionalManagerDatasource.find(
      (rm) => rm._id === selectedRequestFrom.rm
    );

    const maxQuantitiesObj = {};
    selectedRM.region.product.forEach((product) => {
      maxQuantitiesObj[product._id] = product.quantity;
    });
    setMaxQuantities(maxQuantitiesObj);

    const productQuantities = validation.values.productQuantities;
    const errorFound = productQuantities.some((item) => {
      if (item.product !== null) {
        const maxQuantity = maxQuantitiesObj[item.product.value];
        if (maxQuantity === 0) {
          setToastMessage(
            `Product ${item.product.label} is out of stock in this region.`
          );
          return true;
        }
        return false;
      }
    });

    if (!errorFound) {
      validation.setFieldValue("requestFrom", selectedRequestFrom);
    }
  };

  const handleAddressChange = (selectedAddress) => {
    setSelectedAddress(selectedAddress);
    validation.setFieldValue("address", selectedAddress);
  };

  const updateOrders = async (values) => {
    try {
      const productQuantities = values.productQuantities
        .filter((item) => item.quantity > 0)
        .map((item) => ({
          _id: item.product.value,
          quantity: item.quantity,
          orderType: item.orderType.value,
          productName: item.product.label,
        }));

      if (productQuantities.length < values.productQuantities.length) {
        setToastMessage("Error: Product quantity cannot be zero.");
        return;
      }
      const productIds = productQuantities.map((item) => item._id);
      const duplicateIds = productIds.filter(
        (id, index) => productIds.indexOf(id) !== index
      );
      if (duplicateIds.length > 0) {
        setToastMessage("Duplicate product entries found.");
        return;
      }
      const orderPayload = {
        product: productQuantities,
        orderStatus: values.orderStatus.value,
        address: values.address.value,
        requestFrom: values.requestFrom.value,
      };

      await APIMiddleware.put(
        `${process.env.REACT_APP_BASE_URL}/orders/${id}`,
        orderPayload
      );
      navigate("/orders");
    } catch (error) {
      console.error(error);
      setToastMessage("Error updating order.");
    }
  };

  const addOrders = async (values) => {
    try {
      const productQuantities = values.productQuantities
        .filter((item) => item.quantity > 0)
        .map((item) => ({
          _id: item.product.value,
          productName: item.product.label,
          quantity: item.quantity,
          orderType: item.orderType.value,
        }));
      if (productQuantities.length < values.productQuantities.length) {
        setToastMessage("Error: Product quantity cannot be zero.");
        return;
      }
      const productIds = productQuantities.map((item) => item._id);
      const duplicateIds = productIds.filter(
        (id, index) => productIds.indexOf(id) !== index
      );
      if (duplicateIds.length > 0) {
        setToastMessage("Error: Duplicate product entries found.");
        return;
      }
      const orderPayload = {
        product: productQuantities,
        orderStatus: values.orderStatus.value,
        address: values.address.value,
        requestFrom: values.requestFrom.value,
      };

      await APIMiddleware.post(
        `${process.env.REACT_APP_BASE_URL}/orders`,
        orderPayload
      );
      navigate("/orders");
    } catch (error) {
      console.error(error);
      setToastMessage("Error adding order.");
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Menu"
            breadcrumbItem={id ? "Edit Order" : "Add Order"}
          />
          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  <Form
                    className="needs-validation"
                    onSubmit={(e) => {
                      e.preventDefault();
                      validation.handleSubmit();
                      return false;
                    }}
                  >
                    <Row>
                      <Col md="12">
                        <FormGroup className="mb-3">
                          <Label htmlFor="validationCustom02">Products</Label>
                          {validation.values.productQuantities.map(
                            (item, index) => (
                              <InputGroup key={index} className="mb-2">
                                <Col md="6">
                                  <Select
                                    name={`productQuantities[${index}].product`}
                                    value={item.product}
                                    isMulti={false}
                                    onChange={(selectedProduct) =>
                                      handleProductChange(
                                        index,
                                        selectedProduct
                                      )
                                    }
                                    options={productsDatasource}
                                    classNamePrefix="select2-selection"
                                  />
                                </Col>
                                <Col md="2">
                                  <Input
                                    name={`productQuantities[${index}].quantity`}
                                    type="number"
                                    min="0"
                                    max={maxQuantities[item.product?.value]}
                                    value={item.quantity}
                                    onChange={(e) =>
                                      handleQuantityChange(
                                        index,
                                        parseInt(e.target.value, 10)
                                      )
                                    }
                                    className="form-control"
                                  />
                                </Col>
                                <Col md="2">
                                  <Select
                                    name={`productQuantities[${index}].orderType`}
                                    value={item.orderType}
                                    isMulti={false}
                                    onChange={(selectedOrderType) =>
                                      handleOrderTypeChange(
                                        index,
                                        selectedOrderType
                                      )
                                    }
                                    options={[
                                      { value: "ASSET", label: "ASSET" },
                                      { value: "POSM", label: "POSM" },
                                    ]}
                                    classNamePrefix="select2-selection"
                                  />
                                </Col>
                                <Col md="2">
                                  <InputGroup addonType="append">
                                    <Button
                                      color="link"
                                      onClick={() =>
                                        removeProductQuantity(index)
                                      }
                                    >
                                      Remove
                                    </Button>
                                  </InputGroup>
                                </Col>
                                {validation.touched.productQuantities &&
                                validation.errors.productQuantities ? (
                                  <FormFeedback
                                    type="invalid"
                                    className="d-block"
                                  >
                                    {validation.errors.productQuantities[index]
                                      ?.product ||
                                      validation.errors.productQuantities[index]
                                        ?.quantity ||
                                      validation.errors.productQuantities[index]
                                        ?.orderType}
                                  </FormFeedback>
                                ) : null}
                              </InputGroup>
                            )
                          )}
                          <br />
                          <Button
                            color="primary"
                            outline
                            onClick={addProductQuantity}
                          >
                            Add Product
                          </Button>
                        </FormGroup>
                      </Col>
                      <Col md="6">
                        <FormGroup className="mb-3">
                          <Label htmlFor="validationCustom03">
                            Order status
                          </Label>
                          <Select
                            name="orderStatus"
                            type="text"
                            options={orderStatusOptions}
                            id="validationCustom09"
                            onChange={handleOrderStatusChange}
                            onBlur={validation.handleBlur}
                            value={selectedStatus}
                            className={
                              validation.touched.orderStatus &&
                              validation.errors.orderStatus
                                ? "is-invalid"
                                : ""
                            }
                          />
                          {validation.touched.orderStatus &&
                          validation.errors.orderStatus ? (
                            <FormFeedback type="invalid">
                              {validation.errors.orderStatus}
                            </FormFeedback>
                          ) : null}
                        </FormGroup>
                      </Col>
                      <Col md="6">
                        <FormGroup className="mb-3">
                          <Label htmlFor="validationCustom02">
                            Request from
                          </Label>
                          <Select
                            name="requestFrom"
                            value={validation.values.requestFrom}
                            onChange={handleRequestFromChange}
                            options={requestFromDatasource}
                            styles={{
                              menu: (provided) => ({
                                ...provided,
                                maxHeight: "165px",
                                overflowY: "auto",
                              }),
                              menuList: (provided) => ({
                                ...provided,
                                maxHeight: "165px",
                                overflowY: "auto",
                              }),
                            }}
                          />
                          {validation.touched.requestFrom &&
                          validation.errors.requestFrom ? (
                            <FormFeedback type="invalid" className="d-block">
                              {validation.errors.requestFrom}
                            </FormFeedback>
                          ) : null}
                        </FormGroup>
                      </Col>
                      <Col md="6">
                        <FormGroup className="mb-3">
                          <Label htmlFor="validationCustom04">Address</Label>
                          <Select
                            name="address"
                            value={validation.values.address}
                            onChange={handleAddressChange}
                            options={addressesDatasource}
                            styles={{
                              menu: (provided) => ({
                                ...provided,
                                maxHeight: "165px",
                                overflowY: "auto",
                              }),
                              menuList: (provided) => ({
                                ...provided,
                                maxHeight: "165px",
                                overflowY: "auto",
                              }),
                            }}
                          />
                          {validation.touched.address &&
                          validation.errors.address ? (
                            <FormFeedback type="invalid" className="d-block">
                              {validation.errors.address}
                            </FormFeedback>
                          ) : null}
                        </FormGroup>
                      </Col>
                    </Row>
                    <br />
                    {id ? (
                      <Button type="submit" color="primary">
                        <i className="bx bxs-edit"></i> Edit Order
                      </Button>
                    ) : (
                      <Button type="submit" color="primary">
                        <i className="bx bx-plus "></i> Add Order
                      </Button>
                    )}
                    &nbsp; &nbsp; &nbsp;
                    <a href="/orders">
                      <Button type="button" color="link">
                        <i className="bx bx-arrow-back"></i> Back
                      </Button>
                    </a>
                  </Form>
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
