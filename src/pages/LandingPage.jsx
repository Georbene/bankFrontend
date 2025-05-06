import { Container, Row, Col, Button, Card } from "react-bootstrap"
import { Link } from "react-router-dom"
import AppNavbar from "../components/Navbar"
import { FaShieldAlt, FaMobileAlt, FaChartLine, FaCreditCard } from "react-icons/fa"
import "../styles/landing-page.css"

const LandingPage = () => {
  return (
    <>
      <AppNavbar />
      <div className="hero-section">
        <Container>
          <Row className="align-items-center">
            <Col md={6} className="hero-content">
              <h1>
                Banking Made <span className="text-success">Simple</span>
              </h1>
              <p className="lead">
                Secure, fast, and convenient online banking at your fingertips. Manage your finances with ease and
                confidence.
              </p>
              <div className="hero-buttons">
                <Button as={Link} to="/signup" variant="success" size="lg" className="me-3">
                  Get Started
                </Button>
                <Button as={Link} to="/signin" variant="outline-success" size="lg">
                  Sign In
                </Button>
              </div>
            </Col>
            <br />
            <Col md={6} className="hero-image">
              <p>Best Online Banking</p>
            </Col>
          </Row>
        </Container>
      </div>

      <section className="features-section">
        <Container>
          <h2 className="text-center mb-5">Why Choose SecureBank?</h2>
          <Row>
            <Col md={3} sm={6} className="mb-4">
              <Card className="feature-card h-100">
                <Card.Body className="text-center">
                  <div className="feature-icon">
                    <FaShieldAlt />
                  </div>
                  <Card.Title>Secure Banking</Card.Title>
                  <Card.Text>
                    Bank with confidence knowing your data is protected with state-of-the-art security.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} sm={6} className="mb-4">
              <Card className="feature-card h-100">
                <Card.Body className="text-center">
                  <div className="feature-icon">
                    <FaMobileAlt />
                  </div>
                  <Card.Title>Mobile Banking</Card.Title>
                  <Card.Text>Access your accounts anytime, anywhere with our responsive platform.</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} sm={6} className="mb-4">
              <Card className="feature-card h-100">
                <Card.Body className="text-center">
                  <div className="feature-icon">
                    <FaChartLine />
                  </div>
                  <Card.Title>Financial Insights</Card.Title>
                  <Card.Text>Track your spending and gain insights into your financial habits.</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} sm={6} className="mb-4">
              <Card className="feature-card h-100">
                <Card.Body className="text-center">
                  <div className="feature-icon">
                    <FaCreditCard />
                  </div>
                  <Card.Title>Virtual Cards</Card.Title>
                  <Card.Text>Create and manage virtual cards for secure online shopping.</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="cta-section">
        <Container>
          <Row className="justify-content-center">
            <Col md={8} className="text-center">
              <h2>Ready to experience better banking?</h2>
              <p className="lead">Join thousands of satisfied customers who have made the switch to SecureBank.</p>
              <Button as={Link} to="/signup" variant="success" size="lg" className="mt-3">
                Open an Account Today
              </Button>
            </Col>
          </Row>
        </Container>
      </section>

      <footer className="footer">
        <Container>
          <Row>
            <Col md={4}>
              <h5>SecureBank</h5>
              <p>Providing secure and innovative banking solutions since 2023.</p>
            </Col>
            <Col md={2}>
              <h5>Links</h5>
              <ul className="list-unstyled">
                <li>
                  <Link to="/">Home</Link>
                </li>
                <li>
                  <Link to="/signin">Sign In</Link>
                </li>
                <li>
                  <Link to="/signup">Sign Up</Link>
                </li>
              </ul>
            </Col>
            <Col md={3}>
              <h5>Contact</h5>
              <address>
                <p>123 Banking Street</p>
                <p>Financial District</p>
                <p>Email: support@SecureBank.com</p>
                <p>Phone: (123) 456-7890</p>
              </address>
            </Col>
            <Col md={3}>
              <h5>Legal</h5>
              <ul className="list-unstyled">
                <li>
                  <a href="#">Privacy Policy</a>
                </li>
                <li>
                  <a href="#">Terms of Service</a>
                </li>
                <li>
                  <a href="#">Cookie Policy</a>
                </li>
              </ul>
            </Col>
          </Row>
          <hr />
          <div className="text-center">
            <p>&copy; {new Date().getFullYear()} SecureBank. All rights reserved.</p>
          </div>
        </Container>
      </footer>
    </>
  )
}

export default LandingPage
