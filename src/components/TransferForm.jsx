"use client"

import { useState } from "react"
import { Form, Button, Alert, InputGroup } from "react-bootstrap"
import { transferFunds } from "../services/transactionService"
import "../styles/transfer-form.css"

const TransferForm = ({ onTransferSuccess }) => {
  const [formData, setFormData] = useState({
    recipientAccount: "",
    amount: "",
    pin: "",
    description: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    // Validate form
    if (!formData.recipientAccount || !formData.amount || !formData.pin) {
      setError("Please fill in all required fields")
      setLoading(false)
      return
    }

    if (isNaN(formData.amount) || Number.parseFloat(formData.amount) <= 0) {
      setError("Please enter a valid amount")
      setLoading(false)
      return
    }

    if (formData.pin.length !== 4 || isNaN(formData.pin)) {
      setError("PIN must be a 4-digit number")
      setLoading(false)
      return
    }

    try {
      const result = await transferFunds({
        recipientAccount: formData.recipientAccount,
        amount: Number.parseFloat(formData.amount),
        pin: formData.pin,
        description: formData.description,
      })

      if (result.success) {
        setSuccess("Transfer completed successfully!")
        setFormData({
          recipientAccount: "",
          amount: "",
          pin: "",
          description: "",
        })
        if (onTransferSuccess) {
          onTransferSuccess()
        }
      } else {
        setError(result.message)
      }
    } catch (err) {
      setError("An error occurred during the transfer. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="transfer-form-container">
      <h3>Transfer Money</h3>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Recipient Account Number</Form.Label>
          <Form.Control
            type="text"
            name="recipientAccount"
            value={formData.recipientAccount}
            onChange={handleChange}
            placeholder="Enter account number"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Amount</Form.Label>
          <InputGroup>
            <InputGroup.Text>$</InputGroup.Text>
            <Form.Control
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="0.00"
              min="0.01"
              step="0.01"
              required
            />
          </InputGroup>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Description (Optional)</Form.Label>
          <Form.Control
            as="textarea"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="What's this for?"
            rows={2}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>PIN</Form.Label>
          <Form.Control
            type="password"
            name="pin"
            value={formData.pin}
            onChange={handleChange}
            placeholder="Enter your 4-digit PIN"
            maxLength={4}
            required
          />
        </Form.Group>

        <Button variant="success" type="submit" className="w-100" disabled={loading}>
          {loading ? "Processing..." : "Transfer Funds"}
        </Button>
      </Form>
    </div>
  )
}

export default TransferForm
