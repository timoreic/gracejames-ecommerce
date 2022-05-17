import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { useNavigate } from 'react-router-dom';
import { Button, Table, Container } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { selectUserState } from '../slices/userSlice';
import {
  selectOrdersUserState,
  fetchUserOrders,
} from '../slices/ordersUserSlice';
import { Loader } from '../components/Loader';
import { Message } from '../components/Message';

const MyOrdersPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { userInfo, status } = useAppSelector(selectUserState);
  const {
    orders,
    status: ordersStatus,
    error: ordersError,
  } = useAppSelector(selectOrdersUserState);

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    } else {
      dispatch(fetchUserOrders(userInfo.user.token));
    }
  }, [navigate, userInfo, dispatch, status]);

  return (
    <Container>
      <h1>My Orders</h1>
      {ordersStatus === 'loading' ? (
        <Loader />
      ) : ordersError ? (
        <Message variant="danger">{ordersError}</Message>
      ) : (
        <Table striped responsive className="table-sm my-2">
          <thead>
            <tr>
              <th>ID</th>
              <th>Date</th>
              <th>Total</th>
              <th>Paid</th>
              <th>Delivered</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.createdAt!.substring(0, 10)}</td>
                <td>${order.totalPrice}</td>
                <td>
                  {order.isPaid ? (
                    order.paidAt!.substring(0, 10)
                  ) : (
                    <i className="fas fa-times" style={{ color: 'red' }}></i>
                  )}
                </td>
                <td>
                  {order.isDelivered ? (
                    order.deliveredAt!.substring(0, 10)
                  ) : (
                    <i className="fas fa-times" style={{ color: 'red' }}></i>
                  )}
                </td>
                <td>
                  <LinkContainer to={`/order/${order._id}`}>
                    <Button className="btn-sm">Details</Button>
                  </LinkContainer>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default MyOrdersPage;
