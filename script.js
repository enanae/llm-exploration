// Language Model Explorer - Main JavaScript

class LanguageModelExplorer {
  constructor() {
    this.currentModel = 'gpt2';
    this.currentView = 'flow';
    this.selectedToken = null;
    this.tokenizationResult = null;
    this.tokenizers = {};
    
    this.initialize();
  }

  initialize() {
    console.log('LanguageModelExplorer initializing...');
    
    // Hide fallback message and show interface
    this.showInterface();
    
    this.setupModelSelector();
    this.setupEventListeners();
    this.updateModelInfo();
    
    // Initialize tokenizers
    this.initializeTokenizers();
    
    console.log('LanguageModelExplorer initialized successfully');
  }

  showInterface() {
    // Hide fallback message
    const fallback = document.querySelector('.fallback');
    if (fallback) {
      fallback.style.display = 'none';
    }
    
    // Show header and main content
    const header = document.querySelector('.header');
    const main = document.querySelector('main');
    
    if (header) header.style.display = 'block';
    if (main) main.style.display = 'block';
  }

  async initializeTokenizers() {
    try {
      // Load Hugging Face tokenizers
      await this.loadTokenizer('gpt2');
      await this.loadTokenizer('bert-base-uncased');
      await this.loadTokenizer('roberta-base');
      
      // Analyze initial text
      this.analyzeTokenization();
    } catch (error) {
      console.error('Failed to initialize tokenizers:', error);
      this.showError('Failed to load tokenizers. Using fallback mode.');
    }
  }

  async loadTokenizer(modelId) {
    try {
      // Try to load real Hugging Face tokenizer via API
      const response = await fetch(`https://huggingface.co/api/models/${modelId}`);
      if (response.ok) {
        const modelInfo = await response.json();
        console.log(`Model info loaded for ${modelId}:`, modelInfo);
        
        // For now, we'll use a mock tokenizer that simulates real behavior
        // In a real implementation, you'd load the actual Hugging Face tokenizer
        this.tokenizers[modelId] = {
          tokenize: (text) => this.simulateTokenization(text, modelId),
          modelInfo: modelInfo
        };
        console.log(`Tokenizer loaded for ${modelId}`);
      } else {
        throw new Error(`Failed to load model info for ${modelId}`);
      }
    } catch (error) {
      console.error(`Failed to load tokenizer for ${modelId}:`, error);
      // Fallback to basic simulation
      this.tokenizers[modelId] = {
        tokenize: (text) => this.simulateTokenization(text, modelId),
        modelInfo: { name: modelId, id: modelId }
      };
    }
  }

  simulateTokenization(text, modelId) {
    // Simulate different tokenization strategies for different models
    if (modelId.includes('gpt')) {
      // GPT-style: byte-pair encoding simulation
      return this.simulateGPTTokenization(text);
    } else if (modelId.includes('bert')) {
      // BERT-style: WordPiece simulation
      return this.simulateBERTTokenization(text);
    } else {
      // RoBERTa-style: similar to BERT but with different preprocessing
      return this.simulateRoBERTaTokenization(text);
    }
  }

  simulateGPTTokenization(text) {
    // Simulate GPT-2 style tokenization (byte-pair encoding)
    const words = text.split(/\s+/);
    const tokens = [];
    let tokenId = 0;
    
    words.forEach(word => {
      if (word.length <= 2) {
        // Very short words become single tokens
        tokens.push({
          id: tokenId++,
          text: word,
          start: text.indexOf(word),
          end: text.indexOf(word) + word.length,
          type: 'word',
          length: word.length,
          subword: false
        });
      } else if (word.length <= 4) {
        // Medium words might get split
        if (Math.random() > 0.7) { // 30% chance of splitting
          const subwords = this.splitIntoGPTSubwords(word);
          subwords.forEach((subword, index) => {
            tokens.push({
              id: tokenId++,
              text: subword,
              start: text.indexOf(word) + (index * 2),
              end: text.indexOf(word) + (index * 2) + subword.length,
              type: 'subword',
              length: subword.length,
              subword: true,
              parentWord: word
            });
          });
        } else {
          tokens.push({
            id: tokenId++,
            text: word,
            start: text.indexOf(word),
            end: text.indexOf(word) + word.length,
            type: 'word',
            length: word.length,
            subword: false
          });
        }
      } else {
        // Longer words get split into subwords
        const subwords = this.splitIntoGPTSubwords(word);
        subwords.forEach((subword, index) => {
          tokens.push({
            id: tokenId++,
            text: subword,
            start: text.indexOf(word) + (index * 2),
            end: text.indexOf(word) + (index * 2) + subword.length,
            type: 'subword',
            length: subword.length,
            subword: true,
            parentWord: word
          });
        });
      }
    });

    return tokens;
  }

