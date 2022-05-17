import { useState, useEffect, SyntheticEvent, Fragment } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Container } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { Message } from '../components/Message';
import { Loader } from '../components/Loader';
import { FormContainer } from '../components/FormContainer';
import {
  fetchMaterial,
  resetMaterialState,
  selectMaterialState,
} from '../slices/materialSlice';
import {
  updateMaterial,
  selectMaterialUpdateState,
  resetMaterialUpdateState,
} from '../slices/materialUpdateSlice';
import { selectUserState } from '../slices/userSlice';

function MaterialEditPage() {
  const { id: materialId } = useParams();

  const [material, setMaterial] = useState('');
  const [surcharge, setSurcharge] = useState(0);
  const [category, setCategory] = useState('');

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { error, status, materialDetails } =
    useAppSelector(selectMaterialState);
  const { error: errorUpdate, status: statusUpdate } = useAppSelector(
    selectMaterialUpdateState
  );
  const { userInfo } = useAppSelector(selectUserState);

  useEffect(() => {
    if (statusUpdate === 'succeeded') {
      dispatch(resetMaterialUpdateState());
      dispatch(resetMaterialState());
      navigate('/admin/materials');
    } else {
      if (materialDetails._id !== Number(materialId)) {
        dispatch(fetchMaterial(materialId!));
      } else {
        setMaterial(materialDetails.material);
        setSurcharge(materialDetails.surcharge);
        setCategory(materialDetails.category);
      }
    }
  }, [dispatch, materialDetails, materialId, statusUpdate, navigate]);

  const submitHandler = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(
      updateMaterial({
        material: {
          _id: Number(materialId!),
          material,
          surcharge,
          category,
        },
        token: userInfo!.user.token,
      })
    );
  };

  return (
    <Container>
      <Link to="/admin/materials">Go Back</Link>

      <FormContainer>
        <h1>Edit Material</h1>

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
            <Form.Group controlId="material">
              <Form.Label>Material</Form.Label>
              <Form.Control
                type="name"
                placeholder="Enter material"
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
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

export default MaterialEditPage;
