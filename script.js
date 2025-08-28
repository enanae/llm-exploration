// Language Model Explorer - Main JavaScript

class LanguageModelExplorer {
  constructor() {
    this.currentModel = 'gpt2';
    this.currentView = 'flow';
    this.selectedToken = null;
    this.tokenizationResult = null;
    
    this.initialize();
  }

  initialize() {
    this.setupModelSelector();
    this.setupEventListeners();
    this.updateModelInfo();
    this.analyzeTokenization();
  }

  setupModelSelector() {
    const models = [
      { id: 'gpt2', name: 'GPT-2', description: 'OpenAI GPT-2 (124M parameters)' },
      { id: 'gpt2-medium', name: 'GPT-2 Medium', description: 'OpenAI GPT-2 Medium (355M parameters)' },
      { id: 'gpt2-large', name: 'GPT-2 Large', description: 'OpenAI GPT-2 Large (774M parameters)' },
      { id: 'bert-base-uncased', name: 'BERT Base', description: 'Google BERT Base (110M parameters)' },
      { id: 'distilbert-base-uncased', name: 'DistilBERT', description: 'DistilBERT Base (66M parameters)' },
      { id: 'roberta-base', name: 'RoBERTa Base', description: 'Facebook RoBERTa Base (125M parameters)' }
    ];

    const modelSelector = document.getElementById('modelSelector');
    modelSelector.innerHTML = models.map(model => `
      <div class="model-option ${model.id === this.currentModel ? 'selected' : ''}" 
           data-model="${model.id}">
        <div class="model-info">
          <h3 class="model-name">${model.name}</h3>
          <p class="model-description">${model.description}</p>
        </div>
        <div class="model-status">
          ${model.id === this.currentModel ? '<span class="status-indicator">✓</span>' : ''}
        </div>
      </div>
    `).join('');

    // Add click event listeners
    modelSelector.querySelectorAll('.model-option').forEach(option => {
      option.addEventListener('click', () => {
        this.selectModel(option.dataset.model);
      });
    });
  }

  selectModel(modelId) {
    this.currentModel = modelId;
    
    // Update UI
    document.querySelectorAll('.model-option').forEach(option => {
      option.classList.toggle('selected', option.dataset.model === modelId);
    });
    
    this.updateModelInfo();
    this.analyzeTokenization();
  }

  updateModelInfo() {
    const modelBadge = document.getElementById('currentModel');
    const modelType = document.getElementById('modelType');
    
    modelBadge.textContent = this.currentModel;
    modelType.textContent = this.currentModel.includes('gpt') ? 'GPT-style' : 
                           this.currentModel.includes('bert') ? 'BERT-style' : 'Other';
  }

  setupEventListeners() {
    // Analyze button
    document.getElementById('analyzeBtn').addEventListener('click', () => {
      this.analyzeTokenization();
    });

    // Input text changes
    document.getElementById('input-text').addEventListener('input', () => {
      this.analyzeTokenization();
    });

    // Parameter changes
    document.getElementById('addSpecialTokens').addEventListener('change', () => {
      this.analyzeTokenization();
    });

    document.getElementById('padding').addEventListener('change', () => {
      this.analyzeTokenization();
    });

    document.getElementById('truncation').addEventListener('change', () => {
      this.analyzeTokenization();
    });

    document.getElementById('maxLength').addEventListener('input', () => {
      this.analyzeTokenization();
    });
  }

