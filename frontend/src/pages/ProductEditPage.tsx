import {
  useState,
  useEffect,
  SyntheticEvent,
  Fragment,
  ChangeEvent,
} from 'react';
import axios from 'axios';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Container } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { Message } from '../components/Message';
import { Loader } from '../components/Loader';
import { FormContainer } from '../components/FormContainer';
import {
  fetchProduct,
  resetProductState,
  selectProductState,
} from '../slices/productSlice';
import {
  updateProduct,
  selectProductUpdateState,
  resetProductUpdateState,
} from '../slices/productUpdateSlice';
import { selectUserState } from '../slices/userSlice';

function ProductEditPage() {
  const { id: productId } = useParams();

  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const {
    error,
    status,
    productDetails: product,
  } = useAppSelector(selectProductState);
  const { error: errorUpdate, status: statusUpdate } = useAppSelector(
    selectProductUpdateState
  );
  const { userInfo } = useAppSelector(selectUserState);

  useEffect(() => {
    if (statusUpdate === 'succeeded') {
      dispatch(resetProductUpdateState());
      dispatch(resetProductState());
      navigate('/admin/products');
    } else {
      if (product._id !== Number(productId)) {
        dispatch(fetchProduct(productId!));
      } else {
        setName(product.name);
        setPrice(product.baseprice);
        setImage(product.image);
        setCategory(product.category);
        setDescription(product.description);
      }
    }
  }, [dispatch, product, productId, statusUpdate, navigate]);

  const submitHandler = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(
      updateProduct({
        product: {
          _id: Number(productId!),
          name,
          baseprice: price,
          image,
          category,
          description,
        },
        token: userInfo!.user.token,
      })
    );
  };

  const uploadFileHandler = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const file = e.target.files[0];
    const formData = new FormData();

    formData.append('image', file);
    formData.append('product_id', productId!);

    setUploading(true);

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };
      const { data } = await axios.post(
        '/api/products/upload/',
        formData,
        config
      );
      setImage(data);
      setUploading(false);
    } catch (error) {
      setUploading(false);
    }
  };

  return (
    <Container>
      <Link to="/admin/products">Go Back</Link>

      <FormContainer>
        <h1>Edit Product</h1>

        {statusUpdate === 'loading' ? <Loader /> : <Fragment />}
        {errorUpdate ? (
          <Message variant="danger">{errorUpdate}</Message>
        ) : (
          <Fragment />
        )}

        {status === 'loading' ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="name"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="price" className="pt-3">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter price"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="image" className="pt-3">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter image"
                value={image}
                onChange={(e) => setImage(e.target.value)}
              ></Form.Control>

              <Form.Control type="file" onChange={uploadFileHandler} />
              {uploading && <Loader />}
            </Form.Group>

            <Form.Group controlId="category" className="pt-3">
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="description" className="pt-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Button type="submit" variant="primary" className="mt-4">
              Update
            </Button>
          </Form>
        )}
      </FormContainer>
    </Container>
  );
}

export default ProductEditPage;
