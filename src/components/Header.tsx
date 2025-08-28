import React from 'react'

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="header-left">
            <h1 className="header-title">
              <span className="text-teal">Language</span> Model Explorer
            </h1>
            <p className="header-subtitle">
              Interactive exploration of transformer internals and tokenization
            </p>
          </div>
          <div className="header-right">
            <div className="header-badge">
              <span className="badge-icon">🧠</span>
              <span>AI Research Tool</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header