  async analyzeTokenization() {
    const inputText = document.getElementById('input-text').value;
    if (!inputText.trim()) return;

    // Show loading state
    const analyzeBtn = document.getElementById('analyzeBtn');
    analyzeBtn.disabled = true;
    analyzeBtn.textContent = 'Analyzing...';

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock tokenization logic
      this.tokenizationResult = this.mockTokenize(inputText);
      
      this.displayResults();
      this.hideError();
    } catch (error) {
      this.showError('Failed to tokenize text. Please try again.');
    } finally {
      analyzeBtn.disabled = false;
      analyzeBtn.textContent = 'Analyze Tokenization';
    }
  }

  mockTokenize(text) {
    const words = text.split(/\s+/);
    const tokens = words.map((word, index) => ({
      id: index,
      text: word,
      start: text.indexOf(word),
      end: text.indexOf(word) + word.length,
      type: word.match(/^[A-Z]/) ? 'capitalized' : 'lowercase',
      length: word.length
    }));

    return {
      originalText: text,
      tokens,
      totalTokens: tokens.length,
      model: this.currentModel,
      timestamp: new Date().toISOString()
    };
  }

  displayResults() {
    this.displayTokenStats();
    this.displayTokenVisualizer();
  }

  displayTokenStats() {
    const result = this.tokenizationResult;
    const avgTokenLength = result.tokens.reduce((sum, token) => sum + token.length, 0) / result.tokens.length;
    const longestToken = result.tokens.reduce((longest, token) => 
      token.length > longest.length ? token : longest
    );
    const shortestToken = result.tokens.reduce((shortest, token) => 
      token.length < shortest.length ? token : shortest
    );

    const stats = [
      { label: 'Total Tokens', value: result.totalTokens, color: 'teal' },
      { label: 'Average Length', value: avgTokenLength.toFixed(1), color: 'green' },
      { label: 'Longest Token', value: longestToken.text, color: 'teal' },
      { label: 'Shortest Token', value: shortestToken.text, color: 'green' },
      { label: 'Model', value: result.model, color: 'grey' },
      { label: 'Timestamp', value: new Date(result.timestamp).toLocaleTimeString(), color: 'grey' }
    ];

    const tokenStats = document.getElementById('tokenStats');
    tokenStats.innerHTML = `
      <div class="stats-card">
        <h3 class="stats-title">Tokenization Statistics</h3>
        
        <div class="stats-grid">
          ${stats.map(stat => `
            <div class="stat-item stat-${stat.color}">
              <div class="stat-label">${stat.label}</div>
              <div class="stat-value">${stat.value}</div>
            </div>
          `).join('')}
        </div>

        <div class="stats-summary">
          <div class="summary-item">
            <span class="summary-label">Text Length:</span>
            <span class="summary-value">${result.originalText.length} characters</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">Compression Ratio:</span>
            <span class="summary-value">
              ${((result.totalTokens / result.originalText.length) * 100).toFixed(1)}%
            </span>
          </div>
        </div>
      </div>
    `;
    tokenStats.style.display = 'block';
  }

  displayTokenVisualizer() {
    const result = this.tokenizationResult;
    const tokenVisualizer = document.getElementById('tokenVisualizer');
    
    tokenVisualizer.innerHTML = `
      <div class="visualizer-card">
        <div class="visualizer-header">
          <h3 class="visualizer-title">Token Visualization</h3>
          <div class="view-controls">
            <button class="view-btn ${this.currentView === 'flow' ? 'active' : ''}" 
                    onclick="explorer.setView('flow')">
              Flow View
            </button>
            <button class="view-btn ${this.currentView === 'grid' ? 'active' : ''}" 
                    onclick="explorer.setView('grid')">
              Grid View
            </button>
          </div>
        </div>

        ${this.currentView === 'flow' ? this.renderFlowView(result) : this.renderGridView(result)}

        ${this.selectedToken !== null ? this.renderTokenDetails(result) : ''}
      </div>
    `;
    
    tokenVisualizer.style.display = 'block';
    this.setupTokenInteractions();
  }

  renderFlowView(result) {
    return `
      <div class="flow-view">
        <div class="token-flow">
          ${result.tokens.map((token, index) => `
            <div class="token-item ${this.selectedToken === index ? 'selected' : ''}"
                 data-token-index="${index}"
                 style="
                   background-color: ${this.getTokenBackground(token, index)};
                   border-color: ${this.getTokenColor(token, index)};
                 ">
              <div class="token-text">${token.text}</div>
              <div class="token-meta">
                <span class="token-id">#${index}</span>
                <span class="token-length">${token.length}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  renderGridView(result) {
    return `
      <div class="grid-view">
        <div class="token-grid">
          ${result.tokens.map((token, index) => `
            <div class="token-card ${this.selectedToken === index ? 'selected' : ''}"
                 data-token-index="${index}"
                 style="
                   background-color: ${this.getTokenBackground(token, index)};
                   border-color: ${this.getTokenColor(token, index)};
                 ">
              <div class="token-header">
                <span class="token-id">#${index}</span>
                <span class="token-type">${token.type}</span>
              </div>
              <div class="token-content">${token.text}</div>
              <div class="token-footer">
                <span class="token-position">${token.start}-${token.end}</span>
                <span class="token-length">${token.length} chars</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  renderTokenDetails(result) {
    const token = result.tokens[this.selectedToken];
    return `
      <div class="token-details">
        <h4 class="details-title">Token Details</h4>
        <div class="details-content">
          <div class="detail-row">
            <span class="detail-label">Text:</span>
            <span class="detail-value">${token.text}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Position:</span>
            <span class="detail-value">${token.start} - ${token.end}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Length:</span>
            <span class="detail-value">${token.length} characters</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Type:</span>
            <span class="detail-value">${token.type}</span>
          </div>
        </div>
      </div>
    `;
  }

  getTokenColor(token, index) {
    if (this.selectedToken === index) return 'var(--teal)';
    
    const colors = [
      'var(--light-teal)',
      'var(--light-green)', 
      'var(--green)',
      'var(--teal)'
    ];
    return colors[index % colors.length];
  }

  getTokenBackground(token, index) {
    if (this.selectedToken === index) return 'rgba(13, 148, 136, 0.1)';
    
    const backgrounds = [
      'rgba(20, 184, 166, 0.1)',
      'rgba(16, 185, 129, 0.1)',
      'rgba(5, 150, 105, 0.1)',
      'rgba(13, 148, 136, 0.1)'
    ];
    return backgrounds[index % backgrounds.length];
  }

  setupTokenInteractions() {
    // Add click and hover events to tokens
    document.querySelectorAll('.token-item, .token-card').forEach(tokenElement => {
      const tokenIndex = parseInt(tokenElement.dataset.tokenIndex);
      
      tokenElement.addEventListener('click', () => {
        this.selectToken(tokenIndex);
      });
      
      tokenElement.addEventListener('mouseenter', () => {
        this.highlightToken(tokenIndex);
      });
      
      tokenElement.addEventListener('mouseleave', () => {
        this.unhighlightToken();
      });
    });
  }

  selectToken(index) {
    this.selectedToken = this.selectedToken === index ? null : index;
    this.displayTokenVisualizer();
  }

  highlightToken(index) {
    this.selectedToken = index;
    this.displayTokenVisualizer();
  }

  unhighlightToken() {
    this.selectedToken = null;
    this.displayTokenVisualizer();
  }

  setView(view) {
    this.currentView = view;
    this.displayTokenVisualizer();
  }

  showError(message) {
    const errorElement = document.getElementById('errorMessage');
    errorElement.textContent = message;
    errorElement.style.display = 'block';
  }

  hideError() {
    const errorElement = document.getElementById('errorMessage');
    errorElement.style.display = 'none';
  }
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.explorer = new LanguageModelExplorer();
});