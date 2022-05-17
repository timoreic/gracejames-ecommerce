import { useState, useEffect, SyntheticEvent, Fragment } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Container } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { Message } from '../components/Message';
import { Loader } from '../components/Loader';
import { FormContainer } from '../components/FormContainer';
import {
  fetchSize,
  resetSizeState,
  selectSizeState,
} from '../slices/sizeSlice';
import {
  updateSize,
  selectSizeUpdateState,
  resetSizeUpdateState,
} from '../slices/sizeUpdateSlice';
import { selectUserState } from '../slices/userSlice';

function SizeEditPage() {
  const { id: sizeId } = useParams();

  const [size, setSize] = useState('');
  const [surcharge, setSurcharge] = useState(0);
  const [category, setCategory] = useState('');

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { error, status, sizeDetails } = useAppSelector(selectSizeState);
  const { error: errorUpdate, status: statusUpdate } = useAppSelector(
    selectSizeUpdateState
  );
  const { userInfo } = useAppSelector(selectUserState);

  useEffect(() => {
    if (statusUpdate === 'succeeded') {
      dispatch(resetSizeUpdateState());
      dispatch(resetSizeState());
      navigate('/admin/sizes');
    } else {
      if (sizeDetails._id !== Number(sizeId)) {
        dispatch(fetchSize(sizeId!));
      } else {
        setSize(sizeDetails.size);
        setSurcharge(sizeDetails.surcharge);
        setCategory(sizeDetails.category);
      }
    }
  }, [dispatch, sizeDetails, sizeId, statusUpdate, navigate]);

  const submitHandler = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(
      updateSize({
        size: {
          _id: Number(sizeId!),
          size,
          surcharge,
          category,
        },
        token: userInfo!.user.token,
      })
    );
  };

  return (
    <Container>
      <Link to="/admin/sizes">Go Back</Link>

      <FormContainer>
        <h1>Edit Size</h1>

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
            <Form.Group controlId="size">
              <Form.Label>Size</Form.Label>
              <Form.Control
                type="name"
                placeholder="Enter size"
                value={size}
                onChange={(e) => setSize(e.target.value)}
                required
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="surcharge" className="pt-3">
              <Form.Label>Surcharge</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter surcharge amount"
                value={surcharge}
                onChange={(e) => setSurcharge(Number(e.target.value))}
              ></Form.Control>
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

            <Button type="submit" variant="primary" className="mt-4">
              Update
            </Button>
          </Form>
        )}
      </FormContainer>
    </Container>
  );
}

export default SizeEditPage;
