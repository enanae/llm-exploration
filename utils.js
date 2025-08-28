// Utility functions for HTML generation and common components

export class HTMLUtils {
  // Create a card container with consistent styling
  static createCard(content, className = '') {
    return `<div class="card ${className}">${content}</div>`;
  }

  // Create a section header with consistent styling
  static createSectionHeader(title, subtitle = '', icon = '') {
    const iconHtml = icon ? `<span class="section-icon">${icon}</span>` : '';
    const subtitleHtml = subtitle ? `<p class="section-subtitle">${subtitle}</p>` : '';
    
    return `
      <div class="section-header">
        ${iconHtml}
        <h5>${title}</h5>
        ${subtitleHtml}
      </div>
    `;
  }

  // Create a grid container with consistent spacing
  static createGrid(items, columns = 'auto-fit', minWidth = '250px', gap = '1.5rem', className = '') {
    return `
      <div class="grid grid-${columns} min-${minWidth} gap-${gap} ${className}">
        ${items.join('')}
      </div>
    `;
  }

  // Create a control group with label and description
  static createControlGroup(id, label, description, type = 'checkbox', checked = false, className = '') {
    const checkedAttr = checked ? 'checked' : '';
    return `
      <div class="control-group ${className}">
        <label class="control-label">
          <input type="${type}" id="${id}" class="control-${type}" ${checkedAttr}>
          ${label}
        </label>
        <span class="control-description">${description}</span>
      </div>
    `;
  }

  // Create a button with consistent styling
  static createButton(text, className = '', icon = '', disabled = false) {
    const disabledAttr = disabled ? 'disabled' : '';
    const iconHtml = icon ? `<span class="btn-icon">${icon}</span>` : '';
    
    return `
      <button class="btn ${className}" ${disabledAttr}>
        ${iconHtml}
        ${text}
      </button>
    `;
  }

  // Create a tab navigation system
  static createTabs(tabs, activeTab = 0) {
    const tabButtons = tabs.map((tab, index) => `
      <button class="tab-btn ${index === activeTab ? 'active' : ''}" data-tab="${tab.id}">
        ${tab.label}
      </button>
    `).join('');

    const tabContent = tabs.map((tab, index) => `
      <div class="tab-pane ${index === activeTab ? 'active' : ''}" id="${tab.id}">
        ${tab.content}
      </div>
    `).join('');

    return `
      <div class="tabs-container">
        <div class="tabs-nav">${tabButtons}</div>
        <div class="tabs-content">${tabContent}</div>
      </div>
    `;
  }

  // Create a carousel with consistent structure
  static createCarousel(items, autoAdvance = false) {
    const carouselItems = items.map((item, index) => `
      <div class="carousel-item ${index === 0 ? 'active' : ''}">
        <h6>${item.icon} ${item.title}</h6>
        <p>${item.description}</p>
        ${item.content || ''}
      </div>
    `).join('');

    const dots = items.map((_, index) => `
      <span class="dot ${index === 0 ? 'active' : ''}" data-index="${index}"></span>
    `).join('');

    return `
      <div class="carousel">
        ${carouselItems}
        <div class="carousel-nav">
          <button class="carousel-btn prev">‹</button>
          <div class="carousel-dots">${dots}</div>
          <button class="carousel-btn next">›</button>
        </div>
      </div>
    `;
  }

