import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { Row, Col, Container } from 'react-bootstrap';

import Product from '../components/Product';
import { Loader } from '../components/Loader';
import { Message } from '../components/Message';

import { fetchProducts, selectProductsState } from '../slices/productsSlice';

const PrintsPage = () => {
  const dispatch = useAppDispatch();
  const { productList, status, error } = useAppSelector(selectProductsState);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts());
    }
  }, [status, dispatch]);

  let content;
  if (status === 'loading') {
    content = <Loader text="Loading Products..." />;
  } else if (status === 'failed') {
    content = <Message variant="danger">{error!}</Message>;
  } else if (status === 'succeeded') {
    content = (
      <Row>
        {productList.map((product) => (
          <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
            <Product product={product} />
          </Col>
        ))}
      </Row>
    );
  }

  return (
    <Container>
      <h1>Prints</h1>
      {content}
    </Container>
  );
};

export default PrintsPage;
