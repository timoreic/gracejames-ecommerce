import { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
  Row,
  Col,
  ListGroup,
  Image,
  Card,
  Button,
  Container,
} from 'react-bootstrap';
import { PayPalButton } from 'react-paypal-button-v2';
import { Message } from '../components/Message';
import { Loader } from '../components/Loader';
import {
  fetchOrderDetails,
  selectOrderDetailsState,
} from '../slices/orderDetailsSlice';
import { selectUserState } from '../slices/userSlice';
import {
  selectOrderPayState,
  payOrder,
  resetOrderPayState,
} from '../slices/orderPaySlice';
import {
  selectOrderDeliverState,
  deliverOrder,
  resetOrderDeliverState,
} from '../slices/orderDeliverSlice';

declare const window: Window &
  typeof globalThis & {
    paypal: any;
  };

const OrderPage = () => {
  const [sdkReady, setSdkReady] = useState(false);
  const { id } = useParams();
  const orderId = Number(id);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { orderDetails, status, error } = useAppSelector(
    selectOrderDetailsState
  );
  const { status: payStatus } = useAppSelector(selectOrderPayState);
  const { status: deliverStatus } = useAppSelector(selectOrderDeliverState);
  const { userInfo } = useAppSelector(selectUserState);

  const addPayPalScript = () => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src =
      'https://www.paypal.com/sdk/js?client-id=ATtMUv-R7UHUmDZeS2wTEwrE68mSefBsOOYQAyhVTUcpeVsD4W1VDbY9KyPdmDz7WuTs8351SE7pSOq9';
    script.async = true;
    script.onload = () => {
      setSdkReady(true);
    };
    document.body.appendChild(script);
  };

  useEffect(() => {
    if (!userInfo!.user) {
      navigate('/login');
    }

    if (
      !orderDetails ||
      payStatus === 'succeeded' ||
      orderDetails._id !== orderId ||
      deliverStatus === 'succeeded'
    ) {
      dispatch(resetOrderPayState());
      dispatch(resetOrderDeliverState());

      dispatch(fetchOrderDetails({ id: orderId, token: userInfo!.user.token }));
    } else if (!orderDetails.isPaid) {
      if (!window.paypal) {
        addPayPalScript();
      } else {
        setSdkReady(true);
      }
    }
  }, [
    orderDetails,
    orderId,
    dispatch,
    userInfo,
    payStatus,
    deliverStatus,
    navigate,
  ]);

  const successPaymentHandler = (paymentResult: string) => {
    dispatch(
      payOrder({ id: orderId, token: userInfo!.user.token, paymentResult })
    );
  };

  const deliverHandler = () => {
    dispatch(
      deliverOrder({ order: orderDetails, token: userInfo!.user.token })
    );
  };

  let content;
  if (status === 'loading') {
    content = <Loader text="Loading Order..." />;
  } else if (status === 'failed') {
    content = <Message variant="danger">{error!}</Message>;
  } else if (status === 'succeeded') {
    content = (
      <div>
        <h1>Order Number: {orderDetails._id}</h1>
        <Row>
          <Col md={6} className="p-0 me-auto">
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Shipping</h2>
                <p>
                  <strong>Name: </strong> {orderDetails.user!.first_name}{' '}
                  {orderDetails.user!.last_name}
                </p>
                <p>
                  <strong>Email: </strong>{' '}
                  <a href={`mailto:${orderDetails.user!.email}`}>
                    {orderDetails.user!.email}
                  </a>
                </p>
                <p>
                  <strong>Address: </strong>
                  {orderDetails.shippingAddress.address},{' '}
                  {orderDetails.shippingAddress.city}
                  {'  '},{orderDetails.shippingAddress.postalCode},{' '}
                  {orderDetails.shippingAddress.state}
                </p>

                {orderDetails.isDelivered ? (
                  <Message variant="success">
                    Delivered on {orderDetails.deliveredAt!}
                  </Message>
                ) : (
                  <Message variant="warning">Not Delivered</Message>
                )}

                {orderDetails.isPaid ? (
                  <Message variant="success">
                    Paid on {orderDetails.paidAt!}
                  </Message>
                ) : (
                  <Message variant="warning">Not Paid</Message>
                )}
              </ListGroup.Item>

              <ListGroup.Item>
                <h2>Order Items</h2>
                {orderDetails.orderItems === [] ? (
                  <Message variant="info">Order is empty</Message>
                ) : (
                  <ListGroup variant="flush">
                    {orderDetails.orderItems.map((item, index) => (
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

          <Col md={5}>
            <Card className="border-0">
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h2>Order Summary</h2>
                </ListGroup.Item>

                <ListGroup.Item>
                  <Row>
                    <Col>Items:</Col>
                    <Col>
                      $
                      {(
                        orderDetails.totalPrice - orderDetails.shippingPrice
                      ).toFixed(2)}
                    </Col>
                  </Row>
                </ListGroup.Item>

                <ListGroup.Item>
                  <Row>
                    <Col>Shipping:</Col>
                    <Col>${orderDetails.shippingPrice}</Col>
                  </Row>
                </ListGroup.Item>

                <ListGroup.Item>
                  <Row>
                    <Col>Total:</Col>
                    <Col>${orderDetails.totalPrice}</Col>
                  </Row>
                </ListGroup.Item>

                {!orderDetails.isPaid && (
                  <ListGroup.Item>
                    {payStatus === 'loading' && <Loader />}

                    {!sdkReady ? (
                      <Loader />
                    ) : (
                      <PayPalButton
                        amount={orderDetails.totalPrice}
                        onSuccess={successPaymentHandler}
                        currency="AUD"
                      />
                    )}
                  </ListGroup.Item>
                )}
              </ListGroup>

              {deliverStatus === 'loading' && <Loader />}
              {userInfo!.user &&
                userInfo!.user.is_staff &&
                orderDetails.isPaid &&
                !orderDetails.isDelivered && (
                  <ListGroup.Item>
                    <Button
                      type="button"
                      className="col-12"
                      onClick={deliverHandler}
                    >
                      Mark As Delivered
                    </Button>
                  </ListGroup.Item>
                )}
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
  return <Container>{content}</Container>;
};

export default OrderPage;
