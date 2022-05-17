import { useEffect } from 'react';
import { Carousel, Container, Image } from 'react-bootstrap';
import { useAppSelector, useAppDispatch } from '../app/hooks';

import { Loader } from '../components/Loader';
import { Message } from '../components/Message';

import { fetchDisplays, selectDisplaysState } from '../slices/displaysSlice';

const HomePage = () => {
  const dispatch = useAppDispatch();
  const { displays, status, error } = useAppSelector(selectDisplaysState);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchDisplays());
    }
  }, [status, dispatch]);

  let content;
  if (status === 'loading') {
    content = <Loader />;
  } else if (status === 'failed') {
    content = <Message variant="danger">{error!}</Message>;
  } else if (status === 'succeeded') {
    content = (
      <Carousel
        fade
        variant="dark"
        controls={false}
        indicators={false}
        pause={false}
      >
        {displays.map((display) => (
          <Carousel.Item className="carousel-item">
            <Image
              className="d-block mx-auto carousel-image mt-4 mt-lg-0"
              src={display.image}
              alt={display.name}
              fluid
              rounded
            />
          </Carousel.Item>
        ))}
      </Carousel>
    );
  }

  return (
    <Container>
      <h1 className="text-center pb-4 pt-0" id="welcome">
        Grace James
      </h1>
      <div className="vw-80 vh-80 d-flex justify-content-center">{content}</div>
    </Container>
  );
};

export default HomePage;
