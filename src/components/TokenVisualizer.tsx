import React, { useState } from 'react'
import { TokenizationResult } from '../types/tokenization'

interface TokenVisualizerProps {
  result: TokenizationResult
}

const TokenVisualizer: React.FC<TokenVisualizerProps> = ({ result }) => {
  const [selectedToken, setSelectedToken] = useState<number | null>(null)
  const [viewMode, setViewMode] = useState<'flow' | 'grid'>('flow')

  const getTokenColor = (token: any, index: number) => {
    if (selectedToken === index) return 'var(--teal)'
    
    const colors = [
      'var(--light-teal)',
      'var(--light-green)', 
      'var(--green)',
      'var(--teal)'
    ]
    return colors[index % colors.length]
  }

  const getTokenBackground = (token: any, index: number) => {
    if (selectedToken === index) return 'rgba(13, 148, 136, 0.1)'
    
    const backgrounds = [
      'rgba(20, 184, 166, 0.1)',
      'rgba(16, 185, 129, 0.1)',
      'rgba(5, 150, 105, 0.1)',
      'rgba(13, 148, 136, 0.1)'
    ]
    return backgrounds[index % backgrounds.length]
  }

  return (
    <div className="visualizer-card">
      <div className="visualizer-header">
        <h3 className="visualizer-title">Token Visualization</h3>
        <div className="view-controls">
          <button
            className={`view-btn ${viewMode === 'flow' ? 'active' : ''}`}
            onClick={() => setViewMode('flow')}
          >
            Flow View
          </button>
          <button
            className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setViewMode('grid')}
          >
            Grid View
          </button>
        </div>
      </div>

      {viewMode === 'flow' ? (
        <div className="flow-view">
          <div className="token-flow">
            {result.tokens.map((token, index) => (
              <div
                key={index}
                className={`token-item ${selectedToken === index ? 'selected' : ''}`}
                style={{
                  backgroundColor: getTokenBackground(token, index),
                  borderColor: getTokenColor(token, index)
                }}
                onClick={() => setSelectedToken(selectedToken === index ? null : index)}
                onMouseEnter={() => setSelectedToken(index)}
                onMouseLeave={() => setSelectedToken(null)}
              >
                <div className="token-text">{token.text}</div>
                <div className="token-meta">
                  <span className="token-id">#{index}</span>
                  <span className="token-length">{token.length}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid-view">
          <div className="token-grid">
            {result.tokens.map((token, index) => (
              <div
                key={index}
                className={`token-card ${selectedToken === index ? 'selected' : ''}`}
                style={{
                  backgroundColor: getTokenBackground(token, index),
                  borderColor: getTokenColor(token, index)
                }}
                onClick={() => setSelectedToken(selectedToken === index ? null : index)}
              >
                <div className="token-header">
                  <span className="token-id">#{index}</span>
                  <span className="token-type">{token.type}</span>
                </div>
                <div className="token-content">{token.text}</div>
                <div className="token-footer">
                  <span className="token-position">{token.start}-{token.end}</span>
                  <span className="token-length">{token.length} chars</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedToken !== null && (
        <div className="token-details">
          <h4 className="details-title">Token Details</h4>
          <div className="details-content">
            <div className="detail-row">
              <span className="detail-label">Text:</span>
              <span className="detail-value">{result.tokens[selectedToken].text}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Position:</span>
              <span className="detail-value">
                {result.tokens[selectedToken].start} - {result.tokens[selectedToken].end}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Length:</span>
              <span className="detail-value">{result.tokens[selectedToken].length} characters</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Type:</span>
              <span className="detail-value">{result.tokens[selectedToken].type}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TokenVisualizer