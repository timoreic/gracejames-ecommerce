import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import type { ProductProps } from '../types/ProductTypes';

const Product = ({ product }: ProductProps) => {
  return (
    <Card className="my-3 p-3 rounded">
      <Link to={`/product/${product._id}`}>
        <Card.Img src={product.image} />
      </Link>
      <Card.Body className="px-0 pt-3 pb-1">
        <h5 className="w-100 text-center">{product.name}</h5>
        <Link
          className="d-flex justify-content-center"
          to={`/product/${product._id}`}
        >
          <Button className="btn">Show Details</Button>
        </Link>
      </Card.Body>
    </Card>
  );
};

export default Product;