  // Create a matrix visualization with consistent structure
  static createMatrix(data, options = {}) {
    const {
      title = 'Matrix',
      maxRows = 8,
      maxCols = 12,
      showValues = true,
      showTooltips = true,
      cellRenderer = null
    } = options;

    const rows = data.slice(0, maxRows);
    const cols = data[0]?.length || 0;
    const maxColsToShow = Math.min(maxCols, cols);

    // Header row with column labels
    const headerRow = `
      <div class="matrix-header-row">
        <div class="header-spacer"></div>
        ${Array.from({length: maxColsToShow}, (_, i) => 
          `<div class="col-label" title="Column ${i}">${i}</div>`
        ).join('')}
      </div>
    `;

    // Data rows
    const dataRows = rows.map((row, rowIndex) => {
      const rowLabel = options.rowLabels?.[rowIndex] || `Row ${rowIndex}`;
      
      const cells = row.slice(0, maxColsToShow).map((cell, colIndex) => {
        const cellContent = cellRenderer ? cellRenderer(cell, rowIndex, colIndex) : cell;
        const tooltip = showTooltips ? `title="${cellContent}"` : '';
        
        return `<div class="matrix-cell" data-row="${rowIndex}" data-col="${colIndex}" ${tooltip}>${cellContent}</div>`;
      }).join('');

      return `
        <div class="matrix-row" data-row="${rowIndex}">
          <div class="row-label">${rowLabel}</div>
          <div class="row-cells">${cells}</div>
        </div>
      `;
    }).join('');

    return `
      <div class="matrix-container">
        <div class="matrix-title">${title}</div>
        <div class="matrix-content">
          ${headerRow}
          <div class="matrix-rows">${dataRows}</div>
        </div>
      </div>
    `;
  }

  // Create a statistics display
  static createStats(stats, layout = 'grid') {
    const statsHtml = stats.map(stat => `
      <div class="stat-item">
        <div class="stat-value">${stat.value}</div>
        <div class="stat-label">${stat.label}</div>
        ${stat.description ? `<div class="stat-description">${stat.description}</div>` : ''}
      </div>
    `).join('');

    const layoutClass = layout === 'horizontal' ? 'stats-horizontal' : 'stats-grid';
    
    return `<div class="stats-container ${layoutClass}">${statsHtml}</div>`;
  }

  // Create a color legend
  static createColorLegend(items) {
    const legendHtml = items.map(item => `
      <div class="legend-item">
        <div class="legend-color ${item.colorClass || ''}" style="background-color: ${item.color || ''}"></div>
        <span>${item.label}</span>
      </div>
    `).join('');

    return `<div class="color-legend">${legendHtml}</div>`;
  }

  // Create a step-by-step process visualization
  static createProcess(steps, showArrows = true) {
    const stepsHtml = steps.map((step, index) => `
      <div class="process-step">
        <div class="step-number">${index + 1}</div>
        <div class="step-content">
          <h6>${step.title}</h6>
          <p>${step.description}</p>
          ${step.example ? `<div class="step-example">${step.example}</div>` : ''}
        </div>
      </div>
      ${showArrows && index < steps.length - 1 ? '<div class="process-arrow">↓</div>' : ''}
    `).join('');

    return `<div class="process-container">${stepsHtml}</div>`;
  }

  // Helper for creating consistent spacing classes
  static getSpacingClass(size = 'medium') {
    const spacingMap = {
      small: 'gap-2',
      medium: 'gap-4',
      large: 'gap-6',
      xlarge: 'gap-8'
    };
    return spacingMap[size] || spacingMap.medium;
  }

  // Helper for creating responsive grid classes
  static getGridClass(columns = 'auto-fit', minWidth = '250px') {
    return `grid grid-${columns} min-${minWidth}`;
  }
}

// Tokenization service to handle all tokenization logic
export class TokenizationService {
  // Create a token with consistent structure
  static createToken(id, text, start, end, type, length, subword = false, parentWord = null) {
    return { id, text, start, end, type, length, subword, parentWord };
  }

  // Common word splitting logic
  static splitWord(word, strategy = 'default') {
    if (word.length <= 3) return [word];
    
    // Try to split on common patterns
    if (word.includes('-')) {
      return word.split('-');
    }
    
    const prefixes = ['un', 're', 'in', 'im', 'dis', 'en', 'em', 'pre', 'pro', 'sub', 'super'];
    const suffixes = ['ing', 'ed', 'er', 'est', 'ly', 'ful', 'less', 'ness', 'ment', 'tion', 'sion', 'able', 'ible'];
    
    // Check prefixes
    for (const prefix of prefixes) {
      if (word.startsWith(prefix) && word.length > prefix.length + 2) {
        return [prefix, word.substring(prefix.length)];
      }
    }
    
    // Check suffixes
    for (const suffix of suffixes) {
      if (word.endsWith(suffix) && word.length > suffix.length + 2) {
        return [word.substring(0, word.length - suffix.length), suffix];
      }
    }
    
    // Strategy-specific splitting
    switch (strategy) {
      case 'gpt':
        return this.splitGPT(word);
      case 'bert':
        return this.splitBERT(word);
      default:
        return this.splitDefault(word);
    }
  }

