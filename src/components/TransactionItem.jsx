import { ListGroup, Badge } from "react-bootstrap"
import { FaArrowUp, FaArrowDown } from "react-icons/fa"
import "../styles/transaction-item.css"

const TransactionItem = ({ transaction }) => {
  const { type, amount, recipient, sender, date, status } = transaction

  const isCredit = type === "credit" || type === "deposit"
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })

  const getStatusBadge = () => {
    switch (status) {
      case "completed":
        return <Badge bg="success">Completed</Badge>
      case "pending":
        return <Badge bg="warning">Pending</Badge>
      case "failed":
        return <Badge bg="danger">Failed</Badge>
      default:
        return <Badge bg="secondary">{status}</Badge>
    }
  }

  return (
    <ListGroup.Item className="transaction-item">
      <div className="transaction-icon">
        {isCredit ? (
          <div className="icon-circle credit">
            <FaArrowDown />
          </div>
        ) : (
          <div className="icon-circle debit">
            <FaArrowUp />
          </div>
        )}
      </div>
      <div className="transaction-details">
        <div className="transaction-title">{isCredit ? `Received from ${sender}` : `Sent to ${recipient}`}</div>
        <div className="transaction-date">{formattedDate}</div>
      </div>
      <div className="transaction-amount-container">
        <div className={`transaction-amount ${isCredit ? "credit" : "debit"}`}>
          {isCredit ? "+" : "-"}${amount.toFixed(2)}
        </div>
        <div className="transaction-status">{getStatusBadge()}</div>
      </div>
    </ListGroup.Item>
  )
}

export default TransactionItem
