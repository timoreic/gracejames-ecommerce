/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Row, Col, Container } from 'react-bootstrap';
import { Loader } from '../components/Loader';
import { Message } from '../components/Message';
import { LinkContainer } from 'react-router-bootstrap';
import { selectUserState } from '../slices/userSlice';
import { fetchMaterials, selectMaterialsState } from '../slices/materialsSlice';
import {
  deleteMaterial,
  selectMaterialDeleteState,
} from '../slices/materialDeleteSlice';
import {
  createMaterial,
  selectMaterialCreateState,
  resetMaterialCreateState,
} from '../slices/materialCreateSlice';

const MaterialsPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { userInfo } = useAppSelector(selectUserState);
  const { materials, status, error } = useAppSelector(selectMaterialsState);
  const {
    status: deleteStatus,
    error: deleteError,
    success: successDelete,
  } = useAppSelector(selectMaterialDeleteState);
  const {
    material: createdMaterial,
    status: createStatus,
    error: createError,
  } = useAppSelector(selectMaterialCreateState);

  useEffect(() => {
    if (!userInfo!.user.is_staff) {
      navigate('/login');
    }

    if (createStatus === 'succeeded') {
      navigate(`/admin/material/${createdMaterial._id}/edit`);
      dispatch(resetMaterialCreateState());
    }

    if (createStatus === 'idle') {
      dispatch(fetchMaterials());
    }
  }, [
    dispatch,
    userInfo,
    navigate,
    successDelete,
    createStatus,
    createdMaterial,
  ]);

  const deleteHandler = (id: number) => {
    if (window.confirm('Are you sure you want to delete this material?')) {
      const args = { id, token: userInfo!.user.token };
      dispatch(deleteMaterial(args));
    }
  };

  const createMaterialHandler = () => {
    dispatch(createMaterial(userInfo!.user.token));
  };

  return (
    <Container>
      <Row className="align-items-center">
        <Col>
          <h1>Materials</h1>
        </Col>
        <Col className="text-right">
          <Button className="my-3" onClick={createMaterialHandler}>
            <i className="fas fa-plus"></i> Create Material
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
              <th>Material</th>
              <th>Surcharge</th>
              <th>Category</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {materials!.map((material) => (
              <tr key={material._id}>
                <td>{material._id}</td>
                <td>{material.material}</td>
                <td>${material.surcharge}</td>
                <td>{material.category}</td>
                <td>
                  <LinkContainer to={`/admin/material/${material._id}/edit`}>
                    <Button variant="light" className="btn-sm">
                      <i className="fas fa-edit"></i>
                    </Button>
                  </LinkContainer>
                  <Button
                    variant="danger"
                    className="btn-sm"
                    onClick={() => deleteHandler(material._id)}
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

export default MaterialsPage;
