import { useState, useEffect, SyntheticEvent, Fragment } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col, Container } from 'react-bootstrap';
import { selectUserState, userUpdate } from '../slices/userSlice';
import { Loader } from '../components/Loader';
import { Message } from '../components/Message';

const ProfilePage = () => {
  const [email, setEmail] = useState('');
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { userInfo, status, error } = useAppSelector(selectUserState);

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    } else {
      setEmail(userInfo.user.email);
      setFirstName(userInfo.user.first_name);
      setLastName(userInfo.user.last_name);
    }
  }, [navigate, userInfo, dispatch, status]);

  const submitHandler = (e: SyntheticEvent) => {
    e.preventDefault();
    const args = {
      email: email,
      first_name: first_name,
      last_name: last_name,
      password1: password1,
      password2: password2,
      token: userInfo!.user.token,
    };
    if (password1 !== password2) {
      setErrorMessage('Passwords do not match');
    } else {
      dispatch(userUpdate(args));
      setErrorMessage('');
      setSuccessMessage('Profile updated successfully');
    }
  };

  return (
    <Container>
      <h1>User Profile</h1>
      <Row>
        <Col md="6">
          {errorMessage! && <Message variant="danger">{errorMessage!}</Message>}
          {successMessage! && (
            <Message variant="success">{successMessage!}</Message>
          )}
          {error! && <Message variant="danger">{error!}</Message>}
          {status === 'loading' ? <Loader /> : <Fragment></Fragment>}
        </Col>
      </Row>
      <Form onSubmit={submitHandler}>
        <Row>
          <Col md="6">
            <Form.Group className="my-3" controlId="email">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              ></Form.Control>
            </Form.Group>

            <Form.Group className="my-3" controlId="first_name">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="name"
                placeholder="Enter first name"
                value={first_name}
                onChange={(e) => setFirstName(e.target.value)}
                required
              ></Form.Control>
            </Form.Group>

            <Form.Group className="my-3" controlId="last_name">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="name"
                placeholder="Enter last name"
                value={last_name}
                onChange={(e) => setLastName(e.target.value)}
                required
              ></Form.Control>
            </Form.Group>

            <Button className="my-3" type="submit" variant="primary">
              Update
            </Button>
          </Col>

          <Col md="6">
            <Form.Group className="my-3" controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                value={password1}
                onChange={(e) => setPassword1(e.target.value)}
                required
              ></Form.Control>
            </Form.Group>

            <Form.Group className="my-3" controlId="confirmPassword">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm password"
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
                required
              ></Form.Control>
            </Form.Group>
          </Col>
        </Row>
      </Form>
    </Container>
  );
};

export default ProfilePage;
