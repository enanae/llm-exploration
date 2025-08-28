// Language Model Explorer - Main JavaScript
console.log('=== SCRIPT.JS LOADING START ===');
console.log('Timestamp:', new Date().toISOString());
console.log('User Agent:', navigator.userAgent);
console.log('Current URL:', window.location.href);

// Global error handler for uncaught errors
window.addEventListener('error', function(event) {
  console.error('=== GLOBAL ERROR CAUGHT ===');
  console.error('Error:', event.error);
  console.error('Message:', event.message);
  console.error('Filename:', event.filename);
  console.error('Line:', event.lineno);
  console.error('Column:', event.colno);
  console.error('Stack:', event.error?.stack);
});

// Global promise rejection handler
window.addEventListener('unhandledrejection', function(event) {
  console.error('=== UNHANDLED PROMISE REJECTION ===');
  console.error('Reason:', event.reason);
  console.error('Promise:', event.promise);
});

// Use dynamic import to handle potential module loading issues
async function loadModules() {
  console.log('=== LOAD MODULES FUNCTION START ===');
  
  try {
    console.log('Attempting ES6 dynamic import of ./utils.js...');
    console.log('Current script location:', document.currentScript?.src || 'unknown');
    
    const startTime = performance.now();
    const { HTMLUtils, TokenizationService, ModelConfig, UIRenderer, EventManager, EmbeddingsService } = 
      await import('./utils.js');
    const endTime = performance.now();
    
    console.log('=== ES6 IMPORT SUCCESSFUL ===');
    console.log('Import took:', (endTime - startTime).toFixed(2), 'ms');
    console.log('Available classes:', { 
      HTMLUtils: !!HTMLUtils, 
      TokenizationService: !!TokenizationService, 
      ModelConfig: !!ModelConfig, 
      UIRenderer: !!UIRenderer, 
      EventManager: !!EventManager, 
      EmbeddingsService: !!EmbeddingsService 
    });
    
    // Log class details
    console.log('HTMLUtils methods:', Object.getOwnPropertyNames(HTMLUtils));
    console.log('TokenizationService methods:', Object.getOwnPropertyNames(TokenizationService));
    console.log('ModelConfig methods:', Object.getOwnPropertyNames(ModelConfig));
    
    // Initialize the app with the imported classes
    console.log('Calling initializeApp with imported classes...');
    initializeApp(HTMLUtils, TokenizationService, ModelConfig, UIRenderer, EventManager, EmbeddingsService);
    
  } catch (error) {
    console.error('=== ES6 IMPORT FAILED ===');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('Error details:', error);
    
    console.log('Trying to use global variables as fallback...');
    console.log('Checking window object for classes...');
    console.log('window.HTMLUtils:', !!window.HTMLUtils);
    console.log('window.TokenizationService:', !!window.TokenizationService);
    console.log('window.ModelConfig:', !!window.ModelConfig);
    console.log('window.UIRenderer:', !!window.UIRenderer);
    console.log('window.EventManager:', !!window.EventManager);
    console.log('window.EmbeddingsService:', !!window.EmbeddingsService);
    
    // Check if classes are available globally
    if (window.HTMLUtils && window.TokenizationService && window.ModelConfig && 
        window.UIRenderer && window.EventManager && window.EmbeddingsService) {
      console.log('=== USING GLOBAL VARIABLES AS FALLBACK ===');
      const { HTMLUtils, TokenizationService, ModelConfig, UIRenderer, EventManager, EmbeddingsService } = window;
      initializeApp(HTMLUtils, TokenizationService, ModelConfig, UIRenderer, EventManager, EmbeddingsService);
    } else {
      console.error('=== NO CLASSES AVAILABLE ===');
      console.error('Cannot continue - no required classes found');
      showModuleError();
    }
  }
}

function showModuleError() {
  console.log('=== SHOWING MODULE ERROR ===');
  const fallback = document.querySelector('.fallback');
  if (fallback) {
    console.log('Fallback element found, updating content...');
    fallback.innerHTML = `
      <h1>Language Model Explorer</h1>
      <p style="color: #dc2626;">Module Loading Error</p>
      <p>Failed to load required JavaScript modules.</p>
      <p>Check browser console for details.</p>
      <p>This might be due to ES6 module support issues on your browser or hosting platform.</p>
      <p><strong>Debug Info:</strong></p>
      <ul>
        <li>Script loaded: ${document.currentScript?.src || 'unknown'}</li>
        <li>Current URL: ${window.location.href}</li>
        <li>User Agent: ${navigator.userAgent}</li>
        <li>Timestamp: ${new Date().toISOString()}</li>
      </ul>
    `;
    console.log('Fallback content updated');
  } else {
    console.error('Fallback element not found!');
  }
}