  // GPT-style splitting (conservative)
  static splitGPT(word) {
    if (word.length <= 3) return [word];
    const mid = Math.ceil(word.length / 2);
    return [word.substring(0, mid), word.substring(mid)];
  }

  // BERT-style splitting (aggressive)
  static splitBERT(word) {
    if (word.length <= 3) return [word];
    if (word.length > 6) {
      const third = Math.ceil(word.length / 3);
      return [
        word.substring(0, third),
        word.substring(third, third * 2),
        word.substring(third * 2)
      ];
    }
    const mid = Math.ceil(word.length / 2);
    return [word.substring(0, mid), word.substring(mid)];
  }

  // Default splitting strategy
  static splitDefault(word) {
    const mid = Math.ceil(word.length / 2);
    return [word.substring(0, mid), word.substring(mid)];
  }

  // Simulate tokenization for different model types
  static simulateTokenization(text, modelType) {
    const words = text.split(/\s+/);
    const tokens = [];
    let tokenId = 0;

    // Add special tokens for BERT-style models
    if (modelType === 'bert') {
      tokens.push(this.createToken(tokenId++, '[CLS]', 0, 0, 'special', 5, false));
    }

    words.forEach(word => {
      const shouldSplit = this.shouldSplitWord(word, modelType);
      
      if (shouldSplit) {
        const subwords = this.splitWord(word, modelType);
        subwords.forEach((subword, index) => {
          const isFirst = index === 0;
          const displayText = modelType === 'bert' && !isFirst ? '##' + subword : subword;
          const start = text.indexOf(word) + (index * 2);
          const end = start + subword.length;
          
          tokens.push(this.createToken(
            tokenId++,
            displayText,
            start,
            end,
            'subword',
            subword.length + (modelType === 'bert' && !isFirst ? 2 : 0),
            true,
            word
          ));
        });
      } else {
        tokens.push(this.createToken(
          tokenId++,
          word,
          text.indexOf(word),
          text.indexOf(word) + word.length,
          word.match(/^[A-Z]/) ? 'capitalized' : 'lowercase',
          word.length,
          false
        ));
      }
    });

    // Add special tokens for BERT-style models
    if (modelType === 'bert') {
      tokens.push(this.createToken(tokenId++, '[SEP]', text.length, text.length, 'special', 5, false));
    }

    return tokens;
  }

  // Determine if a word should be split based on model type
  static shouldSplitWord(word, modelType) {
    if (word.length <= 2) return false;
    
    const thresholds = {
      gpt: 0.7,    // 30% chance of splitting for medium words
      bert: 0.6,   // 40% chance of splitting for medium words
      default: 0.5
    };
    
    const threshold = thresholds[modelType] || thresholds.default;
    
    if (word.length <= 4) {
      return Math.random() > threshold;
    }
    
    return true; // Always split longer words
  }
}

// Model configuration service
export class ModelConfig {
  static getModels() {
    return [
      { 
        id: 'gpt2', 
        name: 'GPT-2', 
        description: 'OpenAI GPT-2 (124M parameters)', 
        type: 'gpt',
        embeddingDim: 768
      },
      { 
        id: 'gpt2-medium', 
        name: 'GPT-2 Medium', 
        description: 'OpenAI GPT-2 Medium (355M parameters)', 
        type: 'gpt',
        embeddingDim: 768
      },
      { 
        id: 'gpt2-large', 
        name: 'GPT-2 Large', 
        description: 'OpenAI GPT-2 Large (774M parameters)', 
        type: 'gpt',
        embeddingDim: 768
      },
      { 
        id: 'bert-base-uncased', 
        name: 'BERT Base', 
        description: 'Google BERT Base (110M parameters)', 
        type: 'bert',
        embeddingDim: 768
      },
      { 
        id: 'distilbert-base-uncased', 
        name: 'DistilBERT', 
        description: 'DistilBERT Base (66M parameters)', 
        type: 'bert',
        embeddingDim: 768
      },
      { 
        id: 'roberta-base', 
        name: 'RoBERTa Base', 
        description: 'Facebook RoBERTa Base (125M parameters)', 
        type: 'bert',
        embeddingDim: 768
      }
    ];
  }

