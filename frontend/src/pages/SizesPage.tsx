/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Row, Col, Container } from 'react-bootstrap';
import { Loader } from '../components/Loader';
import { Message } from '../components/Message';
import { selectUserState } from '../slices/userSlice';
import { fetchSizes, selectSizesState } from '../slices/sizesSlice';
import { LinkContainer } from 'react-router-bootstrap';
import { deleteSize, selectSizeDeleteState } from '../slices/sizeDeleteSlice';
import {
  createSize,
  selectSizeCreateState,
  resetSizeCreateState,
} from '../slices/sizeCreateSlice';

const SizesPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { userInfo } = useAppSelector(selectUserState);
  const { sizes, status, error } = useAppSelector(selectSizesState);
  const {
    status: deleteStatus,
    error: deleteError,
    success: successDelete,
  } = useAppSelector(selectSizeDeleteState);
  const {
    size: createdSize,
    status: createStatus,
    error: createError,
  } = useAppSelector(selectSizeCreateState);

  useEffect(() => {
    if (!userInfo!.user.is_staff) {
      navigate('/login');
    }

    if (createStatus === 'succeeded') {
      navigate(`/admin/size/${createdSize._id}/edit`);
      dispatch(resetSizeCreateState());
    }

    if (createStatus === 'idle') {
      dispatch(fetchSizes());
    }
  }, [dispatch, userInfo, navigate, successDelete, createStatus, createdSize]);

  const deleteHandler = (id: number) => {
    if (window.confirm('Are you sure you want to delete this size?')) {
      const args = { id, token: userInfo!.user.token };
      dispatch(deleteSize(args));
    }
  };

  const createSizeHandler = () => {
    dispatch(createSize(userInfo!.user.token));
  };

  return (
    <Container>
      <Row className="align-items-center">
        <Col>
          <h1>Sizes</h1>
        </Col>
        <Col className="text-right">
          <Button className="my-3" onClick={createSizeHandler}>
            <i className="fas fa-plus"></i> Create Size
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
              <th>Size</th>
              <th>Surcharge</th>
              <th>Category</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {sizes!.map((size) => (
              <tr key={size._id}>
                <td>{size._id}</td>
                <td>{size.size}</td>
                <td>${size.surcharge}</td>
                <td>{size.category}</td>
                <td>
                  <LinkContainer to={`/admin/size/${size._id}/edit`}>
                    <Button variant="light" className="btn-sm">
                      <i className="fas fa-edit"></i>
                    </Button>
                  </LinkContainer>
                  <Button
                    variant="danger"
                    className="btn-sm"
                    onClick={() => deleteHandler(size._id)}
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

export default SizesPage;
