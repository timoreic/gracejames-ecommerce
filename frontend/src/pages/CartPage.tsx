import { useEffect } from 'react';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
  Row,
  Col,
  Form,
  Button,
  Card,
  ListGroup,
  Image,
} from 'react-bootstrap';
import { Message } from '../components/Message';
import { Container } from 'react-bootstrap';

import {
  selectCartState,
  addToCart,
  removeFromCart,
} from '../slices/cartSlice';
import { fetchSize, selectSizeState } from '../slices/sizeSlice';
import { fetchMaterial, selectMaterialState } from '../slices/materialSlice';

const CartPage = () => {
  const { productId } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const qty = queryParams.get('qty');
  const sizeId = queryParams.get('sizeId');
  const materialId = queryParams.get('materialId');
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { cartItems } = useAppSelector(selectCartState);
  const { sizeDetails } = useAppSelector(selectSizeState);
  const { materialDetails } = useAppSelector(selectMaterialState);

  useEffect(() => {
    if (sizeId && sizeDetails._id !== Number(sizeId)) {
      dispatch(fetchSize(sizeId!));
    }
    if (materialId && materialDetails._id !== Number(materialId)) {
      dispatch(fetchMaterial(materialId!));
    }
    if (
      materialId &&
      sizeId &&
      productId &&
      sizeDetails._id === Number(sizeId) &&
      materialDetails._id === Number(materialId)
    ) {
      const args = {
        productId: Number(productId),
        qty: Number(qty),
        sizeSurcharge: sizeDetails.surcharge,
        materialSurcharge: materialDetails.surcharge,
      };
      dispatch(addToCart(args));
    }
  }, [
    dispatch,
    qty,
    productId,
    sizeId,
    materialId,
    sizeDetails,
    materialDetails,
  ]);

  const removeFromCartHandler = (id: number) => dispatch(removeFromCart(id));

  const checkOutHandler = () => navigate('/login?redirect=/shipping');

  return (
    <Container>
      <Row>
        <Col md={8}>
          <h1>Shopping Cart</h1>
          {cartItems.length === 0 ? (
            <Message variant="info">
              Your Cart is empty <Link to="/">Go Back</Link>
            </Message>
          ) : (
            <ListGroup variant="flush">
              {cartItems.map((item) => (
                <ListGroup.Item key={item.product}>
                  <Row>
                    <Col md={2}>
                      <Image src={item.image} alt={item.name} fluid rounded />
                    </Col>

                    <Col md={3}>
                      <Link to={`/product/${item.product}`}>{item.name}</Link>
                    </Col>

                    <Col md={2}>
                      $
                      {Number(item.basePrice) +
                        Number(item.sizeSurcharge) +
                        Number(item.materialSurcharge)}
                    </Col>

                    <Col md={3}>
                      <Form.Control
                        as="select"
                        value={item.qty}
                        onChange={(e) =>
                          dispatch(
                            addToCart({
                              productId: item.product,
                              qty: Number(e.target.value),
                              sizeSurcharge: item.sizeSurcharge,
                              materialSurcharge: item.materialSurcharge,
                            })
                          )
                        }
                      >
                        {Array.from(Array(20).keys()).map((x) => (
                          <option key={x} value={x + 1}>
                            {x + 1}
                          </option>
                        ))}
                      </Form.Control>
                    </Col>

                    <Col md={1}>
                      <Button
                        type="button"
                        variant="light"
                        shadow-none="false"
                        onClick={() => removeFromCartHandler(item.product)}
                      >
                        <i className="fa fa-trash"></i>
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>

        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>
                  Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)}
                  ) items
                </h2>
                $
                {cartItems
                  .reduce(
                    (acc, item) =>
                      acc +
                      item.qty *
                        (Number(item.basePrice) +
                          Number(item.sizeSurcharge) +
                          Number(item.materialSurcharge)),
                    0
                  )
                  .toFixed(2)}
              </ListGroup.Item>

              <ListGroup.Item>
                <div className="d-grid">
                  <Button
                    type="button"
                    disabled={cartItems.length === 0}
                    onClick={checkOutHandler}
                  >
                    Proceed to Checkout
                  </Button>
                </div>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CartPage;
