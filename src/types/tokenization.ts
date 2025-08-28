export interface Token {
  id: number
  text: string
  start: number
  end: number
  type: string
  length: number
}

export interface TokenizationResult {
  originalText: string
  tokens: Token[]
  totalTokens: number
  model: string
  timestamp: string
}

export interface TokenizationParams {
  model: string
  addSpecialTokens: boolean
  padding: boolean
  truncation: boolean
  maxLength: number
}