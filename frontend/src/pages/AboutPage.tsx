import { Container, Row, Col, Image } from 'react-bootstrap';

const AboutPage = () => {
  return (
    <Container>
      <h1>About Me</h1>
      <Row>
        <Col lg="7">
          <p className="mt-4 mt-lg-0">
            After graduating from Photography Studies College, Melbourne,
            Australia in 2012, it took me ten years to realise what kind of
            photographer I aspired to be, through a lot of trial and error I
            realised I wanted to make a greater impact. I wanted to photograph
            the reality, the truth, the beauty of our natural world & of course
            the devastation.
          </p>
          <p>
            My passion for photography has now grown into a passion for the
            environment and conservation working alongside organisations such as
            sea shepherd & 4 ocean.
          </p>
          <p>
            I’ve roamed my own backyard, Australia for the last 12 months, spent
            a lot of time travelling the globe, backpacking through South East
            Asia, India, Europe, Central America, island hopping in the tropics
            following my photographic instincts with little more than a backpack
            and camera of sorts. I have a lot of plans which have been put on
            hold at this current time, however it’s given me a chance to
            photograph my new home, Margaret River, Western Australia.
          </p>
          <p>
            I am so excited to open a fresh, progressive chapter in the story of
            climate change, and not only the effects on landscapes but on human
            face as well…. All in the name of visual storytelling.
          </p>
          <p>
            My aim is to create awareness and inspire action for global issues
            like climate change and social welfare.
          </p>
          <p>
            When you choose to purchase one of my prints, 15% of the profits
            will go towards Marine Conservation Australia.
          </p>
        </Col>
        <Col lg="5">
          <Image
            className="mt-1"
            src="https://gracejames.s3.ap-southeast-2.amazonaws.com/Profile.jpeg"
            alt="Grace"
            rounded
            fluid
          />
        </Col>
      </Row>
    </Container>
  );
};

export default AboutPage;
