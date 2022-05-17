import { useState, useEffect, SyntheticEvent, Fragment } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col, Container } from 'react-bootstrap';

import { selectUserState, userRegister } from '../slices/userSlice';
import { Loader } from '../components/Loader';
import { Message } from '../components/Message';
import { FormContainer } from '../components/FormContainer';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const [message, setMessage] = useState('');

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { userInfo, status, error } = useAppSelector(selectUserState);
  const redirect = location.search ? location.search.split('=')[1] : '/';

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, userInfo, redirect]);

  const submitHandler = (e: SyntheticEvent) => {
    e.preventDefault();
    const args = {
      email: email,
      first_name: first_name,
      last_name: last_name,
      password1: password1,
      password2: password2,
    };
    if (password1 !== password2) {
      setMessage('Passwords do not match');
    } else {
      dispatch(userRegister(args));
    }
  };

  return (
    <Container>
      <FormContainer>
        <h1>Register</h1>
        {message! && <Message variant="danger">{message!}</Message>}
        {error! && <Message variant="danger">{error!}</Message>}
        {status === 'loading' ? <Loader /> : <Fragment></Fragment>}
        <Form onSubmit={submitHandler}>
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

          <Button className="my-3" type="submit" variant="primary">
            Register
          </Button>

          <Row className="py-3">
            <Col>
              Have an Account?{' '}
              <Link to={redirect ? `/login?redirect=${redirect}` : '/login'}>
                Sign In
              </Link>
            </Col>
          </Row>
        </Form>
      </FormContainer>
    </Container>
  );
};

export default RegisterPage;
