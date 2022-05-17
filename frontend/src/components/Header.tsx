import { Fragment } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { selectUserState, logout } from '../slices/userSlice';
import { resetOrdersUserState } from '../slices/ordersUserSlice';

const Header = () => {
  const dispatch = useAppDispatch();
  const { userInfo } = useAppSelector(selectUserState);

  const logoutHandler = () => {
    dispatch(logout());
    dispatch(resetOrdersUserState());
  };

  return (
    <header>
      <Navbar bg="light" expand="lg" className="border-0" collapseOnSelect>
        <Container className="border-0 pt-2">
          <LinkContainer to="/">
            <Navbar.Brand>GraceCJames</Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <LinkContainer to="/prints">
                <Nav.Link>Prints</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/about">
                <Nav.Link>About</Nav.Link>
              </LinkContainer>
            </Nav>
            <Nav className="mr-auto mt-4 mt-md-0">
              {userInfo ? (
                <NavDropdown
                  title={
                    userInfo.user.first_name ? userInfo.user.first_name : 'User'
                  }
                  id="first_name"
                >
                  <LinkContainer to="/profile">
                    <NavDropdown.Item>Profile</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/myorders">
                    <NavDropdown.Item>My Orders</NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Item onClick={logoutHandler}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <LinkContainer to="/login">
                  <Nav.Link>
                    <i className="fas fa-user"></i> Login
                  </Nav.Link>
                </LinkContainer>
              )}

              {userInfo && userInfo!.user.is_staff ? (
                <NavDropdown title="Admin" id="adminmenu">
                  <LinkContainer to="/admin/users">
                    <NavDropdown.Item>Users</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/admin/orders">
                    <NavDropdown.Item>Orders</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/admin/products">
                    <NavDropdown.Item>Products</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/admin/sizes">
                    <NavDropdown.Item>Sizes</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/admin/materials">
                    <NavDropdown.Item>Materials</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/admin/displays">
                    <NavDropdown.Item>Displays</NavDropdown.Item>
                  </LinkContainer>
                </NavDropdown>
              ) : (
                <Fragment />
              )}
              <LinkContainer to="/cart">
                <Nav.Link>
                  <i className="fas fa-shopping-cart"></i> Cart
                </Nav.Link>
              </LinkContainer>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
