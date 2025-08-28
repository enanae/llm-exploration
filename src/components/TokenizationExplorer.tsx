import React, { useState, useEffect } from 'react'
import TokenVisualizer from './TokenVisualizer'
import TokenizationControls from './TokenizationControls'
import TokenStats from './TokenStats'
import { TokenizationResult } from '../types/tokenization'

interface TokenizationExplorerProps {
  model: string
  inputText: string
  onInputChange: (text: string) => void
}

const TokenizationExplorer: React.FC<TokenizationExplorerProps> = ({
  model,
  inputText,
  onInputChange
}) => {
  const [tokenizationResult, setTokenizationResult] = useState<TokenizationResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Mock tokenization for now - in a real app, this would call the Hugging Face API
  const mockTokenize = async (text: string, model: string) => {
    setIsLoading(true)
    setError(null)
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Mock tokenization logic
      const words = text.split(/\s+/)
      const tokens = words.map((word, index) => ({
        id: index,
        text: word,
        start: text.indexOf(word),
        end: text.indexOf(word) + word.length,
        type: word.match(/^[A-Z]/) ? 'capitalized' : 'lowercase',
        length: word.length
      }))
      
      const result: TokenizationResult = {
        originalText: text,
        tokens,
        totalTokens: tokens.length,
        model,
        timestamp: new Date().toISOString()
      }
      
      setTokenizationResult(result)
    } catch (err) {
      setError('Failed to tokenize text. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (inputText.trim()) {
      mockTokenize(inputText, model)
    }
  }, [inputText, model])

  return (
    <div className="card">
      <h2 className="text-lg font-semibold mb-6">Tokenization Explorer</h2>
      
      <div className="grid gap-6">
        <div className="input-section">
          <label htmlFor="input-text" className="input-label">
            Input Text
          </label>
          <textarea
            id="input-text"
            className="input textarea"
            value={inputText}
            onChange={(e) => onInputChange(e.target.value)}
            placeholder="Enter text to tokenize..."
            rows={4}
          />
        </div>

        <TokenizationControls 
          model={model}
          onAnalyze={() => mockTokenize(inputText, model)}
          isLoading={isLoading}
        />

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {tokenizationResult && (
          <>
            <TokenStats result={tokenizationResult} />
            <TokenVisualizer result={tokenizationResult} />
          </>
        )}
      </div>
    </div>
  )
}

export default TokenizationExplorer