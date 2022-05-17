/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Row, Col, Container } from 'react-bootstrap';
import { Loader } from '../components/Loader';
import { Message } from '../components/Message';
import { selectUserState } from '../slices/userSlice';
import { fetchProducts, selectProductsState } from '../slices/productsSlice';
import { LinkContainer } from 'react-router-bootstrap';
import {
  deleteProduct,
  selectProductDeleteState,
} from '../slices/productDeleteSlice';
import {
  createProduct,
  selectProductCreateState,
  resetProductCreateState,
} from '../slices/productCreateSlice';

const ProductsPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { userInfo } = useAppSelector(selectUserState);
  const { productList, status, error } = useAppSelector(selectProductsState);
  const {
    status: deleteStatus,
    error: deleteError,
    success: successDelete,
  } = useAppSelector(selectProductDeleteState);
  const {
    product: createdProduct,
    status: createStatus,
    error: createError,
  } = useAppSelector(selectProductCreateState);

  useEffect(() => {
    if (!userInfo!.user.is_staff) {
      navigate('/login');
    }

    if (createStatus === 'succeeded') {
      navigate(`/admin/product/${createdProduct._id}/edit`);
      dispatch(resetProductCreateState());
    }

    if (createStatus === 'idle') {
      dispatch(fetchProducts());
    }
  }, [
    dispatch,
    userInfo,
    navigate,
    successDelete,
    createStatus,
    createdProduct,
  ]);

  const deleteHandler = (id: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      const args = { id, token: userInfo!.user.token };
      dispatch(deleteProduct(args));
    }
  };

  const createProductHandler = () => {
    dispatch(createProduct(userInfo!.user.token));
  };

  return (
    <Container>
      <Row className="align-items-center">
        <Col>
          <h1>Products</h1>
        </Col>
        <Col className="text-right">
          <Button className="my-3" onClick={createProductHandler}>
            <i className="fas fa-plus"></i> Create Product
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
              <th>Name</th>
              <th>Price</th>
              <th>Category</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {productList!.map((product) => (
              <tr key={product._id}>
                <td>{product._id}</td>
                <td>{product.name}</td>
                <td>${product.baseprice}</td>
                <td>{product.category}</td>
                <td>
                  <LinkContainer to={`/admin/product/${product._id}/edit`}>
                    <Button variant="light" className="btn-sm">
                      <i className="fas fa-edit"></i>
                    </Button>
                  </LinkContainer>
                  <Button
                    variant="danger"
                    className="btn-sm"
                    onClick={() => deleteHandler(product._id)}
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

export default ProductsPage;
