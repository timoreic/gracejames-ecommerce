import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Container } from 'react-bootstrap';
import { Loader } from '../components/Loader';
import { Message } from '../components/Message';
import { selectUserState } from '../slices/userSlice';
import { fetchUsers, selectUsersState } from '../slices/usersSlice';
import { deleteUser, selectUserDeleteState } from '../slices/userDeleteSlice';

const UsersPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { userInfo } = useAppSelector(selectUserState);
  const { users, status, error } = useAppSelector(selectUsersState);
  const { status: deleteUserStatus } = useAppSelector(selectUserDeleteState);

  useEffect(() => {
    if (userInfo && userInfo.user.is_staff) {
      dispatch(fetchUsers(userInfo!.user.token));
    } else {
      navigate('/login');
    }
  }, [dispatch, userInfo, navigate, deleteUserStatus]);

  const deleteHandler = (id: number) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      const args = { id, token: userInfo!.user.token };
      dispatch(deleteUser(args));
    }
  };

  return (
    <Container>
      <h1>Users</h1>
      {status === 'loading' ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Table striped bordered hover responsive className="table-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Admin</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {users!.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.first_name}</td>
                <td>{user.last_name}</td>
                <td>{user.email}</td>
                <td>
                  {user.is_staff ? (
                    <i className="fas fa-check" style={{ color: 'green' }}></i>
                  ) : (
                    <i className="fas fa-times" style={{ color: 'red' }}></i>
                  )}
                </td>
                <td>
                  <Button
                    variant="danger"
                    className="btn-sm"
                    onClick={() => deleteHandler(user.id)}
                  >
                    <i className="fas fa-trash"></i>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default UsersPage;