  static getModelType(modelId) {
    const model = this.getModels().find(m => m.id === modelId);
    return model?.type || 'unknown';
  }

  static getModelInfo(modelId) {
    return this.getModels().find(m => m.id === modelId) || null;
  }

  static getEmbeddingDimension(modelId) {
    const model = this.getModelInfo(modelId);
    return model?.embeddingDim || 768;
  }

  static getModelDisplayName(modelId) {
    const model = this.getModelInfo(modelId);
    return model?.name || modelId;
  }

  static getModelDescription(modelId) {
    const model = this.getModelInfo(modelId);
    return model?.description || 'Unknown model';
  }
}

// UI rendering service to handle all display logic
export class UIRenderer {
  static renderTokenStats(result) {
    if (!result) return '';
    
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

    const statsHtml = stats.map(stat => `
      <div class="stat-item stat-${stat.color}">
        <div class="stat-label">${stat.label}</div>
        <div class="stat-value">${stat.value}</div>
      </div>
    `).join('');

    return `
      <div class="stats-card">
        <h3 class="stats-title">Tokenization Statistics</h3>
        
        <div class="stats-grid">
          ${statsHtml}
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
  }

  static renderTokenVisualizer(result, currentView, selectedToken, onViewChange, onTokenSelect) {
    if (!result) return '';
    
    const viewControls = `
      <div class="view-controls">
        <button class="view-btn ${currentView === 'flow' ? 'active' : ''}" 
                data-view="flow">
          Flow View
        </button>
        <button class="view-btn ${currentView === 'grid' ? 'active' : ''}" 
                data-view="grid">
          Grid View
        </button>
      </div>
    `;

    const visualizerContent = currentView === 'flow' 
      ? this.renderFlowView(result, selectedToken)
      : this.renderGridView(result, selectedToken);

    const tokenDetails = selectedToken !== null 
      ? this.renderTokenDetails(result, selectedToken)
      : '';

    return `
      <div class="visualizer-card">
        <div class="visualizer-header">
          <h3 class="visualizer-title">Token Visualization</h3>
          ${viewControls}
        </div>

        ${visualizerContent}
        ${tokenDetails}
      </div>
    `;
  }

  static renderFlowView(result, selectedToken) {
    return `
      <div class="flow-view">
        <div class="token-flow">
          ${result.tokens.map((token, index) => `
            <div class="token-item ${selectedToken === index ? 'selected' : ''}"
                 data-token-index="${index}"
                 style="
                   background-color: ${this.getTokenBackground(token, index, selectedToken)};
                   border-color: ${this.getTokenColor(token, index, selectedToken)};
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

  static renderGridView(result, selectedToken) {
    return `
      <div class="grid-view">
        <div class="token-grid">
          ${result.tokens.map((token, index) => `
            <div class="token-card ${selectedToken === index ? 'selected' : ''}"
                 data-token-index="${index}"
                 style="
                   background-color: ${this.getTokenBackground(token, index, selectedToken)};
                   border-color: ${this.getTokenColor(token, index, selectedToken)};
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

  static renderTokenDetails(result, selectedToken) {
    if (selectedToken === null || !result.tokens[selectedToken]) return '';
    
    const token = result.tokens[selectedToken];
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

  static getTokenColor(token, index, selectedToken) {
    if (selectedToken === index) return 'var(--teal)';
    
    const colors = [
      'var(--light-teal)',
      'var(--light-green)', 
      'var(--green)',
      'var(--teal)'
    ];
    return colors[index % colors.length];
  }

  static getTokenBackground(token, index, selectedToken) {
    if (selectedToken === index) return 'rgba(13, 148, 136, 0.1)';
    
    const backgrounds = [
      'rgba(20, 184, 166, 0.1)',
      'rgba(16, 185, 129, 0.1)',
      'rgba(5, 150, 105, 0.1)',
      'rgba(13, 148, 136, 0.1)'
    ];
    return backgrounds[index % backgrounds.length];
  }
}

// Event management service to handle all event setup and handling
export class EventManager {
  constructor(explorer) {
    this.explorer = explorer;
    this.typingTimeout = null;
  }

  setupTokenizationEvents() {
    // Analyze button
    const analyzeBtn = document.getElementById('analyzeBtn');
    if (analyzeBtn) {
      analyzeBtn.addEventListener('click', () => {
        this.explorer.analyzeTokenization();
      });
    }

    // Input text changes
    const inputText = document.getElementById('input-text');
    if (inputText) {
      inputText.addEventListener('input', () => {
        this.explorer.analyzeTokenization();
      });
    }

    // Parameter changes
    this.setupParameterEvents();
  }

  setupParameterEvents() {
    const parameters = [
      { id: 'addSpecialTokens', action: 'analyzeTokenization' },
      { id: 'padding', action: 'analyzeTokenization' },
      { id: 'truncation', action: 'analyzeTokenization' },
      { id: 'maxLength', action: 'analyzeTokenization' }
    ];

    parameters.forEach(param => {
      const element = document.getElementById(param.id);
      if (element) {
        const eventType = param.id === 'maxLength' ? 'input' : 'change';
        element.addEventListener(eventType, () => {
          this.explorer[param.action]();
        });
      }
    });
  }

  setupEmbeddingsEvents() {
    const exploreBtn = document.getElementById('exploreEmbeddingsBtn');
    if (exploreBtn) {
      exploreBtn.addEventListener('click', () => {
        this.explorer.exploreEmbeddings();
      });
    }

    const inputText = document.getElementById('embeddings-input-text');
    if (inputText) {
      inputText.addEventListener('input', () => {
        // Auto-explore after typing stops
        clearTimeout(this.typingTimeout);
        this.typingTimeout = setTimeout(() => {
          if (inputText.value.trim()) {
            this.explorer.exploreEmbeddings();
          }
        }, 500);
      });
    }

    this.setupPipelineNavigation();
  }

  setupPipelineNavigation() {
    const prevBtn = document.getElementById('prevStep');
    const nextBtn = document.getElementById('nextStep');
    const autoPlayBtn = document.getElementById('autoPlay');

    if (prevBtn) prevBtn.addEventListener('click', () => this.explorer.previousStep());
    if (nextBtn) nextBtn.addEventListener('click', () => this.explorer.nextStep());
    if (autoPlayBtn) autoPlayBtn.addEventListener('click', () => this.explorer.toggleAutoPlay());

    // Step click handlers
    document.querySelectorAll('.step').forEach(step => {
      step.addEventListener('click', () => {
        const stepName = step.dataset.step;
        this.explorer.goToStep(stepName);
      });
    });
  }

  setupNavigation() {
    const navBtns = document.querySelectorAll('.nav-btn');
    navBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const page = btn.dataset.page;
        this.explorer.switchPage(page);
      });
    });
  }

  setupModelSelector(modelSelectorId, onModelSelect) {
    const modelSelector = document.getElementById(modelSelectorId);
    if (!modelSelector) return;

    modelSelector.addEventListener('click', (event) => {
      const modelOption = event.target.closest('.model-option');
      if (modelOption) {
        const modelId = modelOption.dataset.model;
        onModelSelect(modelId);
      }
    });
  }

  setupCarousel(carouselSelector) {
    const carousel = document.querySelector(carouselSelector);
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
  }

  setupDictionaryInteractivity() {
    // Token click highlighting
    document.querySelectorAll('.token-badge').forEach(badge => {
      badge.addEventListener('click', () => {
        const tokenIndex = parseInt(badge.dataset.tokenIndex);
        this.explorer.highlightTokenEmbedding(tokenIndex);
      });
    });

    // Embedding cell hover effects
    document.querySelectorAll('.embedding-cell').forEach(cell => {
      cell.addEventListener('mouseenter', () => {
        const tokenIndex = parseInt(cell.dataset.tokenIndex);
        const dimIndex = parseInt(cell.dataset.dimIndex);
        this.explorer.highlightCell(tokenIndex, dimIndex);
      });
      
      cell.addEventListener('mouseleave', () => {
        this.explorer.clearHighlights();
      });
    });

    // Control checkboxes
    this.setupControlEvents();
  }

  setupControlEvents() {
    const controls = [
      { id: 'showValues', action: 'toggleValueDisplay' },
      { id: 'showMagnitudes', action: 'toggleMagnitudeDisplay' }
    ];

    controls.forEach(control => {
      const element = document.getElementById(control.id);
      if (element) {
        element.addEventListener('change', () => {
          this.explorer[control.action]();
        });
      }
    });
  }

  setupPositionalInteractivity() {
    // Tab functionality
    this.setupPositionalTabs();
    
    // Heatmap cell hover effects
    document.querySelectorAll('.heatmap-cell').forEach(cell => {
      cell.addEventListener('mouseenter', () => {
        const position = parseInt(cell.dataset.position);
        const dimension = parseInt(cell.dataset.dimension);
        this.explorer.highlightPositionalCell(position, dimension);
      });
      
      cell.addEventListener('mouseleave', () => {
        this.explorer.clearPositionalHighlights();
      });
    });

    // Visualization controls
    this.setupPositionalControls();
  }

  setupPositionalTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const tabName = btn.dataset.tab;
        this.explorer.switchPositionalTab(tabName);
      });
    });
  }

  setupPositionalControls() {
    const controls = [
      { id: 'showPositionalValues', action: 'togglePositionalValues' },
      { id: 'highlightPatterns', action: 'togglePatternHighlighting' }
    ];

    controls.forEach(control => {
      const element = document.getElementById(control.id);
      if (element) {
        element.addEventListener('change', () => {
          this.explorer[control.action]();
        });
      }
    });
  }

  cleanup() {
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
      this.typingTimeout = null;
    }
  }
}

// Embeddings service to handle all embeddings generation and calculations
export class EmbeddingsService {
  static generateDictionaryEmbeddings(tokens, modelType) {
    const embeddingDim = this.getEmbeddingDimension(modelType);
    return tokens.map(token => {
      const embedding = new Array(embeddingDim).fill(0).map(() => 
        (Math.random() - 0.5) * 2
      );
      return {
        token: token.text,
        embedding,
        magnitude: this.calculateMagnitude(embedding)
      };
    });
  }

  static generatePositionalEncoding(seqLength, modelType) {
    const embeddingDim = this.getEmbeddingDimension(modelType);
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
        magnitude: this.calculateMagnitude(posEncoding)
      });
    }
    
    return encoding;
  }

  static combineEmbeddings(seqLength, dictionaryEmbeddings, positionalEncoding, modelType) {
    const embeddingDim = this.getEmbeddingDimension(modelType);
    const combined = [];
    
    for (let pos = 0; pos < seqLength; pos++) {
      const dictEmbedding = dictionaryEmbeddings[pos]?.embedding || new Array(embeddingDim).fill(0);
      const posEncoding = positionalEncoding[pos]?.encoding || new Array(embeddingDim).fill(0);
      
      const combinedEmbedding = dictEmbedding.map((val, i) => val + posEncoding[i]);
      combined.push({
        position: pos,
        embedding: combinedEmbedding,
        magnitude: this.calculateMagnitude(combinedEmbedding)
      });
    }
    
    return combined;
  }

  static calculateMagnitude(vector) {
    return Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
  }

  static getEmbeddingDimension(modelType) {
    // All current models use 768 dimensions
    return 768;
  }

  static getMatrixColor(value) {
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

  static getPositionalColor(value) {
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
}