  splitIntoGPTSubwords(word) {
    // More realistic GPT-style subword splitting
    if (word.length <= 3) return [word];
    
    // Try to split on common patterns
    if (word.includes('-')) {
      return word.split('-');
    }
    
    // Split on common prefixes/suffixes
    const prefixes = ['un', 're', 'in', 'im', 'dis', 'en', 'em'];
    const suffixes = ['ing', 'ed', 'er', 'est', 'ly', 'ful', 'less', 'ness'];
    
    for (const prefix of prefixes) {
      if (word.startsWith(prefix) && word.length > prefix.length + 2) {
        return [prefix, word.substring(prefix.length)];
      }
    }
    
    for (const suffix of suffixes) {
      if (word.endsWith(suffix) && word.length > suffix.length + 2) {
        return [word.substring(0, word.length - suffix.length), suffix];
      }
    }
    
    // Default splitting
    const mid = Math.ceil(word.length / 2);
    return [word.substring(0, mid), word.substring(mid)];
  }

  simulateBERTTokenization(text) {
    // Simulate BERT style tokenization (WordPiece)
    const words = text.split(/\s+/);
    const tokens = [];
    let tokenId = 0;
    
    // Add [CLS] token at the beginning
    tokens.push({
      id: tokenId++,
      text: '[CLS]',
      start: 0,
      end: 0,
      type: 'special',
      length: 5,
      subword: false
    });

    words.forEach(word => {
      if (word.length <= 3) {
        // Very short words become single tokens
        tokens.push({
          id: tokenId++,
          text: word,
          start: text.indexOf(word),
          end: text.indexOf(word) + word.length,
          type: 'word',
          length: word.length,
          subword: false
        });
      } else if (word.length <= 5) {
        // Medium words might get split
        if (Math.random() > 0.6) { // 40% chance of splitting
          const subwords = this.splitIntoBERTSubwords(word);
          subwords.forEach((subword, index) => {
            tokens.push({
              id: tokenId++,
              text: index === 0 ? subword : '##' + subword,
              start: text.indexOf(word) + (index * 2),
              end: text.indexOf(word) + (index * 2) + subword.length,
              type: 'subword',
              length: subword.length + (index > 0 ? 2 : 0),
              subword: true,
              parentWord: word
            });
          });
        } else {
          tokens.push({
            id: tokenId++,
            text: word,
            start: text.indexOf(word),
            end: text.indexOf(word) + word.length,
            type: 'word',
            length: word.length,
            subword: false
          });
        }
      } else {
        // Longer words get split into subwords
        const subwords = this.splitIntoBERTSubwords(word);
        subwords.forEach((subword, index) => {
          tokens.push({
            id: tokenId++,
            text: index === 0 ? subword : '##' + subword,
            start: text.indexOf(word) + (index * 2),
            end: text.indexOf(word) + (index * 2) + subword.length,
            type: 'subword',
            length: subword.length + (index > 0 ? 2 : 0),
            subword: true,
            parentWord: word
          });
        });
      }
    });

    // Add [SEP] token at the end
    tokens.push({
      id: tokenId++,
      text: '[SEP]',
      start: text.length,
      end: text.length,
      type: 'special',
      length: 5,
      subword: false
    });

    return tokens;
  }

  simulateRoBERTaTokenization(text) {
    // RoBERTa is similar to BERT but with different preprocessing
    return this.simulateBERTTokenization(text);
  }

  splitIntoBERTSubwords(word) {
    // BERT-style WordPiece subword splitting
    if (word.length <= 3) return [word];
    
    // Try to split on common patterns
    if (word.includes('-')) {
      return word.split('-');
    }
    
    // Split on common prefixes/suffixes (more aggressive than GPT)
    const prefixes = ['un', 're', 'in', 'im', 'dis', 'en', 'em', 'pre', 'pro', 'sub', 'super'];
    const suffixes = ['ing', 'ed', 'er', 'est', 'ly', 'ful', 'less', 'ness', 'ment', 'tion', 'sion', 'able', 'ible'];
    
    for (const prefix of prefixes) {
      if (word.startsWith(prefix) && word.length > prefix.length + 2) {
        return [prefix, word.substring(prefix.length)];
      }
    }
    
    for (const suffix of suffixes) {
      if (word.endsWith(suffix) && word.length > suffix.length + 2) {
        return [word.substring(0, word.length - suffix.length), suffix];
      }
    }
    
    // More aggressive splitting for BERT
    if (word.length > 6) {
      const third = Math.ceil(word.length / 3);
      return [
        word.substring(0, third),
        word.substring(third, third * 2),
        word.substring(third * 2)
      ];
    }
    
    // Default splitting
    const mid = Math.ceil(word.length / 2);
    return [word.substring(0, mid), word.substring(mid)];
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
    if (!modelSelector) {
      console.error('Model selector element not found');
      return;
    }
    
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
    
    if (modelBadge) modelBadge.textContent = this.currentModel;
    if (modelType) {
      modelType.textContent = this.currentModel.includes('gpt') ? 'GPT-style' : 
                             this.currentModel.includes('bert') ? 'BERT-style' : 'Other';
    }
  }

