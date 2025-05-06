"use client"

import { useState, useEffect } from "react"
import { Container, Row, Col, Form, Button, Card, Alert } from "react-bootstrap"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import AppNavbar from "../components/Navbar"
import "../styles/auth.css"

const SignIn = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    // Check if there's a message from redirect (e.g., after registration)
    if (location.state?.message) {
      setSuccessMessage(location.state.message)
    }
  }, [location])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const result = await login(email, password)

      if (result.success) {
        navigate("/dashboard")
      } else {
        setError(result.message || "Invalid email or password")
      }
    } catch (err) {
      setError("Failed to sign in. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <AppNavbar />
      <Container className="auth-container">
        <Row className="justify-content-center">
          <Col md={8} lg={5}>
            <Card className="auth-card">
              <Card.Body>
                <h2 className="text-center mb-4">Sign In to Your Account</h2>

                {successMessage && <Alert variant="success">{successMessage}</Alert>}

                {error && <Alert variant="danger">{error}</Alert>}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </Form.Group>

                  <div className="d-flex justify-content-end mb-3">
                    <Link to="/forgot-password">Forgot Password?</Link>
                  </div>

                  <Button variant="success" type="submit" className="w-100" disabled={loading}>
                    {loading ? "Signing In..." : "Sign In"}
                  </Button>
                </Form>

                <div className="text-center mt-3">
                  Don't have an account? <Link to="/signup">Sign Up</Link>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default SignIn
