import React, { useState } from 'react'

interface TokenizationControlsProps {
  model: string
  onAnalyze: () => void
  isLoading: boolean
}

const TokenizationControls: React.FC<TokenizationControlsProps> = ({
  model,
  onAnalyze,
  isLoading
}) => {
  const [addSpecialTokens, setAddSpecialTokens] = useState(true)
  const [padding, setPadding] = useState(false)
  const [truncation, setTruncation] = useState(false)
  const [maxLength, setMaxLength] = useState(512)

  return (
    <div className="controls-card">
      <h3 className="controls-title">Tokenization Parameters</h3>
      
      <div className="grid grid-2 gap-4">
        <div className="control-group">
          <label className="control-label">
            <input
              type="checkbox"
              checked={addSpecialTokens}
              onChange={(e) => setAddSpecialTokens(e.target.checked)}
              className="control-checkbox"
            />
            Add Special Tokens
          </label>
          <p className="control-description">
            Include [CLS], [SEP], [PAD] tokens for BERT-style models
          </p>
        </div>

        <div className="control-group">
          <label className="control-label">
            <input
              type="checkbox"
              checked={padding}
              onChange={(e) => setPadding(e.target.checked)}
              className="control-checkbox"
            />
            Padding
          </label>
          <p className="control-description">
            Pad sequences to uniform length
          </p>
        </div>

        <div className="control-group">
          <label className="control-label">
            <input
              type="checkbox"
              checked={truncation}
              onChange={(e) => setTruncation(e.target.checked)}
              className="control-checkbox"
            />
            Truncation
          </label>
          <p className="control-description">
            Truncate sequences that exceed max length
          </p>
        </div>

        <div className="control-group">
          <label className="control-label">
            Max Length
          </label>
          <input
            type="number"
            value={maxLength}
            onChange={(e) => setMaxLength(Number(e.target.value))}
            className="control-input"
            min="1"
            max="2048"
          />
          <p className="control-description">
            Maximum sequence length
          </p>
        </div>
      </div>

      <div className="controls-actions">
        <button
          className="btn"
          onClick={onAnalyze}
          disabled={isLoading}
        >
          {isLoading ? 'Analyzing...' : 'Analyze Tokenization'}
        </button>
        
        <div className="model-info-display">
          <span className="model-badge">{model}</span>
          <span className="model-type">
            {model.includes('gpt') ? 'GPT-style' : model.includes('bert') ? 'BERT-style' : 'Other'}
          </span>
        </div>
      </div>
    </div>
  )
}

export default TokenizationControls