import {
  useState,
  useEffect,
  SyntheticEvent,
  Fragment,
  ChangeEvent,
} from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Container } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { Message } from '../components/Message';
import { Loader } from '../components/Loader';
import { FormContainer } from '../components/FormContainer';
import {
  fetchDisplay,
  resetDisplayState,
  selectDisplayState,
} from '../slices/displaySlice';
import {
  updateDisplay,
  selectDisplayUpdateState,
  resetDisplayUpdateState,
} from '../slices/displayUpdateSlice';
import { selectUserState } from '../slices/userSlice';
import axios from 'axios';

function DisplayEditPage() {
  const { id: displayId } = useParams();

  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [uploading, setUploading] = useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const {
    error,
    status,
    displayDetails: display,
  } = useAppSelector(selectDisplayState);
  const { error: errorUpdate, status: statusUpdate } = useAppSelector(
    selectDisplayUpdateState
  );
  const { userInfo } = useAppSelector(selectUserState);

  useEffect(() => {
    if (statusUpdate === 'succeeded') {
      dispatch(resetDisplayUpdateState());
      dispatch(resetDisplayState());
      navigate('/admin/displays');
    } else {
      if (display._id !== Number(displayId)) {
        dispatch(fetchDisplay(displayId!));
      } else {
        setName(display.name);
        setImage(display.image);
      }
    }
  }, [dispatch, display, statusUpdate, navigate, displayId]);

  const submitHandler = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(
      updateDisplay({
        display: {
          _id: Number(displayId!),
          name,
          image,
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
    formData.append('display_id', displayId!);

    setUploading(true);

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };
      const { data } = await axios.post(
        '/api/displays/upload/',
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
      <Link to="/admin/displays">Go Back</Link>

      <FormContainer>
        <h1>Edit Display</h1>

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

            <Button type="submit" variant="primary" className="mt-4">
              Update
            </Button>
          </Form>
        )}
      </FormContainer>
    </Container>
  );
}

export default DisplayEditPage;
