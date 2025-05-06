"use client"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { FaUser, FaSignOutAlt, FaCog, FaExchangeAlt, FaChartLine, FaTachometerAlt } from "react-icons/fa"
import "../styles/navbar.css"

const AppNavbar = () => {
  const { isAuthenticated, logout, currentUser } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/signin")
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom">
      <div className="container">
        <Link to="/" className="navbar-brand fw-bold text-success">
          SecureBank
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          {isAuthenticated ? (
            <>
              <ul className="navbar-nav me-auto">
                <li className="nav-item">
                  <Link to="/dashboard" className="nav-link">
                    <FaTachometerAlt className="me-1" /> Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/transactions" className="nav-link">
                    <FaChartLine className="me-1" /> Transactions
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/transfer" className="nav-link">
                    <FaExchangeAlt className="me-1" /> Transfer
                  </Link>
                </li>
              </ul>
              <div className="d-flex align-items-center">
                <div className="dropdown">
                  <button
                    className="btn btn-outline-success dropdown-toggle"
                    type="button"
                    id="userDropdown"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <FaUser className="me-2" />
                    {currentUser?.firstName || "User"}
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                    <li>
                      <Link to="/profile" className="dropdown-item">
                        <FaUser className="me-2" /> Profile
                      </Link>
                    </li>
                    <li>
                      <Link to="/create-pin" className="dropdown-item">
                        <FaCog className="me-2" /> Create PIN
                      </Link>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <button onClick={handleLogout} className="dropdown-item text-danger">
                        <FaSignOutAlt className="me-2" /> Logout
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </>
          ) : (
            <div className="ms-auto">
              <Link to="/signin" className="btn btn-outline-success me-2">
                Sign In
              </Link> <br />
              <Link to="/signup" className="btn btn-success">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default AppNavbar