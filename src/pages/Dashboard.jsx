"use client"

import { useState, useEffect } from "react"
import { Container, Row, Col, Card, Button, ListGroup } from "react-bootstrap"
import { Link } from "react-router-dom"
import { FaExchangeAlt, FaHistory, FaCreditCard, FaUserCog } from "react-icons/fa"
import AppNavbar from "../components/Navbar"
import CreditCard from "../components/CreditCard"
import TransactionItem from "../components/TransactionItem"
import TransferForm from "../components/TransferForm"
import { useAuth } from "../contexts/AuthContext"
import { getTransactions, getAccountBalance } from "../services/transactionService"
import "../styles/dashboard.css"

const Dashboard = () => {
  const { currentUser } = useAuth()
  const [balance, setBalance] = useState(0)
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [showTransferForm, setShowTransferForm] = useState(false)

  // Mock credit card data
  const cardData = {
    cardNumber: "4111111111111111",
    cardholderName: `${currentUser?.firstName} ${currentUser?.lastName}`,
    expiryDate: "12/25",
    cvv: "123",
  }

  const fetchDashboardData = async () => {
    setLoading(true)
    try {
      // Fetch account balance
      const balanceResult = await getAccountBalance()
      if (balanceResult.success) {
        setBalance(balanceResult.data.balance)
      }

      // Fetch recent transactions
      const transactionsResult = await getTransactions()
      if (transactionsResult.success) {
        // Only show the 5 most recent transactions
        setTransactions(transactionsResult.data.slice(0, 5))
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const handleTransferSuccess = () => {
    // Refresh dashboard data after successful transfer
    fetchDashboardData()
    setShowTransferForm(false)
  }

  return (
    <>
      <AppNavbar />
      <Container className="dashboard-container">
        <h1 className="welcome-message">Welcome, {currentUser?.firstName}!</h1>

        <Row className="mb-4">
          <Col lg={4} md={6} className="mb-4 mb-lg-0">
            <Card className="balance-card">
              <Card.Body>
                <Card.Title>Account Balance</Card.Title>
                <div className="balance-amount">${balance.toFixed(2)}</div>
                <div className="balance-actions mt-3">
                  <Button variant="success" onClick={() => setShowTransferForm(!showTransferForm)}>
                    <FaExchangeAlt className="me-2" />
                    Transfer
                  </Button>
                  <Button variant="outline-success" as={Link} to="/transactions">
                    <FaHistory className="me-2" />
                    History
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={8} md={6}>
            <CreditCard cardData={cardData} />
          </Col>
        </Row>

        {showTransferForm && (
          <Row className="mb-4">
            <Col md={12}>
              <Card>
                <Card.Body>
                  <TransferForm onTransferSuccess={handleTransferSuccess} />
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}

        <Row>
          <Col lg={8} className="mb-4 mb-lg-0">
            <Card className="h-100">
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Recent Transactions</h5>
                <Button variant="link" as={Link} to="/transactions" className="p-0">
                  View All
                </Button>
              </Card.Header>
              <Card.Body className="p-0">
                {loading ? (
                  <div className="text-center p-4">Loading transactions...</div>
                ) : transactions.length > 0 ? (
                  <ListGroup variant="flush">
                    {transactions.map((transaction, index) => (
                      <TransactionItem key={index} transaction={transaction} />
                    ))}
                  </ListGroup>
                ) : (
                  <div className="text-center p-4">No recent transactions found.</div>
                )}
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4}>
            <Card className="h-100">
              <Card.Header>
                <h5 className="mb-0">Quick Actions</h5>
              </Card.Header>
              <Card.Body>
                <ListGroup variant="flush">
                  <ListGroup.Item action as={Link} to="/profile">
                    <FaUserCog className="me-2" />
                    Manage Profile
                  </ListGroup.Item>
                  <ListGroup.Item action as={Link} to="/create-pin">
                    <FaCreditCard className="me-2" />
                    Create/Update PIN
                  </ListGroup.Item>
                  <ListGroup.Item action onClick={() => setShowTransferForm(true)}>
                    <FaExchangeAlt className="me-2" />
                    Transfer Money
                  </ListGroup.Item>
                  <ListGroup.Item action as={Link} to="/transactions">
                    <FaHistory className="me-2" />
                    View Transactions
                  </ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default Dashboard