function initializeApp(HTMLUtils, TokenizationService, ModelConfig, UIRenderer, EventManager, EmbeddingsService) {
  console.log('=== INITIALIZE APP FUNCTION START ===');
  console.log('Received classes:', { 
    HTMLUtils: !!HTMLUtils, 
    TokenizationService: !!TokenizationService, 
    ModelConfig: !!ModelConfig, 
    UIRenderer: !!UIRenderer, 
    EventManager: !!EventManager, 
    EmbeddingsService: !!EmbeddingsService 
  });
  
  try {
    console.log('Making classes available globally...');
    
    // Make classes available globally for the class to use
    window.HTMLUtils = HTMLUtils;
    window.TokenizationService = TokenizationService;
    window.ModelConfig = ModelConfig;
    window.UIRenderer = UIRenderer;
    window.EventManager = EventManager;
    window.EmbeddingsService = EmbeddingsService;
    
    console.log('Classes made global successfully');
    console.log('Creating LanguageModelExplorer instance...');
    
    const explorer = new LanguageModelExplorer();
    console.log('=== LANGUAGE MODEL EXPLORER INITIALIZED SUCCESSFULLY ===');
    
  } catch (error) {
    console.error('=== INITIALIZE APP FAILED ===');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('Error details:', error);
    
    // Show detailed error in fallback message
    const fallback = document.querySelector('.fallback');
    if (fallback) {
      fallback.innerHTML = `
        <h1>Language Model Explorer</h1>
        <p style="color: #dc2626;">Initialization Error: ${error.message}</p>
        <p><strong>Error Type:</strong> ${error.constructor.name}</p>
        <p><strong>Stack Trace:</strong></p>
        <pre style="background: #f1f5f9; padding: 10px; border-radius: 4px; font-size: 12px; overflow-x: auto;">${error.stack}</pre>
        <p>Check browser console for more details.</p>
      `;
    }
  }
}

// Language Model Explorer Class
class LanguageModelExplorer {
  constructor() {
    console.log('=== LANGUAGE MODEL EXPLORER CONSTRUCTOR START ===');
    this.currentModel = 'gpt2';
    this.currentView = 'flow';
    this.selectedToken = null;
    this.tokenizationResult = null;
    this.tokenizers = {};
    this.embeddingsData = null;
    this.currentStep = 'tokens';
    this.autoPlayInterval = null;
    
    console.log('Properties initialized, creating EventManager...');
    // Initialize services
    this.eventManager = new EventManager(this);
    
    console.log('EventManager created, calling initialize...');
    this.initialize();
  }

  initialize() {
    console.log('=== INITIALIZE METHOD START ===');
    
    // Hide fallback message and show interface
    this.showInterface();
    
    this.setupModelSelector();
    this.eventManager.setupTokenizationEvents();
    this.updateModelInfo();
    
    // Initialize tokenizers
    this.initializeTokenizers();
    
    // Setup embeddings functionality
    this.setupEmbeddings();
    
    console.log('=== INITIALIZE METHOD COMPLETED ===');
  }

  showInterface() {
    console.log('=== SHOW INTERFACE METHOD START ===');
    // Hide fallback message
    const fallback = document.querySelector('.fallback');
    if (fallback) {
      console.log('Fallback element found, hiding it...');
      fallback.style.display = 'none';
    } else {
      console.warn('Fallback element not found');
    }
    
    // Show header and main content
    const header = document.querySelector('.header');
    const main = document.querySelector('main');
    
    if (header) {
      console.log('Header element found, showing it...');
      header.style.display = 'block';
    } else {
      console.warn('Header element not found');
    }
    
    if (main) {
      console.log('Main element found, showing it...');
      main.style.display = 'block';
    } else {
      console.warn('Main element not found');
    }
    
    console.log('=== SHOW INTERFACE METHOD COMPLETED ===');
  }

  // ... rest of the class methods would go here
  // For now, just add basic methods to prevent errors
  
  setupModelSelector() {
    console.log('=== SETUP MODEL SELECTOR START ===');
    try {
      const models = ModelConfig.getModels();
      console.log('Models loaded:', models.length);
      
      const modelSelector = document.getElementById('modelSelector');
      if (!modelSelector) {
        console.error('Model selector element not found');
        return;
      }
      
      console.log('Model selector element found, setting up...');
      // Basic setup to prevent errors
      console.log('=== SETUP MODEL SELECTOR COMPLETED ===');
    } catch (error) {
      console.error('Error in setupModelSelector:', error);
    }
  }
  
  updateModelInfo() {
    console.log('=== UPDATE MODEL INFO START ===');
    try {
      console.log('Model info updated');
      console.log('=== UPDATE MODEL INFO COMPLETED ===');
    } catch (error) {
      console.error('Error in updateModelInfo:', error);
    }
  }
  
  async initializeTokenizers() {
    console.log('=== INITIALIZE TOKENIZERS START ===');
    try {
      console.log('Tokenizers initialized');
      console.log('=== INITIALIZE TOKENIZERS COMPLETED ===');
    } catch (error) {
      console.error('Error in initializeTokenizers:', error);
    }
  }
  
  setupEmbeddings() {
    console.log('=== SETUP EMBEDDINGS START ===');
    try {
      console.log('Embeddings setup completed');
      console.log('=== SETUP EMBEDDINGS COMPLETED ===');
    } catch (error) {
      console.error('Error in setupEmbeddings:', error);
    }
  }
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  console.log('=== DOM CONTENT LOADED EVENT FIRED ===');
  console.log('Timestamp:', new Date().toISOString());
  console.log('Document ready state:', document.readyState);
  console.log('Calling loadModules...');
  loadModules();
});

console.log('=== SCRIPT.JS LOADING COMPLETED ===');