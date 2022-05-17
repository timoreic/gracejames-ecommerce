import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
  Row,
  Col,
  Image,
  ListGroup,
  Button,
  Card,
  Form,
  Container,
} from 'react-bootstrap';

import { Loader } from '../components/Loader';
import { Message } from '../components/Message';

import { fetchProduct, selectProductState } from '../slices/productSlice';
import { fetchSizes, selectSizesState } from '../slices/sizesSlice';
import { fetchSize, selectSizeState } from '../slices/sizeSlice';
import { fetchMaterials, selectMaterialsState } from '../slices/materialsSlice';
import { fetchMaterial, selectMaterialState } from '../slices/materialSlice';

const ProductPage = () => {
  const { productId } = useParams();
  const [qty, setQty] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { productDetails, status, error } = useAppSelector(selectProductState);
  const { sizes, status: sizesStatus } = useAppSelector(selectSizesState);
  const { sizeDetails, status: sizeStatus } = useAppSelector(selectSizeState);
  const { materials, status: materialsStatus } =
    useAppSelector(selectMaterialsState);
  const { materialDetails, status: materialStatus } =
    useAppSelector(selectMaterialState);

  useEffect(() => {
    dispatch(fetchProduct(productId!));
  }, [productId, dispatch]);

  useEffect(() => {
    if (sizesStatus === 'idle') {
      dispatch(fetchSizes());
    }
    if (materialsStatus === 'idle') {
      dispatch(fetchMaterials());
    }
    if (sizeStatus === 'idle' && sizesStatus === 'succeeded') {
      dispatch(fetchSize(sizes[0]._id.toString()));
    }
    if (materialStatus === 'idle' && materialsStatus === 'succeeded') {
      dispatch(fetchMaterial(materials[0]._id.toString()));
    }
    if (
      materialStatus === 'succeeded' &&
      sizeStatus === 'succeeded' &&
      sizesStatus === 'succeeded'
    ) {
      let totalPrice =
        Number(productDetails.baseprice) +
        Number(sizeDetails.surcharge) +
        Number(materialDetails.surcharge);
      setTotalPrice(totalPrice);
    }
  }, [
    sizesStatus,
    sizeStatus,
    sizes,
    materialsStatus,
    materialStatus,
    materials,
    dispatch,
    productDetails.baseprice,
    sizeDetails.surcharge,
    materialDetails.surcharge,
  ]);

  const addToCartHandler = () => {
    navigate(
      `/cart/${productId}?qty=${qty}&sizeId=${sizeDetails._id}&materialId=${materialDetails._id}`
    );
  };

  const selectSizeHandler = (sizeId: string) => {
    dispatch(fetchSize(sizeId));
  };

  const selectMaterialHandler = (materialId: string) => {
    dispatch(fetchMaterial(materialId));
  };

  let content;
  if (status === 'loading') {
    content = <Loader text="Loading Product..." />;
  } else if (status === 'failed') {
    content = <Message variant="danger">{error!}</Message>;
  } else {
    content = (
      <div>
        <Row>
          <Col md={6}>
            <Image
              src={productDetails!.image}
              alt={productDetails!.name}
              fluid
            />
          </Col>
          <Col md={3}>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h3>{productDetails!.name}</h3>
              </ListGroup.Item>

              <Form>
                <ListGroup.Item className="border-0">
                  <Form.Group controlId="size">
                    <Form.Label>
                      <strong>Select Size:</strong>
                    </Form.Label>
                    <Form.Select
                      value={sizeDetails._id}
                      onChange={(e) => selectSizeHandler(e.target.value)}
                    >
                      {sizes.map((item) => {
                        const { size: sizeString, _id } = item;
                        return <option value={_id}>{sizeString}</option>;
                      })}
                    </Form.Select>
                  </Form.Group>
                </ListGroup.Item>

                <ListGroup.Item className="border-0">
                  <Form.Group controlId="material">
                    <Form.Label>
                      <strong>Select Material:</strong>
                    </Form.Label>
                    <Form.Select
                      value={materialDetails._id}
                      onChange={(e) => selectMaterialHandler(e.target.value)}
                    >
                      {materials.map((item) => {
                        const { material: materialString, _id } = item;
                        return <option value={_id}>{materialString}</option>;
                      })}
                    </Form.Select>
                  </Form.Group>
                </ListGroup.Item>
              </Form>

              <ListGroup.Item>
                <strong>Description:</strong>
                <br />
                {productDetails!.description}
              </ListGroup.Item>
            </ListGroup>
          </Col>
          <Col md={3}>
            <Card>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Price:</Col>
                    <Col>
                      <strong>${totalPrice}</strong>
                    </Col>
                  </Row>
                </ListGroup.Item>

                <ListGroup.Item>
                  <Row>
                    <Col>Quantity:</Col>
                    <Col xs="auto" className="my-1">
                      <Form.Control
                        as="select"
                        value={qty}
                        onChange={(e) => setQty(Number(e.target.value))}
                      >
                        {Array.from(Array(20).keys()).map((x) => (
                          <option key={x} value={x + 1}>
                            {x + 1}
                          </option>
                        ))}
                      </Form.Control>
                    </Col>
                  </Row>
                </ListGroup.Item>

                <ListGroup.Item>
                  <div className="d-grid">
                    <Button
                      onClick={addToCartHandler}
                      className="btn-block"
                      type="button"
                    >
                      Add to Cart
                    </Button>
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }

  return (
    <Container>
      <Link to="/" className="btn btn-dark my-3">
        Go Back
      </Link>
      {content}
    </Container>
  );
};

export default ProductPage;
