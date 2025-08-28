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