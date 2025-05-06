import { Card } from "react-bootstrap"
import { useEffect, useState } from "react"
import "../styles/credit-card.css"

const CreditCard = ({ cardData }) => {
  const [randomCardNumber, setRandomCardNumber] = useState("")
  
  // Generate random card number on component mount
  useEffect(() => {
    generateRandomCardNumber()
  }, [])
  
  // Function to generate a random card number
  const generateRandomCardNumber = () => {
    let cardNum = ""
    // Generate 16 random digits
    for (let i = 0; i < 16; i++) {
      cardNum += Math.floor(Math.random() * 10).toString()
    }
    // Format with spaces
    const formattedNumber = cardNum.replace(/(\d{4})/g, "$1 ").trim()
    setRandomCardNumber(formattedNumber)
  }

  // Format card number with spaces
  const formatCardNumber = (number) => {
    return number.replace(/(\d{4})/g, "$1 ").trim()
  }

  const { cardholderName, expiryDate, cvv } = cardData

  return (
    <Card className="credit-card">
      <Card.Body>
        <div className="card-chip"></div>
        <div className="card-number">{randomCardNumber || formatCardNumber("4111111111111111")}</div>
        <div className="card-details">
          <div className="card-holder">
            <div className="label">Card Holder</div>
            <div className="value">{cardholderName}</div>
          </div>
          <div className="card-expiry">
            <div className="label">Expires</div>
            <div className="value">{expiryDate}</div>
          </div>
        </div>
        <div className="card-type">
          <img src="https://www.svgrepo.com/show/266130/visa.svg" alt="Card Type" />
        </div>
      </Card.Body>
    </Card>
  )
}

export default CreditCard