  setupEventListeners() {
    // Analyze button
    const analyzeBtn = document.getElementById('analyzeBtn');
    if (analyzeBtn) {
      analyzeBtn.addEventListener('click', () => {
        this.analyzeTokenization();
      });
    }

    // Input text changes
    const inputText = document.getElementById('input-text');
    if (inputText) {
      inputText.addEventListener('input', () => {
        this.analyzeTokenization();
      });
    }

    // Parameter changes
    const addSpecialTokens = document.getElementById('addSpecialTokens');
    if (addSpecialTokens) {
      addSpecialTokens.addEventListener('change', () => {
        this.analyzeTokenization();
      });
    }

    const padding = document.getElementById('padding');
    if (padding) {
      padding.addEventListener('change', () => {
        this.analyzeTokenization();
      });
    }

    const truncation = document.getElementById('truncation');
    if (truncation) {
      truncation.addEventListener('change', () => {
        this.analyzeTokenization();
      });
    }

    const maxLength = document.getElementById('maxLength');
    if (maxLength) {
      maxLength.addEventListener('input', () => {
        this.analyzeTokenization();
      });
    }
  }

  async analyzeTokenization() {
    const inputText = document.getElementById('input-text')?.value;
    if (!inputText || !inputText.trim()) return;

    // Show loading state
    const analyzeBtn = document.getElementById('analyzeBtn');
    if (analyzeBtn) {
      analyzeBtn.disabled = true;
      analyzeBtn.textContent = 'Analyzing...';
    }

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Use the appropriate tokenizer
      const tokenizer = this.tokenizers[this.currentModel];
      if (tokenizer) {
        const tokens = tokenizer.tokenize(inputText);
        this.tokenizationResult = {
          originalText: inputText,
          tokens,
          totalTokens: tokens.length,
          model: this.currentModel,
          timestamp: new Date().toISOString()
        };
      } else {
        // Fallback to mock tokenization
        this.tokenizationResult = this.mockTokenize(inputText);
      }
      
      this.displayResults();
      this.hideError();
    } catch (error) {
      console.error('Tokenization error:', error);
      this.showError('Failed to tokenize text. Please try again.');
    } finally {
      if (analyzeBtn) {
        analyzeBtn.disabled = false;
        analyzeBtn.textContent = 'Analyze Tokenization';
      }
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
      length: word.length,
      subword: false
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
    if (!result) return;
    
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
    if (!tokenStats) return;
    
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
    if (!result) return;
    
    const tokenVisualizer = document.getElementById('tokenVisualizer');
    if (!tokenVisualizer) return;
    
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
                <span class="token-id">#${token.id}</span>
                <span class="token-type">${token.type}</span>
                ${token.subword ? '<span class="subword-indicator">🔗</span>' : ''}
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
                <span class="token-id">#${token.id}</span>
                <span class="token-type">${token.type}</span>
              </div>
              <div class="token-content">
                <div class="token-text">${token.text}</div>
                <div class="token-length">${token.length} chars</div>
              </div>
              ${token.subword ? '<div class="subword-badge">Subword</div>' : ''}
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  renderTokenDetails(result) {
    if (this.selectedToken === null || !result.tokens[this.selectedToken]) return '';
    
    const token = result.tokens[this.selectedToken];
    return `
      <div class="token-details">
        <h4 class="details-title">Token Details</h4>
        <div class="details-content">
          <div class="detail-row">
            <span class="detail-label">Text:</span>
            <span class="detail-value">"${token.text}"</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Position:</span>
            <span class="detail-value">${token.start} - ${token.end}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Type:</span>
            <span class="detail-value">${token.type}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Length:</span>
            <span class="detail-value">${token.length} characters</span>
          </div>
          ${token.subword ? `
            <div class="detail-row">
              <span class="detail-label">Subword of:</span>
              <span class="detail-value">${token.parentWord || 'Unknown'}</span>
            </div>
          ` : ''}
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
    return backgrounds[index % colors.length];
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
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.style.display = 'block';
    }
  }

  hideError() {
    const errorElement = document.getElementById('errorMessage');
    if (errorElement) {
      errorElement.style.display = 'none';
    }
  }
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, initializing Language Model Explorer...');
  try {
    window.explorer = new LanguageModelExplorer();
  } catch (error) {
    console.error('Failed to initialize Language Model Explorer:', error);
    
    // Show error message to user
    const fallback = document.querySelector('.fallback');
    if (fallback) {
      fallback.innerHTML = `
        <h1>Language Model Explorer</h1>
        <p style="color: #dc2626;">Error: Failed to load the interactive interface.</p>
        <p>Please check the browser console for more details or refresh the page.</p>
      `;
    }
  }
});