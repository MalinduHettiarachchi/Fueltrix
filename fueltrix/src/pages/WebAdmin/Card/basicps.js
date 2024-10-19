import React from 'react'
import '../Card/basicps.css'

function basicps() {
  return (
    <div className="buy-page">
      {" "}
      {/* Navbar at the top */}
      <div className="twcp">
        <div className="leftpb">
          <div className="ambassador-benefits">
            <h2 className="benefit-title">What you get as a FUELTRIX Standard?</h2>
            <div className="benefit-grid">
              <div className="benefit-item">
                <h3>20% Commission</h3>
                <p>Earn 20% of each sale made with your link.</p>
              </div>
              <div className="benefit-item">
                <h3>FREE Gifts</h3>
                <p>Win FREE gifts every month.</p>
              </div>
              <div className="benefit-item">
                <h3>FREE Products</h3>
                <p>Receive new LUXN features, products, and other freebies.</p>
              </div>
              <div className="benefit-item">
                <h3>Target Bonuses</h3>
                <p>Get additional bonus on achieving your targets.</p>
              </div>
              <div className="benefit-item">
                <h3>Discount Codes</h3>
                <p>Get discount codes to share with friends and family.</p>
              </div>
              <div className="price">
                <h3>LKR 39990</h3>
                <p className="installment-option">
                  or 3 x LKR 13,330.00 with <span className="koko">KOKO</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="rightpb">
          <div class="close-btn">
            <a href="/close"><span>&times;</span></a>
          </div>
          <label className="pby">Your Reservation</label>
          <p className="email-label">Company</p>
          <div className="form-group">
            <input
              type="email"
              placeholder="Company Name"
              className="email-input"
            />
          </div>
          <p className="password-label">Email</p>
          <div className="form-group">
            <input
              type="email"
              placeholder="Email"
              className="password-input"
            />
          </div>
          <p className="package">Package : Standard</p>
          <button className="sign">
            <a href="/sumbit">SUBMIT</a>
          </button>
          <button className="successful">
            <a >Reservation Successful Submitted.</a>
          </button>
        </div>
      </div>
    </div>
  )
}

export default basicps
