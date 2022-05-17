import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Container } from 'react-bootstrap';
import { Loader } from '../components/Loader';
import { Message } from '../components/Message';
import { selectUserState } from '../slices/userSlice';
import { fetchAllOrders, selectOrdersAllState } from '../slices/ordersAllSlice';
import { LinkContainer } from 'react-router-bootstrap';

const OrdersPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { userInfo } = useAppSelector(selectUserState);
  const { orders, status, error } = useAppSelector(selectOrdersAllState);

  useEffect(() => {
    if (userInfo && userInfo.user.is_staff) {
      dispatch(fetchAllOrders(userInfo!.user.token));
    } else {
      navigate('/login');
    }
  }, [dispatch, userInfo, navigate]);

  return (
    <Container>
      <h1>Orders</h1>
      {status === 'loading' ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Table striped bordered hover responsive className="table-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Date</th>
              <th>Paid</th>
              <th>Delivered</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {orders!.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>
                  {order.user &&
                    order.user.first_name + ' ' + order.user.last_name}
                </td>
                <td>{order.createdAt?.substring(0, 10)}</td>
                <td>{order.totalPrice}</td>
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

export default OrdersPage;
