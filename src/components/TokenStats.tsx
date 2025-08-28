import React from 'react'
import { TokenizationResult } from '../types/tokenization'

interface TokenStatsProps {
  result: TokenizationResult
}

const TokenStats: React.FC<TokenStatsProps> = ({ result }) => {
  const avgTokenLength = result.tokens.reduce((sum, token) => sum + token.length, 0) / result.tokens.length
  const longestToken = result.tokens.reduce((longest, token) => 
    token.length > longest.length ? token : longest
  )
  const shortestToken = result.tokens.reduce((shortest, token) => 
    token.length < shortest.length ? token : shortest
  )

  const stats = [
    { label: 'Total Tokens', value: result.totalTokens, color: 'teal' },
    { label: 'Average Length', value: avgTokenLength.toFixed(1), color: 'green' },
    { label: 'Longest Token', value: longestToken.text, color: 'teal' },
    { label: 'Shortest Token', value: shortestToken.text, color: 'green' },
    { label: 'Model', value: result.model, color: 'grey' },
    { label: 'Timestamp', value: new Date(result.timestamp).toLocaleTimeString(), color: 'grey' }
  ]

  return (
    <div className="stats-card">
      <h3 className="stats-title">Tokenization Statistics</h3>
      
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className={`stat-item stat-${stat.color}`}>
            <div className="stat-label">{stat.label}</div>
            <div className="stat-value">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="stats-summary">
        <div className="summary-item">
          <span className="summary-label">Text Length:</span>
          <span className="summary-value">{result.originalText.length} characters</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Compression Ratio:</span>
          <span className="summary-value">
            {((result.totalTokens / result.originalText.length) * 100).toFixed(1)}%
          </span>
        </div>
      </div>
    </div>
  )
}

export default TokenStats