import React, { useState } from 'react'
import Header from './components/Header'
import TokenizationExplorer from './components/TokenizationExplorer'
import ModelSelector from './components/ModelSelector'
import './App.css'

function App() {
  const [selectedModel, setSelectedModel] = useState('gpt2')
  const [inputText, setInputText] = useState('The quick brown fox jumps over the lazy dog. This is a sample text to demonstrate tokenization.')

  return (
    <div className="App">
      <Header />
      <main className="container">
        <div className="grid gap-6">
          <ModelSelector 
            selectedModel={selectedModel} 
            onModelChange={setSelectedModel} 
          />
          <TokenizationExplorer 
            model={selectedModel}
            inputText={inputText}
            onInputChange={setInputText}
          />
        </div>
      </main>
    </div>
  )
}

export default App