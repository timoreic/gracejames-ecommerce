/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, SyntheticEvent, Fragment } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';

import { selectUserState, userLogin } from '../slices/userSlice';
import { Loader } from '../components/Loader';
import { Message } from '../components/Message';
import { FormContainer } from '../components/FormContainer';

import { resetError } from '../slices/userSlice';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { userInfo, status, error } = useAppSelector(selectUserState);
  const redirect = location.search ? location.search.split('=')[1] : '/';

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
    dispatch(resetError());
  }, [navigate, userInfo, redirect]);

  const submitHandler = (e: SyntheticEvent) => {
    e.preventDefault();
    const args = {
      email: email,
      password: password,
    };
    dispatch(userLogin(args));
  };

  return (
    <Container>
      <FormContainer>
        <h1>Sign In</h1>
        {error! && <Message variant="danger">{error!}</Message>}
        {status! === 'loading' ? <Loader /> : <Fragment></Fragment>}
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

          <Form.Group className="my-3" controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            ></Form.Control>
          </Form.Group>

          <Button className="my-3" type="submit" variant="primary">
            Sign In
          </Button>
        </Form>

        <Row className="py-3">
          <Col>
            New Customer?{' '}
            <Link
              to={redirect ? `/register?redirect=${redirect}` : '/register'}
            >
              Register
            </Link>
          </Col>
        </Row>
      </FormContainer>
    </Container>
  );
};

export default LoginPage;
