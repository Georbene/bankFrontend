"use client"

import { useState } from "react"
import { Container, Row, Col, Card, Form, Button, Alert } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import AppNavbar from "../components/Navbar"
import api from "../services/api"
import "../styles/profile.css"

const Profile = () => {
  const { currentUser } = useAuth()

  const [formData, setFormData] = useState({
    firstName: currentUser?.firstName || "",
    lastName: currentUser?.lastName || "",
    email: currentUser?.email || "",
    phoneNumber: currentUser?.phoneNumber || "",
    address: currentUser?.address || "",
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [profileSuccess, setProfileSuccess] = useState("")
  const [profileError, setProfileError] = useState("")
  const [passwordSuccess, setPasswordSuccess] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleProfileChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordData({
      ...passwordData,
      [name]: value,
    })
  }

  const updateProfile = async (e) => {
    e.preventDefault()
    setProfileSuccess("")
    setProfileError("")
    setLoading(true)

    try {
      const response = await api.put("/api/users/profile", formData)
      setProfileSuccess("Profile updated successfully!")
    } catch (error) {
      setProfileError(error.response?.data?.message || "Failed to update profile. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const updatePassword = async (e) => {
    e.preventDefault()
    setPasswordSuccess("")
    setPasswordError("")

    // Validate passwords
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New passwords do not match")
      return
    }

    if (passwordData.newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters long")
      return
    }

    setLoading(true)

    try {
      await api.put("/api/users/password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      })

      setPasswordSuccess("Password updated successfully!")
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
    } catch (error) {
      setPasswordError(error.response?.data?.message || "Failed to update password. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <AppNavbar />
      <Container className="profile-container">
        <h1 className="mb-4">Your Profile</h1>

        <Row>
          <Col lg={8}>
            <Card className="mb-4">
              <Card.Header>
                <h5 className="mb-0">Personal Information</h5>
              </Card.Header>
              <Card.Body>
                {profileSuccess && <Alert variant="success">{profileSuccess}</Alert>}
                {profileError && <Alert variant="danger">{profileError}</Alert>}

                <Form onSubmit={updateProfile}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>First Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleProfileChange}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleProfileChange}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleProfileChange}
                      disabled
                    />
                    <Form.Text className="text-muted">Email address cannot be changed.</Form.Text>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Phone Number</Form.Label>
                    <Form.Control
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleProfileChange}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                      as="textarea"
                      name="address"
                      value={formData.address}
                      onChange={handleProfileChange}
                      rows={3}
                    />
                  </Form.Group>

                  <Button variant="success" type="submit" disabled={loading}>
                    {loading ? "Updating..." : "Update Profile"}
                  </Button>
                </Form>
              </Card.Body>
            </Card>

            <Card>
              <Card.Header>
                <h5 className="mb-0">Change Password</h5>
              </Card.Header>
              <Card.Body>
                {passwordSuccess && <Alert variant="success">{passwordSuccess}</Alert>}
                {passwordError && <Alert variant="danger">{passwordError}</Alert>}

                <Form onSubmit={updatePassword}>
                  <Form.Group className="mb-3">
                    <Form.Label>Current Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>New Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Confirm New Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      required
                    />
                  </Form.Group>

                  <Button variant="success" type="submit" disabled={loading}>
                    {loading ? "Updating..." : "Change Password"}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4}>
            <Card className="mb-4">
              <Card.Header>
                <h5 className="mb-0">Account Information</h5>
              </Card.Header>
              <Card.Body>
                <div className="account-info-item">
                  <div className="label">Account Number</div>
                  <div className="value">{currentUser?.accountNumber || "1234567890"}</div>
                </div>

                <div className="account-info-item">
                  <div className="label">Account Type</div>
                  <div className="value">Checking</div>
                </div>

                <div className="account-info-item">
                  <div className="label">Account Status</div>
                  <div className="value">
                    <span className="badge bg-success">Active</span>
                  </div>
                </div>

                <div className="account-info-item">
                  <div className="label">Member Since</div>
                  <div className="value">{new Date(currentUser?.createdAt || Date.now()).toLocaleDateString()}</div>
                </div>
              </Card.Body>
            </Card>

            <Card>
              <Card.Header>
                <h5 className="mb-0">Security Settings</h5>
              </Card.Header>
              <Card.Body>
                <div className="security-item">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <div>Two-Factor Authentication</div>
                    <Form.Check type="switch" id="2fa-switch" />
                  </div>
                  <div className="text-muted small">Add an extra layer of security to your account.</div>
                </div>

                <hr />

                <div className="security-item">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <div>Login Notifications</div>
                    <Form.Check type="switch" id="login-notification-switch" defaultChecked />
                  </div>
                  <div className="text-muted small">Receive notifications when someone logs into your account.</div>
                </div>

                <hr />

                <div className="security-item">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <div>Transaction Alerts</div>
                    <Form.Check type="switch" id="transaction-alert-switch" defaultChecked />
                  </div>
                  <div className="text-muted small">Get notified for all transactions in your account.</div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default Profile
