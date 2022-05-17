import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { Link, useNavigate } from 'react-router-dom';
import {
  Button,
  Row,
  Col,
  ListGroup,
  Image,
  Card,
  Container,
} from 'react-bootstrap';
import { CheckoutSteps } from '../components/CheckoutSteps';
import { Message } from '../components/Message';
import { selectCartState, removeCartItems } from '../slices/cartSlice';
import { selectShippingAddressState } from '../slices/shippingAddressSlice';
import {
  createOrder,
  selectOrderState,
  resetOrder,
} from '../slices/orderSlice';
import { selectUserState } from '../slices/userSlice';

const PlaceOrderPage = () => {
  const { order, status, error } = useAppSelector(selectOrderState);
  const { userInfo } = useAppSelector(selectUserState);
  const { shippingAddress } = useAppSelector(selectShippingAddressState);
  const { cartItems } = useAppSelector(selectCartState);
  const itemsPrice = Number(
    cartItems
      .reduce(
        (acc, item) =>
          acc +
          item.qty *
            (Number(item.basePrice) +
              Number(item.sizeSurcharge) +
              Number(item.materialSurcharge)),
        0
      )
      .toFixed(2)
  );
  const shippingPrice = Number((itemsPrice > 1000 ? 0 : 20).toFixed(2));
  const totalPrice = Number((itemsPrice + shippingPrice).toFixed(2));
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (status === 'succeeded') {
      navigate(`/order/${order._id}`);
      dispatch(resetOrder());
      dispatch(removeCartItems());
    }
  }, [status, navigate, order._id, dispatch]);

  const placeOrder = () => {
    dispatch(
      createOrder({
        orderItems: cartItems,
        shippingAddress: shippingAddress,
        itemsPrice: itemsPrice,
        shippingPrice: shippingPrice,
        totalPrice: totalPrice,
        token: userInfo!.user.token,
      })
    );
  };

  return (
    <Container>
      <CheckoutSteps step1 step2 step3 />
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Address: </strong>
                {shippingAddress.address}, {shippingAddress.city}
                {'  '},{shippingAddress.postalCode}, {shippingAddress.state}
              </p>
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Order Items</h2>
              {cartItems.length === 0 ? (
                <Message variant="info">Your cart is empty</Message>
              ) : (
                <ListGroup variant="flush">
                  {cartItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col>
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>
                        </Col>

                        <Col md={4}>
                          {item.qty} X $(
                          {Number(item.basePrice) +
                            Number(item.sizeSurcharge) +
                            Number(item.materialSurcharge)}
                          ) = $
                          {(
                            item.qty *
                            (Number(item.basePrice) +
                              Number(item.sizeSurcharge) +
                              Number(item.materialSurcharge))
                          ).toFixed(2)}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>

        <Col md={4}>
          <Card className="border-0">
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Items:</Col>
                  <Col>${itemsPrice.toFixed(2)}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Shipping:</Col>
                  <Col>${shippingPrice.toFixed(2)}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Total:</Col>
                  <Col>${totalPrice.toFixed(2)}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                {error && <Message variant="danger">{error}</Message>}
              </ListGroup.Item>

              <ListGroup.Item>
                <div className="d-grid">
                  <Button
                    type="button"
                    disabled={cartItems.length === 0}
                    onClick={placeOrder}
                  >
                    Place Order
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

export default PlaceOrderPage;
