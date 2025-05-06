"use client"

import { useState } from "react"
import { Container, Row, Col, Card, Form, Button, Alert } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import AppNavbar from "../components/Navbar"
import "../styles/create-pin.css"

const CreatePin = () => {
  const [pin, setPin] = useState("")
  const [confirmPin, setConfirmPin] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)

  const { createPin } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    // Validate PIN
    if (pin.length !== 4 || isNaN(Number(pin))) {
      setError("PIN must be a 4-digit number")
      return
    }

    if (pin !== confirmPin) {
      setError("PINs do not match")
      return
    }

    setLoading(true)

    try {
      const result = await createPin(pin)

      if (result.success) {
        setSuccess("PIN created successfully!")
        // Redirect to dashboard after a short delay
        setTimeout(() => {
          navigate("/dashboard")
        }, 2000)
      } else {
        setError(result.message)
      }
    } catch (error) {
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <AppNavbar />
      <Container className="create-pin-container">
        <Row className="justify-content-center">
          <Col md={6}>
            <Card className="create-pin-card">
              <Card.Body>
                <h2 className="text-center mb-4">Create Your PIN</h2>
                <p className="text-center text-muted mb-4">
                  Your PIN will be used to authorize transactions from your account. Please choose a secure 4-digit PIN
                  that you can remember.
                </p>

                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">{success}</Alert>}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-4">
                    <Form.Label>Enter PIN</Form.Label>
                    <Form.Control
                      type="password"
                      value={pin}
                      onChange={(e) => setPin(e.target.value)}
                      maxLength={4}
                      placeholder="Enter 4-digit PIN"
                      required
                      className="pin-input"
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>Confirm PIN</Form.Label>
                    <Form.Control
                      type="password"
                      value={confirmPin}
                      onChange={(e) => setConfirmPin(e.target.value)}
                      maxLength={4}
                      placeholder="Confirm 4-digit PIN"
                      required
                      className="pin-input"
                    />
                  </Form.Group>

                  <div className="pin-security-tips mb-4">
                    <h5>Security Tips:</h5>
                    <ul>
                      <li>Do not use sequential numbers (e.g., 1234)</li>
                      <li>Avoid using your birth year or date</li>
                      <li>Never share your PIN with anyone</li>
                      <li>Do not use the same PIN for multiple accounts</li>
                    </ul>
                  </div>

                  <Button variant="success" type="submit" className="w-100" disabled={loading}>
                    {loading ? "Creating PIN..." : "Create PIN"}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default CreatePin
