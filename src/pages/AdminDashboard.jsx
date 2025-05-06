"use client"

import { useState, useEffect } from "react"
import { Container, Row, Col, Card, Table, Form, Button, Alert, Spinner } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import AppNavbar from "../components/Navbar"
import api from "../services/api"
import "../styles/admin-dashboard.css"

const AdminDashboard = () => {
  const { currentUser } = useAuth()
  const navigate = useNavigate()

  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // Form state for adding balance
  const [selectedUser, setSelectedUser] = useState("")
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [processingUpdate, setProcessingUpdate] = useState(false)

  // Search and filter
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredUsers, setFilteredUsers] = useState([])

  // Check if user is admin, if not redirect
  useEffect(() => {
    if (currentUser && currentUser.role !== "admin") {
      navigate("/dashboard")
    }
  }, [currentUser, navigate])

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true)
      try {
        const response = await api.get("/api/admin/users")
        setUsers(response.data)
        setFilteredUsers(response.data)
      } catch (err) {
        setError("Failed to fetch users. Please try again.")
        console.error("Error fetching users:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  // Filter users based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredUsers(users)
    } else {
      const filtered = users.filter(
        (user) =>
          user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.accountNumber.includes(searchTerm),
      )
      setFilteredUsers(filtered)
    }
  }, [searchTerm, users])

  const handleAddBalance = async (e) => {
    e.preventDefault()

    // Validation
    if (!selectedUser) {
      setError("Please select a user")
      return
    }

    if (!amount || isNaN(amount) || Number.parseFloat(amount) <= 0) {
      setError("Please enter a valid amount")
      return
    }

    setError("")
    setSuccess("")
    setProcessingUpdate(true)

    try {
      const response = await api.post("/api/admin/add-balance", {
        userId: selectedUser,
        amount: Number.parseFloat(amount),
        description: description || "Admin deposit",
      })

      setSuccess(`Successfully added $${Number.parseFloat(amount).toFixed(2)} to user's account`)

      // Reset form
      setSelectedUser("")
      setAmount("")
      setDescription("")

      // Refresh user list to show updated balances
      const updatedUsers = await api.get("/api/admin/users")
      setUsers(updatedUsers.data)
      setFilteredUsers(updatedUsers.data)
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update balance. Please try again.")
      console.error("Error updating balance:", err)
    } finally {
      setProcessingUpdate(false)
    }
  }

  return (
    <>
      <AppNavbar />
      <Container className="admin-dashboard-container">
        <h1 className="mb-4">Admin Dashboard</h1>

        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        <Row>
          <Col lg={4} className="mb-4">
            <Card>
              <Card.Header>
                <h5 className="mb-0">Add Balance to User</h5>
              </Card.Header>
              <Card.Body>
                <Form onSubmit={handleAddBalance}>
                  <Form.Group className="mb-3">
                    <Form.Label>Select User</Form.Label>
                    <Form.Select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)} required>
                      <option value="">-- Select User --</option>
                      {users.map((user) => (
                        <option key={user._id} value={user._id}>
                          {user.firstName} {user.lastName} ({user.accountNumber})
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Amount</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="Enter amount"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      min="0.01"
                      step="0.01"
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Description (Optional)</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      placeholder="Enter description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </Form.Group>

                  <Button variant="success" type="submit" className="w-100" disabled={processingUpdate}>
                    {processingUpdate ? (
                      <>
                        <Spinner as="span" animation="border" size="sm" className="me-2" />
                        Processing...
                      </>
                    ) : (
                      "Add Balance"
                    )}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={8}>
            <Card>
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">User Accounts</h5>
                <Form.Control
                  type="text"
                  placeholder="Search users..."
                  className="w-auto"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </Card.Header>
              <Card.Body className="p-0">
                {loading ? (
                  <div className="text-center p-4">
                    <Spinner animation="border" variant="success" />
                    <p className="mt-2">Loading users...</p>
                  </div>
                ) : filteredUsers.length > 0 ? (
                  <div className="table-responsive">
                    <Table hover className="mb-0">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Account Number</th>
                          <th>Balance</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.map((user) => (
                          <tr key={user._id}>
                            <td>
                              {user.firstName} {user.lastName}
                            </td>
                            <td>{user.email}</td>
                            <td>{user.accountNumber}</td>
                            <td>${user.balance?.toFixed(2) || "0.00"}</td>
                            <td>
                              <span
                                className={`badge bg-${user.status === "active" ? "success" : user.status === "inactive" ? "warning" : "danger"}`}
                              >
                                {user.status || "Active"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center p-4">
                    <p>No users found matching your search.</p>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default AdminDashboard
