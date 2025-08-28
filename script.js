// Language Model Explorer - Main JavaScript

import { HTMLUtils } from './utils.js';

class LanguageModelExplorer {
  constructor() {
    this.currentModel = 'gpt2';
    this.currentView = 'flow';
    this.selectedToken = null;
    this.tokenizationResult = null;
    this.tokenizers = {};
    this.embeddingsData = null;
    this.currentStep = 'tokens';
    this.autoPlayInterval = null;
    
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
    
    // Setup embeddings functionality
    this.setupEmbeddings();
    
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

  setupEmbeddings() {
    this.setupEmbeddingsModelSelector();
    this.setupEmbeddingsEventListeners();
    this.setupNavigation();
    this.currentStep = 0;
    this.autoPlayInterval = null;
  }

  setupEmbeddingsModelSelector() {
    const models = [
      { id: 'gpt2', name: 'GPT-2', description: 'OpenAI GPT-2 (768D embeddings)' },
      { id: 'bert-base-uncased', name: 'BERT Base', description: 'Google BERT (768D embeddings)' },
      { id: 'roberta-base', name: 'RoBERTa Base', description: 'Facebook RoBERTa (768D embeddings)' }
    ];

    const modelSelector = document.getElementById('embeddingsModelSelector');
    if (!modelSelector) return;
    
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
        this.selectEmbeddingsModel(option.dataset.model);
      });
    });
  }

  selectEmbeddingsModel(modelId) {
    this.currentModel = modelId;
    
    // Update UI
    document.querySelectorAll('#embeddingsModelSelector .model-option').forEach(option => {
      option.classList.toggle('selected', option.dataset.model === modelId);
    });
    
    // Update tokenization model selector as well
    document.querySelectorAll('#modelSelector .model-option').forEach(option => {
      option.classList.toggle('selected', option.dataset.model === modelId);
    });
    
    this.updateModelInfo();
    
    // Re-run embeddings if we have text
    const inputText = document.getElementById('embeddings-input-text')?.value;
    if (inputText && inputText.trim()) {
      this.exploreEmbeddings();
    }
  }

  setupEmbeddingsEventListeners() {
    const exploreBtn = document.getElementById('exploreEmbeddingsBtn');
    if (exploreBtn) {
      exploreBtn.addEventListener('click', () => {
        this.exploreEmbeddings();
      });
    }

    const inputText = document.getElementById('embeddings-input-text');
    if (inputText) {
      inputText.addEventListener('input', () => {
        // Auto-explore after typing stops
        clearTimeout(this.typingTimeout);
        this.typingTimeout = setTimeout(() => {
          if (inputText.value.trim()) {
            this.exploreEmbeddings();
          }
        }, 500);
      });
    }

    // Pipeline navigation
    const prevBtn = document.getElementById('prevStep');
    const nextBtn = document.getElementById('nextStep');
    const autoPlayBtn = document.getElementById('autoPlay');

    if (prevBtn) prevBtn.addEventListener('click', () => this.previousStep());
    if (nextBtn) nextBtn.addEventListener('click', () => this.nextStep());
    if (autoPlayBtn) autoPlayBtn.addEventListener('click', () => this.toggleAutoPlay());

    // Step click handlers
    document.querySelectorAll('.step').forEach(step => {
      step.addEventListener('click', () => {
        const stepName = step.dataset.step;
        this.goToStep(stepName);
      });
    });
  }

  setupNavigation() {
    const navBtns = document.querySelectorAll('.nav-btn');
    navBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const page = btn.dataset.page;
        this.switchPage(page);
      });
    });
  }

  switchPage(page) {
    // Update navigation buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.page === page);
    });

    // Update page content
    document.querySelectorAll('.page-content').forEach(content => {
      content.classList.toggle('active', content.id === `${page}-page`);
    });

    // Reset embeddings pipeline if switching to embeddings page
    if (page === 'embeddings') {
      this.resetEmbeddingsPipeline();
    }
  }

  async exploreEmbeddings() {
    const inputText = document.getElementById('embeddings-input-text')?.value;
    if (!inputText || !inputText.trim()) {
      console.log('No input text provided');
      return;
    }

    try {
      console.log('Starting embeddings exploration for:', inputText);
      
      // Show loading state
      const exploreBtn = document.getElementById('exploreEmbeddingsBtn');
      if (exploreBtn) {
        exploreBtn.disabled = true;
        exploreBtn.textContent = 'Exploring...';
      }

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));

      // Generate embeddings
      this.generateEmbeddings(inputText);
      
      if (!this.embeddingsData) {
        throw new Error('Failed to generate embeddings data');
      }
      
      console.log('Embeddings generated successfully:', this.embeddingsData);
      
      // Show pipeline
      const pipeline = document.getElementById('embeddingsPipeline');
      if (pipeline) {
        pipeline.style.display = 'block';
        console.log('Pipeline displayed');
      } else {
        console.error('Pipeline element not found');
      }

      // Start with first step
      this.goToStep('tokens');

    } catch (error) {
      console.error('Embeddings error:', error);
      this.showEmbeddingsError(`Failed to generate embeddings: ${error.message}`);
    } finally {
      const exploreBtn = document.getElementById('exploreEmbeddingsBtn');
      if (exploreBtn) {
        exploreBtn.disabled = false;
        exploreBtn.textContent = 'Explore Embeddings';
      }
    }
  }

  generateEmbeddings(text) {
    console.log('Generating embeddings for text:', text);
    
    // Tokenize the text
    const tokenizer = this.tokenizers[this.currentModel];
    if (!tokenizer) {
      console.error('No tokenizer found for model:', this.currentModel);
      return;
    }
    
    try {
      const tokens = tokenizer.tokenize(text);
      console.log('Tokens generated:', tokens);
      
      // Generate dictionary embeddings first
      const dictionaryEmbeddings = this.generateDictionaryEmbeddings(tokens);
      console.log('Dictionary embeddings generated:', dictionaryEmbeddings.length);
      
      // Generate positional encoding
      const positionalEncoding = this.generatePositionalEncoding(tokens.length);
      console.log('Positional encoding generated:', positionalEncoding.length);
      
      // Now combine them (dictionaryEmbeddings and positionalEncoding are now available)
      const finalEmbeddings = this.combineEmbeddings(tokens.length, dictionaryEmbeddings, positionalEncoding);
      console.log('Final embeddings generated:', finalEmbeddings.length);
      
      this.embeddingsData = {
        tokens,
        dictionaryEmbeddings,
        positionalEncoding,
        finalEmbeddings
      };
      
      console.log('Embeddings data object created successfully');
    } catch (error) {
      console.error('Error in generateEmbeddings:', error);
      throw error;
    }
  }

  generateDictionaryEmbeddings(tokens) {
    // Simulate dictionary embeddings (random for demo)
    const embeddingDim = this.currentModel.includes('gpt') ? 768 : 768;
    return tokens.map(token => {
      const embedding = new Array(embeddingDim).fill(0).map(() => 
        (Math.random() - 0.5) * 2
      );
      return {
        token: token.text,
        embedding,
        magnitude: Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0))
      };
    });
  }

  generatePositionalEncoding(seqLength) {
    const embeddingDim = 768;
    const encoding = [];
    
    for (let pos = 0; pos < seqLength; pos++) {
      const posEncoding = new Array(embeddingDim).fill(0).map((_, i) => {
        if (i % 2 === 0) {
          return Math.sin(pos / Math.pow(10000, i / embeddingDim));
        } else {
          return Math.cos(pos / Math.pow(10000, (i - 1) / embeddingDim));
        }
      });
      encoding.push({
        position: pos,
        encoding: posEncoding,
        magnitude: Math.sqrt(posEncoding.reduce((sum, val) => sum + val * val, 0))
      });
    }
    
    return encoding;
  }

  combineEmbeddings(seqLength, dictionaryEmbeddings, positionalEncoding) {
    const embeddingDim = 768;
    const combined = [];
    
    for (let pos = 0; pos < seqLength; pos++) {
      const dictEmbedding = dictionaryEmbeddings[pos]?.embedding || new Array(embeddingDim).fill(0);
      const posEncoding = positionalEncoding[pos]?.encoding || new Array(embeddingDim).fill(0);
      
      const combinedEmbedding = dictEmbedding.map((val, i) => val + posEncoding[i]);
      combined.push({
        position: pos,
        embedding: combinedEmbedding,
        magnitude: Math.sqrt(combinedEmbedding.reduce((sum, val) => sum + val * val, 0))
      });
    }
    
    return combined;
  }

  goToStep(stepName) {
    const steps = ['tokens', 'dictionary', 'positional', 'final'];
    const stepIndex = steps.indexOf(stepName);
    
    if (stepIndex === -1) return;
    
    this.currentStep = stepIndex;
    
    // Update step indicators
    document.querySelectorAll('.step').forEach((step, index) => {
      step.classList.toggle('active', index === stepIndex);
    });

    // Update step content
    document.querySelectorAll('.pipeline-step').forEach((step, index) => {
      step.classList.toggle('active', index === stepIndex);
    });

    // Update navigation buttons
    const prevBtn = document.getElementById('prevStep');
    const nextBtn = document.getElementById('nextStep');
    
    if (prevBtn) prevBtn.disabled = stepIndex === 0;
    if (nextBtn) nextBtn.disabled = stepIndex === steps.length - 1;

    // Render step content
    this.renderStepContent(stepName);
  }

  renderStepContent(stepName) {
    switch (stepName) {
      case 'tokens':
        this.renderTokensStep();
        break;
      case 'dictionary':
        this.renderDictionaryStep();
        break;
      case 'positional':
        this.renderPositionalStep();
        break;
      case 'final':
        this.renderFinalStep();
        break;
    }
  }

  renderTokensStep() {
    if (!this.embeddingsData?.tokens) return;
    
    const tokenDisplay = document.getElementById('tokenDisplay');
    if (!tokenDisplay) return;
    
    tokenDisplay.innerHTML = this.embeddingsData.tokens.map((token, index) => `
      <div class="token-item-embedding" data-token-index="${index}">
        ${token.text}
      </div>
    `).join('');
  }

  renderDictionaryStep() {
    if (!this.embeddingsData?.dictionaryEmbeddings) return;
    
    const matrix = document.getElementById('dictionaryMatrix');
    const details = document.getElementById('dictionaryDetails');
    
    if (matrix) {
      matrix.innerHTML = this.createInteractiveDictionaryMatrix(
        this.embeddingsData.tokens,
        this.embeddingsData.dictionaryEmbeddings
      );
    }
    
    if (details) {
      details.innerHTML = this.createDictionaryDetails(
        this.embeddingsData.tokens,
        this.embeddingsData.dictionaryEmbeddings
      );
    }

    // Add interactive event listeners
    this.setupDictionaryInteractivity();
  }

  createInteractiveDictionaryMatrix(tokens, embeddings) {
    const maxDim = Math.min(12, embeddings[0]?.embedding?.length || 0);
    const maxTokens = Math.min(8, embeddings.length);
    
    // Create carousel items using utility
    const carouselItems = [
      {
        icon: '🔤',
        title: 'Token Input',
        description: 'Each word or subword becomes a unique token ID that gets looked up in the embedding dictionary.',
        content: this.createTokenExamples(tokens.slice(0, 3))
      },
      {
        icon: '📚',
        title: 'Embedding Table',
        description: 'Pre-trained lookup table with ~50,000 token vectors, each 768 dimensions. Total parameters: ~38M.',
        content: this.createEmbeddingInfo()
      },
      {
        icon: '🔍',
        title: 'Vector Lookup',
        description: 'Each token ID retrieves its corresponding 768D vector from the dictionary table.',
        content: this.createLookupExample()
      },
      {
        icon: '📊',
        title: 'Resulting Embeddings',
        description: 'The resulting matrix shows each token\'s embedding vector with color-coded values.',
        content: this.createEmbeddingFeatures()
      }
    ];

    const carousel = HTMLUtils.createCarousel(carouselItems);
    
    // Create the matrix using utility
    const matrixData = embeddings.slice(0, maxTokens).map(embedding => 
      embedding.embedding.slice(0, maxDim)
    );
    
    const matrixOptions = {
      title: 'Resulting 768D Vectors',
      maxRows: maxTokens,
      maxCols: maxDim,
      rowLabels: embeddings.slice(0, maxTokens).map((embedding, index) => 
        `${embedding.token} (Pos ${index})`
      ),
      cellRenderer: (value, rowIndex, colIndex) => {
        const color = this.getMatrixColor(value);
        const intensity = Math.min(Math.abs(value) * 2, 1);
        return `<span style="background-color: ${color}; opacity: ${intensity + 0.3}; padding: 2px; border-radius: 2px; color: white; font-size: 0.6rem;">${value.toFixed(2)}</span>`;
      }
    };

    const matrix = HTMLUtils.createMatrix(matrixData, matrixOptions);
    
    // Create controls using utility
    const controls = [
      HTMLUtils.createControlGroup('showValues', 'Show Numerical Values', 'Display the actual numbers in each embedding cell', 'checkbox', true),
      HTMLUtils.createControlGroup('showMagnitudes', 'Show Vector Magnitudes', 'Display the length (magnitude) of each token\'s embedding vector')
    ];

    return `
      ${HTMLUtils.createSectionHeader('Token → Embedding Dictionary Lookup', 'How tokens get converted to 768-dimensional vectors via the embedding dictionary')}
      ${carousel}
      <div class="dictionary-visualization">
        <div class="tokens-section">
          <h6>Input Tokens</h6>
          <div class="tokens-display">
            ${tokens.slice(0, maxTokens).map((token, index) => `
              <div class="token-badge" data-token-index="${index}">
                <span class="token-text">${token.text}</span>
                <span class="token-id">#${index}</span>
              </div>
            `).join('')}
          </div>
        </div>
        ${matrix}
      </div>
      <div class="dictionary-controls">
        ${controls.join('')}
      </div>
    `;
  }

  createTokenExamples(tokens) {
    const examples = tokens.map((token, index) => 
      `<span class="token-example">"${token.text}" → ID ${index}</span>`
    ).join('');
    
    return `<div class="token-examples">${examples}</div>`;
  }

  createEmbeddingInfo() {
    const stats = [
      { value: '~50,000', label: 'Vocabulary Size', description: 'Total unique tokens' },
      { value: '768', label: 'Embedding Dimension', description: 'Vector size per token' },
      { value: '~38M', label: 'Total Parameters', description: 'Model parameters' }
    ];
    
    return HTMLUtils.createStats(stats, 'grid');
  }

  createLookupExample() {
    const steps = [
      {
        title: 'Input',
        description: 'Token ID 1',
        example: 'Token ID 1'
      },
      {
        title: 'Output',
        description: '768-dimensional vector',
        example: '[0.23, -0.45, 0.67, ...] (768D)'
      }
    ];
    
    return HTMLUtils.createProcess(steps, false);
  }

  createEmbeddingFeatures() {
    const features = [
      '🎨 Color-coded by value',
      '📏 768 dimensions per token',
      '🔢 Interactive numerical display',
      '📊 Vector magnitude calculation'
    ];
    
    return `<div class="embedding-features">${features.map(f => `<div class="feature-item">${f}</div>`).join('')}</div>`;
  }

  createDictionaryDetails(tokens, embeddings) {
    if (!embeddings || embeddings.length === 0) return '<p>No data available</p>';
    
    const avgMagnitude = embeddings.reduce((sum, emb) => sum + emb.magnitude, 0) / embeddings.length;
    const maxMagnitude = Math.max(...embeddings.map(emb => emb.magnitude));
    const minMagnitude = Math.min(...embeddings.map(emb => emb.magnitude));
    
    return `
      <div class="dictionary-explanation">
        <h5>How Dictionary Embeddings Work</h5>
        
        <div class="explanation-step">
          <div class="step-icon">🔤</div>
          <div class="step-content">
            <h6>1. Token Input</h6>
            <p>Each word or subword becomes a unique token ID</p>
            <div class="token-examples">
              ${tokens.slice(0, 3).map((token, index) => `
                <span class="example-token">"${token.text}" → ID ${index}</span>
              `).join('')}
            </div>
          </div>
        </div>
        
        <div class="explanation-step">
          <div class="step-icon">📚</div>
          <div class="step-content">
            <h6>2. Embedding Table</h6>
            <p>Pre-trained vectors for each token in the vocabulary</p>
            <div class="embedding-info">
              <span class="info-item">Vocabulary Size: ~50,000 tokens</span>
              <span class="info-item">Embedding Dimension: 768</span>
              <span class="info-item">Total Parameters: ~38M</span>
            </div>
          </div>
        </div>
        
        <div class="explanation-step">
          <div class="step-icon">🔍</div>
          <div class="step-content">
            <h6>3. Vector Lookup</h6>
            <p>Each token ID retrieves its corresponding 768D vector</p>
            <div class="lookup-example">
              <span class="example-lookup">"${tokens[0]?.text || 'hello'}" → [0.23, -0.45, 0.67, ...]</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="dictionary-stats">
        <h5>Embedding Statistics</h5>
        <div class="stat-item">
          <span class="stat-label">Average Magnitude:</span>
          <span class="stat-value">${avgMagnitude.toFixed(3)}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Max Magnitude:</span>
          <span class="stat-value">${maxMagnitude.toFixed(3)}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Min Magnitude:</span>
          <span class="stat-value">${minMagnitude.toFixed(3)}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Embedding Dimension:</span>
          <span class="stat-value">${embeddings[0]?.embedding?.length || 0}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Sequence Length:</span>
          <span class="stat-value">${embeddings.length}</span>
        </div>
      </div>
      
      <div class="interactive-features">
        <h5>Interactive Features</h5>
        <ul class="feature-list">
          <li>🎯 <strong>Click tokens</strong> to highlight their embeddings</li>
          <li>🔍 <strong>Hover over cells</strong> to see detailed values</li>
          <li>📊 <strong>Toggle controls</strong> to customize the view</li>
          <li>🎨 <strong>Color coding</strong> shows positive/negative values</li>
        </ul>
      </div>
    `;
  }

  setupDictionaryInteractivity() {
    // Token click highlighting
    document.querySelectorAll('.token-badge').forEach(badge => {
      badge.addEventListener('click', () => {
        const tokenIndex = parseInt(badge.dataset.tokenIndex);
        this.highlightTokenEmbedding(tokenIndex);
      });
    });

    // Embedding cell hover effects
    document.querySelectorAll('.embedding-cell').forEach(cell => {
      cell.addEventListener('mouseenter', () => {
        const tokenIndex = parseInt(cell.dataset.tokenIndex);
        const dimIndex = parseInt(cell.dataset.dimIndex);
        this.highlightCell(tokenIndex, dimIndex);
      });
      
      cell.addEventListener('mouseleave', () => {
        this.clearHighlights();
      });
    });

    // Control checkboxes
    const showValues = document.getElementById('showValues');
    const showMagnitudes = document.getElementById('showMagnitudes');

    if (showValues) {
      showValues.addEventListener('change', () => {
        this.toggleValueDisplay();
      });
    }

    if (showMagnitudes) {
      showMagnitudes.addEventListener('change', () => {
        this.toggleMagnitudeDisplay();
      });
    }

    // Carousel functionality
    this.setupCarousel();
  }

  setupCarousel() {
    const carousel = document.querySelector('.instructional-carousel');
    if (!carousel) return;

    const items = carousel.querySelectorAll('.carousel-item');
    const dots = carousel.querySelectorAll('.dot');
    const prevBtn = carousel.querySelector('.carousel-btn.prev');
    const nextBtn = carousel.querySelector('.carousel-btn.next');
    
    let currentIndex = 0;

    const showItem = (index) => {
      items.forEach((item, i) => {
        item.classList.toggle('active', i === index);
      });
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
      });
      currentIndex = index;
    };

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        const newIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
        showItem(newIndex);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        const newIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
        showItem(newIndex);
      });
    }

    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        showItem(index);
      });
    });

    // No auto-advance - let users click through as they please
  }

  toggleMagnitudeDisplay() {
    const isEnabled = document.getElementById('showMagnitudes')?.checked;
    document.querySelectorAll('.vector-magnitude').forEach(magnitude => {
      magnitude.style.display = isEnabled ? 'block' : 'none';
    });
  }

  toggleValueDisplay() {
    const isEnabled = document.getElementById('showValues')?.checked;
    document.querySelectorAll('.cell-value').forEach(value => {
      value.style.display = isEnabled ? 'block' : 'none';
    });
  }

  highlightTokenEmbedding(tokenIndex) {
    // Clear previous highlights
    this.clearHighlights();
    
    // Highlight the selected token
    const tokenBadge = document.querySelector(`.token-badge[data-token-index="${tokenIndex}"]`);
    if (tokenBadge) {
      tokenBadge.classList.add('highlighted');
    }
    
    // Highlight the corresponding matrix row
    const matrixRow = document.querySelector(`.matrix-row[data-token-index="${tokenIndex}"]`);
    if (matrixRow) {
      matrixRow.classList.add('highlighted');
    }
  }

  highlightCell(tokenIndex, dimIndex) {
    // Highlight the specific cell
    const cell = document.querySelector(`.embedding-cell[data-token-index="${tokenIndex}"][data-dim-index="${dimIndex}"]`);
    if (cell) {
      cell.classList.add('cell-highlighted');
    }
    
    // Highlight the corresponding token and dimension
    const tokenBadge = document.querySelector(`.token-badge[data-token-index="${tokenIndex}"]`);
    if (tokenBadge) {
      tokenBadge.classList.add('dimension-highlighted');
    }
    
    const dimLabel = document.querySelector(`.dim-label:nth-child(${dimIndex + 1})`);
    if (dimLabel) {
      dimLabel.classList.add('dimension-highlighted');
    }
  }

  clearHighlights() {
    document.querySelectorAll('.highlighted, .cell-highlighted, .dimension-highlighted').forEach(el => {
      el.classList.remove('highlighted', 'cell-highlighted', 'dimension-highlighted');
    });
  }

  toggleTokenComparison() {
    const isEnabled = document.getElementById('compareTokens')?.checked;
    if (isEnabled) {
      this.startTokenComparison();
    } else {
      this.stopTokenComparison();
    }
  }

  startTokenComparison() {
    const tokens = document.querySelectorAll('.token-badge');
    let currentIndex = 0;
    
    this.tokenComparisonInterval = setInterval(() => {
      this.highlightTokenEmbedding(currentIndex);
      currentIndex = (currentIndex + 1) % tokens.length;
    }, 1000);
  }

  stopTokenComparison() {
    if (this.tokenComparisonInterval) {
      clearInterval(this.tokenComparisonInterval);
      this.tokenComparisonInterval = null;
      this.clearHighlights();
    }
  }

  renderPositionalStep() {
    if (!this.embeddingsData?.positionalEncoding) return;
    
    const heatmap = document.getElementById('positionalHeatmap');
    const details = document.getElementById('dictionaryDetails');
    
    if (heatmap) {
      heatmap.innerHTML = this.createInteractivePositionalHeatmap(
        this.embeddingsData.positionalEncoding
      );
    }
    
    if (details) {
      details.innerHTML = this.createPositionalDetails(
        this.embeddingsData.positionalEncoding
      );
    }

    // Add interactive event listeners
    this.setupPositionalInteractivity();
  }

  createInteractivePositionalHeatmap(encoding) {
    const maxDim = Math.min(12, encoding[0]?.encoding?.length || 0);
    const maxPos = Math.min(6, encoding.length);
    
    // Create tabs using utility
    const tabs = [
      {
        id: 'problem',
        label: 'The Problem',
        content: this.createProblemTab()
      },
      {
        id: 'solution',
        label: 'The Solution',
        content: this.createSolutionTab()
      },
      {
        id: 'calculation',
        label: 'Calculation',
        content: this.createCalculationTab()
      },
      {
        id: 'transformation',
        label: 'Transformation',
        content: this.createTransformationTab()
      }
    ];

    const tabsHtml = HTMLUtils.createTabs(tabs);
    
    // Create the heatmap using utility
    const heatmapData = Array.from({length: maxDim}, (_, dim) => 
      Array.from({length: maxPos}, (_, pos) => encoding[pos]?.encoding[dim] || 0)
    );
    
    const heatmapOptions = {
      title: 'Positional Encoding Values',
      maxRows: maxDim,
      maxCols: maxPos,
      rowLabels: Array.from({length: maxDim}, (_, i) => `Dim ${i}`),
      cellRenderer: (value, rowIndex, colIndex) => {
        const color = this.getPositionalColor(value);
        const intensity = Math.min(Math.abs(value) * 1.5, 1);
        const isEven = rowIndex % 2 === 0;
        const functionType = isEven ? 'sin' : 'cos';
        
        return `
          <div style="
            background-color: ${color}; 
            opacity: ${intensity + 0.3}; 
            width: 100%; 
            height: 100%; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            position: relative;
            border-radius: 4px;
          ">
            <span style="font-size: 0.6rem; color: white; text-shadow: 0 1px 2px rgba(0,0,0,0.5);">${value.toFixed(3)}</span>
            <div style="
              position: absolute; 
              top: 2px; 
              right: 2px; 
              font-size: 0.5rem; 
              background: rgba(0,0,0,0.6); 
              color: white; 
              padding: 1px 3px; 
              border-radius: 2px;
            ">${functionType}</div>
          </div>
        `;
      }
    };

    const heatmap = HTMLUtils.createMatrix(heatmapData, heatmapOptions);
    
    // Create color legend using utility
    const legendItems = [
      { color: 'var(--teal)', label: 'Positive Values' },
      { color: 'var(--red)', label: 'Negative Values' },
      { color: 'var(--grey)', label: 'Zero Values' },
      { color: 'var(--teal)', colorClass: 'function-sin', label: 'Sine Function (even dims)' },
      { color: 'var(--green)', colorClass: 'function-cos', label: 'Cosine Function (odd dims)' }
    ];

    const colorLegend = HTMLUtils.createColorLegend(legendItems);
    
    // Create key insights using utility
    const insights = [
      {
        value: '🎯',
        label: 'Unique Patterns',
        description: 'Each position gets a completely unique encoding pattern across all 768 dimensions'
      },
      {
        value: '📏',
        label: 'Relative Distances',
        description: 'The model can learn relationships between positions (e.g., "next to", "far from")'
      },
      {
        value: '🚀',
        label: 'Generalization',
        description: 'Works for sequences longer than training data due to mathematical properties'
      },
      {
        value: '⚡',
        label: 'No Parameters',
        description: 'Fixed mathematical function, no training needed - always works the same way'
      }
    ];

    const insightsHtml = HTMLUtils.createStats(insights, 'grid');
    
    return `
      ${HTMLUtils.createSectionHeader('Positional Encoding: Why and How', 'Understanding how transformers encode position information in sequences')}
      <div class="positional-education">
        ${tabsHtml}
      </div>
      <div class="positional-visualization">
        <h6>🎯 Interactive Positional Encoding Visualization</h6>
        <p class="visualization-subtitle">Hover over cells to see actual calculated values and explore the patterns</p>
        
        <div class="visualization-controls">
          ${HTMLUtils.createControlGroup('showPositionalValues', 'Show Numerical Values', 'Display the actual numbers in each cell', 'checkbox', true)}
          ${HTMLUtils.createControlGroup('highlightPatterns', 'Highlight Patterns', 'Distinguish between sine and cosine functions')}
        </div>
        
        ${heatmap}
        ${colorLegend}
      </div>
      <div class="key-insights">
        <h6>🔑 Key Insights About Positional Encoding</h6>
        ${insightsHtml}
      </div>
    `;
  }

  createProblemTab() {
    return `
      <div class="problem-illustration">
        <h6>🤔 Why Do We Need Positional Encoding?</h6>
        <div class="problem-example">
          <div class="sequence-example">
            <div class="token-sequence">
              <span class="token">"I"</span>
              <span class="token">"love"</span>
              <span class="token">"you"</span>
            </div>
            <div class="sequence-example">
              <span class="token">"You"</span>
              <span class="token">"love"</span>
              <span class="token">"me"</span>
            </div>
          </div>
          <p class="problem-text">
            <strong>Problem:</strong> Without positional information, transformers see both sequences as identical 
            (same tokens, different meaning). They need to know the <em>order</em> of tokens!
          </p>
        </div>
      </div>
    `;
  }

  createSolutionTab() {
    const steps = [
      {
        title: 'Add unique position information to each token',
        description: 'Each position gets a unique identifier'
      },
      {
        title: 'Use mathematical functions (sine/cosine) for smooth patterns',
        description: 'Creates smooth, learnable patterns'
      },
      {
        title: 'Each position gets a unique "fingerprint"',
        description: 'No two positions are identical'
      },
      {
        title: 'Model can learn relative distances between positions',
        description: 'Understands spatial relationships'
      }
    ];

    return `
      <div class="solution-illustration">
        <h6>💡 How Positional Encoding Solves This</h6>
        ${HTMLUtils.createProcess(steps)}
      </div>
    `;
  }

  createCalculationTab() {
    return `
      <div class="calculation-illustration">
        <h6>🧮 Mathematical Formulas</h6>
        <div class="formula-explanation">
          <div class="formula-box">
            <h6>For Even Dimensions (2i):</h6>
            <div class="formula-math">PE(pos, 2i) = sin(pos/10000^(2i/d_model))</div>
            <p>Uses sine function for smooth, periodic patterns</p>
          </div>
          <div class="formula-box">
            <h6>For Odd Dimensions (2i+1):</h6>
            <div class="formula-math">PE(pos, 2i+1) = cos(pos/10000^(2i/d_model))</div>
            <p>Uses cosine function, offset by 90° from sine</p>
          </div>
          <div class="formula-params">
            <p><strong>Where:</strong></p>
            <ul>
              <li><strong>pos</strong> = token position (0, 1, 2, ...)</li>
              <li><strong>d_model</strong> = embedding dimension (768)</li>
              <li><strong>i</strong> = dimension index (0, 1, 2, ...)</li>
            </ul>
          </div>
        </div>
      </div>
    `;
  }

  createTransformationTab() {
    const steps = [
      {
        title: 'Original Embeddings',
        description: 'Dictionary embeddings have no position information',
        example: 'Token "hello": [0.23, -0.45, 0.67, ...] (768D)'
      },
      {
        title: 'Add Positional Encoding',
        description: 'Position-specific values are added to each dimension',
        example: 'Position 0 encoding: [0.00, 1.00, 0.00, ...] (768D)'
      },
      {
        title: 'Final Embeddings',
        description: 'Combined embeddings now contain position information',
        example: 'Final "hello" at pos 0: [0.23, 0.55, 0.67, ...] (768D)'
      }
    ];

    return `
      <div class="transformation-illustration">
        <h6>🔄 How It Transforms Embeddings</h6>
        ${HTMLUtils.createProcess(steps)}
      </div>
    `;
  }

  createPositionalDetails(encoding) {
    if (!encoding || encoding.length === 0) return '<p>No data available</p>';
    
    const avgMagnitude = encoding.reduce((sum, enc) => sum + enc.magnitude, 0) / encoding.length;
    const maxMagnitude = Math.max(...encoding.map(enc => enc.magnitude));
    const minMagnitude = Math.min(...encoding.map(enc => enc.magnitude));
    
    return `
      <div class="positional-explanation">
        <h5>How Positional Encoding Works</h5>
        
        <div class="explanation-section">
          <h6>🔢 The Problem</h6>
          <p>Transformers process all tokens simultaneously, so they need a way to know the order/position of tokens in the sequence.</p>
        </div>
        
        <div class="explanation-section">
          <h6>📍 The Solution</h6>
          <p>Add position-specific information to each token's embedding using mathematical functions (sine and cosine).</p>
        </div>
        
        <div class="formula-section">
          <h6>📐 Mathematical Formulas</h6>
          <div class="formula-container">
            <div class="formula">
              <span class="formula-label">Even dimensions (2i):</span>
              <span class="formula-math">PE(pos, 2i) = sin(pos/10000^(2i/d_model))</span>
            </div>
            <div class="formula">
              <span class="formula-label">Odd dimensions (2i+1):</span>
              <span class="formula-math">PE(pos, 2i+1) = cos(pos/10000^(2i/d_model))</span>
            </div>
          </div>
          <p class="formula-note">Where d_model = 768 (embedding dimension)</p>
        </div>
        
        <div class="explanation-section">
          <h6>🎯 Why This Works</h6>
          <ul class="benefits-list">
            <li><strong>Unique patterns:</strong> Each position gets a unique encoding pattern</li>
            <li><strong>Relative distances:</strong> Model can learn relationships between positions</li>
            <li><strong>Generalization:</strong> Works for sequences longer than training data</li>
            <li><strong>No parameters:</strong> Fixed mathematical function, no training needed</li>
          </ul>
        </div>
      </div>
      
      <div class="positional-stats">
        <h5>Positional Encoding Statistics</h5>
        <div class="stat-item">
          <span class="stat-label">Sequence Length:</span>
          <span class="stat-value">${encoding.length}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Embedding Dimension:</span>
          <span class="stat-value">${encoding[0]?.encoding?.length || 0}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Average Magnitude:</span>
          <span class="stat-value">${avgMagnitude.toFixed(3)}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Max Magnitude:</span>
          <span class="stat-value">${maxMagnitude.toFixed(3)}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Min Magnitude:</span>
          <span class="stat-value">${minMagnitude.toFixed(3)}</span>
        </div>
      </div>
      
      <div class="interactive-features">
        <h5>Interactive Features</h5>
        <ul class="feature-list">
          <li>🔍 <strong>Hover over cells</strong> to see exact values</li>
          <li>📊 <strong>Color coding</strong> shows positive/negative patterns</li>
          <li>📍 <strong>Position labels</strong> show token order</li>
          <li>📐 <strong>Dimension labels</strong> show embedding features</li>
        </ul>
      </div>
    `;
  }

  setupPositionalInteractivity() {
    // Tab functionality
    this.setupPositionalTabs();
    
    // Heatmap cell hover effects
    document.querySelectorAll('.heatmap-cell').forEach(cell => {
      cell.addEventListener('mouseenter', () => {
        const position = parseInt(cell.dataset.position);
        const dimension = parseInt(cell.dataset.dimension);
        this.highlightPositionalCell(position, dimension);
      });
      
      cell.addEventListener('mouseleave', () => {
        this.clearPositionalHighlights();
      });
    });

    // Visualization controls
    const showPositionalValues = document.getElementById('showPositionalValues');
    const highlightPatterns = document.getElementById('highlightPatterns');

    if (showPositionalValues) {
      showPositionalValues.addEventListener('change', () => {
        this.togglePositionalValues();
      });
    }

    if (highlightPatterns) {
      highlightPatterns.addEventListener('change', () => {
        this.togglePatternHighlighting();
      });
    }
  }

  setupPositionalTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const tabName = btn.dataset.tab;
        this.switchPositionalTab(tabName);
      });
    });
  }

  switchPositionalTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabName);
    });

    // Update tab content
    document.querySelectorAll('.tab-pane').forEach(pane => {
      pane.classList.toggle('active', pane.id === tabName);
    });
  }

  togglePositionalValues() {
    const isEnabled = document.getElementById('showPositionalValues')?.checked;
    document.querySelectorAll('.heatmap-value').forEach(value => {
      value.style.display = isEnabled ? 'block' : 'none';
    });
  }

  togglePatternHighlighting() {
    const isEnabled = document.getElementById('highlightPatterns')?.checked;
    if (isEnabled) {
      this.highlightSineCosinePatterns();
    } else {
      this.clearPatternHighlights();
    }
  }

  highlightSineCosinePatterns() {
    // Highlight sine vs cosine patterns
    document.querySelectorAll('.heatmap-cell').forEach(cell => {
      const functionType = cell.dataset.function;
      if (functionType === 'sin') {
        cell.style.border = '2px solid var(--teal)';
      } else {
        cell.style.border = '2px solid var(--green)';
      }
    });
  }

  clearPatternHighlights() {
    document.querySelectorAll('.heatmap-cell').forEach(cell => {
      cell.style.border = '1px solid var(--light-grey)';
    });
  }

  highlightPositionalCell(position, dimension) {
    // Highlight the specific cell
    const cell = document.querySelector(`.heatmap-cell[data-position="${position}"][data-dimension="${dimension}"]`);
    if (cell) {
      cell.classList.add('cell-highlighted');
    }
    
    // Highlight the corresponding position and dimension labels
    const positionLabel = document.querySelector(`.position-label:nth-child(${position + 2})`);
    if (positionLabel) {
      positionLabel.classList.add('label-highlighted');
    }
    
    const dimLabel = document.querySelector(`.dim-label-vertical:nth-child(${dimension + 1})`);
    if (dimLabel) {
      dimLabel.classList.add('label-highlighted');
    }
  }

  clearPositionalHighlights() {
    document.querySelectorAll('.cell-highlighted, .label-highlighted').forEach(el => {
      el.classList.remove('cell-highlighted', 'label-highlighted');
    });
  }

  getPositionalColor(value) {
    // Create a color gradient for positional encoding
    // Positive values: Teal to Green (sine function)
    // Negative values: Light red to darker red (cosine function)
    // Zero values: Neutral grey
    
    const intensity = Math.min(Math.abs(value) * 1.5, 1);
    
    if (value > 0) {
      // Teal to Green gradient for positive values (sine)
      if (intensity < 0.5) {
        return `rgba(20, 184, 166, ${intensity + 0.3})`; // Light teal
      } else {
        return `rgba(16, 185, 129, ${intensity + 0.3})`; // Green
      }
    } else if (value < 0) {
      // Light red to darker red for negative values (cosine)
      if (intensity < 0.5) {
        return `rgba(239, 68, 68, ${intensity + 0.3})`; // Light red
      } else {
        return `rgba(185, 28, 28, ${intensity + 0.3})`; // Darker red
      }
    } else {
      // Neutral grey for zero values
      return 'rgba(156, 163, 175, 0.4)';
    }
  }

  renderFinalStep() {
    if (!this.embeddingsData?.finalEmbeddings) return;
    
    const visual3d = document.getElementById('finalEmbeddings3D');
    const stats = document.getElementById('embeddingStats');
    
    if (visual3d) {
      visual3d.innerHTML = this.create3DVisualization(
        this.embeddingsData.finalEmbeddings
      );
    }
    
    if (stats) {
      stats.innerHTML = this.createEmbeddingStats(
        this.embeddingsData.finalEmbeddings
      );
    }
  }

  createEmbeddingMatrix(embeddings, title) {
    const maxDim = Math.min(10, embeddings[0]?.embedding?.length || 0);
    const maxTokens = Math.min(5, embeddings.length);
    
    let matrix = `<h5>${title} Matrix (${maxTokens} × ${maxDim})</h5>`;
    matrix += '<div class="matrix-container">';
    
    for (let i = 0; i < maxTokens; i++) {
      matrix += '<div class="matrix-row">';
      for (let j = 0; j < maxDim; j++) {
        const value = embeddings[i]?.embedding[j] || 0;
        const color = this.getMatrixColor(value);
        matrix += `<div class="matrix-cell" style="background-color: ${color}">${value.toFixed(2)}</div>`;
      }
      matrix += '</div>';
    }
    
    matrix += '</div>';
    return matrix;
  }

  createPositionalHeatmap(encoding) {
    const maxDim = Math.min(20, encoding[0]?.encoding?.length || 0);
    const maxPos = Math.min(10, encoding.length);
    
    let heatmap = '<h5>Positional Encoding Heatmap</h5>';
    heatmap += '<div class="heatmap-container">';
    
    for (let pos = 0; pos < maxPos; pos++) {
      heatmap += '<div class="heatmap-row">';
      for (let dim = 0; dim < maxDim; dim++) {
        const value = encoding[pos]?.encoding[dim] || 0;
        const color = this.getMatrixColor(value);
        heatmap += `<div class="heatmap-cell" style="background-color: ${color}" title="Pos ${pos}, Dim ${dim}: ${value.toFixed(3)}"></div>`;
      }
      heatmap += '</div>';
    }
    
    heatmap += '</div>';
    return heatmap;
  }

  create3DVisualization(embeddings) {
    return `
      <h5>3D Embedding Visualization</h5>
      <div class="3d-container">
        <p>Interactive 3D visualization would go here</p>
        <p>Showing ${embeddings.length} tokens with ${embeddings[0]?.embedding?.length || 0} dimensions</p>
      </div>
    `;
  }

  createEmbeddingDetails(embeddings, type) {
    if (!embeddings || embeddings.length === 0) return '<p>No data available</p>';
    
    const avgMagnitude = embeddings.reduce((sum, emb) => sum + emb.magnitude, 0) / embeddings.length;
    const maxMagnitude = Math.max(...embeddings.map(emb => emb.magnitude));
    const minMagnitude = Math.min(...embeddings.map(emb => emb.magnitude));
    
    return `
      <h5>${type.charAt(0).toUpperCase() + type.slice(1)} Details</h5>
      <div class="detail-item">
        <span class="detail-label">Average Magnitude:</span>
        <span class="detail-value">${avgMagnitude.toFixed(3)}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Max Magnitude:</span>
        <span class="detail-value">${maxMagnitude.toFixed(3)}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Min Magnitude:</span>
        <span class="detail-value">${minMagnitude.toFixed(3)}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Embedding Dimension:</span>
        <span class="detail-value">${embeddings[0]?.embedding?.length || 0}</span>
      </div>
    `;
  }

  createEmbeddingStats(embeddings) {
    if (!embeddings || embeddings.length === 0) return '<p>No data available</p>';
    
    const avgMagnitude = embeddings.reduce((sum, emb) => sum + emb.magnitude, 0) / embeddings.length;
    const totalMagnitude = embeddings.reduce((sum, emb) => sum + emb.magnitude, 0);
    
    return `
      <h5>Final Embedding Statistics</h5>
      <div class="detail-item">
        <span class="detail-label">Sequence Length:</span>
        <span class="detail-value">${embeddings.length}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Average Magnitude:</span>
        <span class="detail-value">${avgMagnitude.toFixed(3)}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Total Magnitude:</span>
        <span class="detail-value">${totalMagnitude.toFixed(3)}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Model:</span>
        <span class="detail-value">${this.currentModel}</span>
      </div>
    `;
  }

  getMatrixColor(value) {
    // Create a color gradient that better matches the teal/green theme
    // Positive values: Teal to Green gradient
    // Negative values: Light red to darker red (complementary to teal)
    // Zero values: Neutral grey
    
    const intensity = Math.min(Math.abs(value) * 2, 1);
    
    if (value > 0) {
      // Teal to Green gradient for positive values
      if (intensity < 0.5) {
        return `rgba(20, 184, 166, ${intensity + 0.3})`; // Light teal
      } else {
        return `rgba(16, 185, 129, ${intensity + 0.3})`; // Green
      }
    } else if (value < 0) {
      // Light red to darker red for negative values (complementary to teal)
      if (intensity < 0.5) {
        return `rgba(239, 68, 68, ${intensity + 0.3})`; // Light red
      } else {
        return `rgba(185, 28, 28, ${intensity + 0.3})`; // Darker red
      }
    } else {
      // Neutral grey for zero values
      return 'rgba(156, 163, 175, 0.4)';
    }
  }

  previousStep() {
    if (this.currentStep > 0) {
      this.goToStep(['tokens', 'dictionary', 'positional', 'final'][this.currentStep - 1]);
    }
  }

  nextStep() {
    if (this.currentStep < 3) {
      this.goToStep(['tokens', 'dictionary', 'positional', 'final'][this.currentStep + 1]);
    }
  }

  toggleAutoPlay() {
    const autoPlayBtn = document.getElementById('autoPlay');
    if (!autoPlayBtn) return;
    
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = null;
      autoPlayBtn.textContent = '▶ Auto-play';
    } else {
      this.autoPlayInterval = setInterval(() => {
        if (this.currentStep < 3) {
          this.nextStep();
        } else {
          this.goToStep('tokens');
        }
      }, 2000);
      autoPlayBtn.textContent = '⏸ Stop';
    }
  }

  resetEmbeddingsPipeline() {
    this.currentStep = 0;
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = null;
    }
    
    const autoPlayBtn = document.getElementById('autoPlay');
    if (autoPlayBtn) autoPlayBtn.textContent = '▶ Auto-play';
    
    // Reset step indicators
    document.querySelectorAll('.step').forEach((step, index) => {
      step.classList.toggle('active', index === 0);
    });
  }

  showEmbeddingsError(message) {
    const errorElement = document.getElementById('embeddingsError');
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.style.display = 'block';
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