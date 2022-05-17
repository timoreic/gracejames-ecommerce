import { useState, SyntheticEvent } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container } from 'react-bootstrap';
import { FormContainer } from '../components/FormContainer';
import { CheckoutSteps } from '../components/CheckoutSteps';
import {
  saveShippingAddress,
  selectShippingAddressState,
} from '../slices/shippingAddressSlice';

const ShippingPage = () => {
  const { shippingAddress } = useAppSelector(selectShippingAddressState);
  const [address, setAddress] = useState(shippingAddress.address);
  const [city, setCity] = useState(shippingAddress.city);
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode);
  const [state, setState] = useState(shippingAddress.state);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const submitHandler = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(saveShippingAddress({ address, city, postalCode, state }));
    navigate('/placeorder');
  };

  return (
    <Container>
      <FormContainer>
        <CheckoutSteps step1 step2 />
        <h1>Shipping</h1>
        <Form onSubmit={submitHandler}>
          <Form.Group className="my-3" controlId="address">
            <Form.Label>Address</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter address"
              value={address ? address : ''}
              onChange={(e) => setAddress(e.target.value)}
              required
            ></Form.Control>
          </Form.Group>

          <Form.Group className="my-3" controlId="city">
            <Form.Label>City</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter city"
              value={city ? city : ''}
              onChange={(e) => setCity(e.target.value)}
              required
            ></Form.Control>
          </Form.Group>

          <Form.Group className="my-3" controlId="postalCode">
            <Form.Label>Postal Code</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter address"
              value={postalCode ? postalCode : ''}
              onChange={(e) => setPostalCode(e.target.value)}
              required
            ></Form.Control>
          </Form.Group>

          <Form.Group className="my-3" controlId="state">
            <Form.Label>State</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter State"
              value={state ? state : ''}
              onChange={(e) => setState(e.target.value)}
              required
            ></Form.Control>
          </Form.Group>

          <Button type="submit" variant="primary">
            Continue
          </Button>
        </Form>
      </FormContainer>
    </Container>
  );
};

export default ShippingPage;
