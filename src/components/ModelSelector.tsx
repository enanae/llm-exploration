import React from 'react'

interface ModelSelectorProps {
  selectedModel: string
  onModelChange: (model: string) => void
}

const ModelSelector: React.FC<ModelSelectorProps> = ({ selectedModel, onModelChange }) => {
  const models = [
    { id: 'gpt2', name: 'GPT-2', description: 'OpenAI GPT-2 (124M parameters)' },
    { id: 'gpt2-medium', name: 'GPT-2 Medium', description: 'OpenAI GPT-2 Medium (355M parameters)' },
    { id: 'gpt2-large', name: 'GPT-2 Large', description: 'OpenAI GPT-2 Large (774M parameters)' },
    { id: 'bert-base-uncased', name: 'BERT Base', description: 'Google BERT Base (110M parameters)' },
    { id: 'distilbert-base-uncased', name: 'DistilBERT', description: 'DistilBERT Base (66M parameters)' },
    { id: 'roberta-base', name: 'RoBERTa Base', description: 'Facebook RoBERTa Base (125M parameters)' }
  ]

  return (
    <div className="card">
      <h2 className="text-lg font-semibold mb-4">Select Language Model</h2>
      <div className="grid grid-3">
        {models.map((model) => (
          <div
            key={model.id}
            className={`model-option ${selectedModel === model.id ? 'selected' : ''}`}
            onClick={() => onModelChange(model.id)}
          >
            <div className="model-info">
              <h3 className="model-name">{model.name}</h3>
              <p className="model-description">{model.description}</p>
            </div>
            <div className="model-status">
              {selectedModel === model.id && (
                <span className="status-indicator">✓</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ModelSelector