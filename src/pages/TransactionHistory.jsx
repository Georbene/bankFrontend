"use client"

import { useState, useEffect } from "react"
import { Container, Row, Col, Card, Form, Button, ListGroup, Pagination } from "react-bootstrap"
import AppNavbar from "../components/Navbar"
import TransactionItem from "../components/TransactionItem"
import { getTransactions } from "../services/transactionService"
import "../styles/transaction-history.css"

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([])
  const [filteredTransactions, setFilteredTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    type: "all",
    dateFrom: "",
    dateTo: "",
    search: "",
  })

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true)
      try {
        const result = await getTransactions()
        if (result.success) {
          setTransactions(result.data)
          setFilteredTransactions(result.data)
        }
      } catch (error) {
        console.error("Error fetching transactions:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTransactions()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [filters, transactions])

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters({
      ...filters,
      [name]: value,
    })
    setCurrentPage(1) // Reset to first page when filters change
  }

  const applyFilters = () => {
    let filtered = [...transactions]

    // Filter by type
    if (filters.type !== "all") {
      filtered = filtered.filter((transaction) => transaction.type === filters.type)
    }

    // Filter by date range
    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom)
      filtered = filtered.filter((transaction) => new Date(transaction.date) >= fromDate)
    }

    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo)
      toDate.setHours(23, 59, 59, 999) // End of the day
      filtered = filtered.filter((transaction) => new Date(transaction.date) <= toDate)
    }

    // Filter by search term (recipient, sender, or description)
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      filtered = filtered.filter(
        (transaction) =>
          (transaction.recipient && transaction.recipient.toLowerCase().includes(searchTerm)) ||
          (transaction.sender && transaction.sender.toLowerCase().includes(searchTerm)) ||
          (transaction.description && transaction.description.toLowerCase().includes(searchTerm)),
      )
    }

    setFilteredTransactions(filtered)
  }

  const resetFilters = () => {
    setFilters({
      type: "all",
      dateFrom: "",
      dateTo: "",
      search: "",
    })
    setCurrentPage(1)
  }

  // Get current transactions for pagination
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentTransactions = filteredTransactions.slice(indexOfFirstItem, indexOfLastItem)

  // Calculate total pages
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage)

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  return (
    <>
      <AppNavbar />
      <Container className="transaction-history-container">
        <h1 className="mb-4">Transaction History</h1>

        <Card className="mb-4">
          <Card.Body>
            <Row>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Transaction Type</Form.Label>
                  <Form.Select name="type" value={filters.type} onChange={handleFilterChange}>
                    <option value="all">All Transactions</option>
                    <option value="credit">Credits Only</option>
                    <option value="debit">Debits Only</option>
                    <option value="transfer">Transfers Only</option>
                    <option value="deposit">Deposits Only</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>From Date</Form.Label>
                  <Form.Control type="date" name="dateFrom" value={filters.dateFrom} onChange={handleFilterChange} />
                </Form.Group>
              </Col>

              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>To Date</Form.Label>
                  <Form.Control type="date" name="dateTo" value={filters.dateTo} onChange={handleFilterChange} />
                </Form.Group>
              </Col>

              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Search</Form.Label>
                  <Form.Control
                    type="text"
                    name="search"
                    value={filters.search}
                    onChange={handleFilterChange}
                    placeholder="Search transactions..."
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex justify-content-end">
              <Button variant="outline-secondary" onClick={resetFilters} className="me-2">
                Reset Filters
              </Button>
            </div>
          </Card.Body>
        </Card>

        <Card>
          <Card.Body className="p-0">
            {loading ? (
              <div className="text-center p-4">Loading transactions...</div>
            ) : currentTransactions.length > 0 ? (
              <>
                <ListGroup variant="flush">
                  {currentTransactions.map((transaction, index) => (
                    <TransactionItem key={index} transaction={transaction} />
                  ))}
                </ListGroup>

                {totalPages > 1 && (
                  <div className="d-flex justify-content-center mt-4 mb-3">
                    <Pagination>
                      <Pagination.First onClick={() => paginate(1)} disabled={currentPage === 1} />
                      <Pagination.Prev onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} />

                      {[...Array(totalPages)].map((_, index) => {
                        const pageNumber = index + 1
                        // Show current page, 2 pages before and after
                        if (
                          pageNumber === 1 ||
                          pageNumber === totalPages ||
                          (pageNumber >= currentPage - 2 && pageNumber <= currentPage + 2)
                        ) {
                          return (
                            <Pagination.Item
                              key={pageNumber}
                              active={pageNumber === currentPage}
                              onClick={() => paginate(pageNumber)}
                            >
                              {pageNumber}
                            </Pagination.Item>
                          )
                        } else if (pageNumber === currentPage - 3 || pageNumber === currentPage + 3) {
                          return <Pagination.Ellipsis key={pageNumber} />
                        }
                        return null
                      })}

                      <Pagination.Next
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      />
                      <Pagination.Last onClick={() => paginate(totalPages)} disabled={currentPage === totalPages} />
                    </Pagination>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center p-4">No transactions found matching your filters.</div>
            )}
          </Card.Body>
        </Card>
      </Container>
    </>
  )
}

export default TransactionHistory
