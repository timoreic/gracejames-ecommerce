/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Row, Col, Container } from 'react-bootstrap';
import { Loader } from '../components/Loader';
import { Message } from '../components/Message';
import { LinkContainer } from 'react-router-bootstrap';
import { selectUserState } from '../slices/userSlice';
import { fetchDisplays, selectDisplaysState } from '../slices/displaysSlice';
import {
  deleteDisplay,
  selectDisplayDeleteState,
} from '../slices/displayDeleteSlice';
import {
  createDisplay,
  selectDisplayCreateState,
  resetDisplayCreateState,
} from '../slices/displayCreateSlice';

const DisplaysPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { userInfo } = useAppSelector(selectUserState);
  const { displays, status, error } = useAppSelector(selectDisplaysState);
  const {
    status: deleteStatus,
    error: deleteError,
    success: successDelete,
  } = useAppSelector(selectDisplayDeleteState);
  const {
    display: createdDisplay,
    status: createStatus,
    error: createError,
  } = useAppSelector(selectDisplayCreateState);

  useEffect(() => {
    if (!userInfo!.user.is_staff) {
      navigate('/login');
    }

    if (createStatus === 'succeeded') {
      navigate(`/admin/display/${createdDisplay._id}/edit`);
      dispatch(resetDisplayCreateState());
    }

    if (createStatus === 'idle') {
      dispatch(fetchDisplays());
    }
  }, [
    dispatch,
    userInfo,
    navigate,
    successDelete,
    createStatus,
    createdDisplay,
  ]);

  const deleteHandler = (id: number) => {
    if (window.confirm('Are you sure you want to delete this display?')) {
      const args = { id, token: userInfo!.user.token };
      dispatch(deleteDisplay(args));
    }
  };

  const createDisplayHandler = () => {
    dispatch(createDisplay(userInfo!.user.token));
  };

  return (
    <Container>
      <Row className="align-items-center">
        <Col>
          <h1>Displays</h1>
        </Col>
        <Col className="text-right">
          <Button className="my-3" onClick={createDisplayHandler}>
            <i className="fas fa-plus"></i> Create Display
          </Button>
        </Col>
      </Row>

      {deleteStatus === 'loading' && <Loader />}
      {deleteError && <Message variant="danger">{deleteError}</Message>}

      {createStatus === 'loading' && <Loader />}
      {createError && <Message variant="danger">{createError}</Message>}

      {status === 'loading' ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Table striped bordered hover responsive className="table-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>Display</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {displays!.map((display) => (
              <tr key={display._id}>
                <td>{display._id}</td>
                <td>{display.name}</td>
                <td>
                  <LinkContainer to={`/admin/display/${display._id}/edit`}>
                    <Button variant="light" className="btn-sm">
                      <i className="fas fa-edit"></i>
                    </Button>
                  </LinkContainer>
                  <Button
                    variant="danger"
                    className="btn-sm"
                    onClick={() => deleteHandler(display._id)}
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

export default DisplaysPage;
