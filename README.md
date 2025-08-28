# Language Model Explorer

An interactive website for exploring the internals of language models, with a focus on tokenization visualization. Built as a static website using vanilla JavaScript, HTML, and CSS with a modern design using white, grey, teal, and green color schemes.

## Features

- **Model Selection**: Choose from various open-source language models (GPT-2, BERT, RoBERTa, etc.)
- **Interactive Tokenization**: Visualize how text breaks down into tokens
- **Dual View Modes**: 
  - Flow View: Sequential token display
  - Grid View: Card-based token exploration
- **Token Analysis**: Detailed statistics and token information
- **Parameter Controls**: Adjust tokenization parameters (special tokens, padding, truncation)
- **Responsive Design**: Works on desktop and mobile devices

## Color Scheme

The application uses a carefully designed color palette:
- **White**: Primary backgrounds and cards
- **Grey**: Secondary elements and text
- **Teal**: Primary accents and interactive elements
- **Green**: Secondary accents and highlights

## Getting Started

### Option 1: GitHub Pages (Recommended)

1. Fork or clone this repository
2. Go to your repository settings
3. Enable GitHub Pages in the "Pages" section
4. Select the branch you want to deploy (usually `main` or `master`)
5. Your site will be available at `https://yourusername.github.io/repository-name`

### Option 2: Local Development

1. Clone the repository:
```bash
git clone <repository-url>
cd language-model-explorer
```

2. Open `index.html` in your web browser
   - You can use any local server (Python, Node.js, etc.)
   - Or simply double-click the HTML file

### Option 3: Other Static Hosting

This website can be deployed on any static hosting service:
- **Netlify**: Drag and drop the folder
- **Vercel**: Connect your repository
- **AWS S3**: Upload the files to an S3 bucket
- **Any web server**: Upload the files to your server

## Project Structure

```
language-model-explorer/
├── index.html          # Main HTML file
├── styles.css          # All CSS styles
├── script.js           # JavaScript functionality
└── README.md           # This file
```

## Usage

1. **Select a Model**: Choose from the available language models in the model selector
2. **Input Text**: Enter or modify the sample text
3. **Explore Tokens**: Switch between flow and grid views
4. **Click Tokens**: Get detailed information about each token
5. **Adjust Parameters**: Modify tokenization behavior

## How It Works

The website uses vanilla JavaScript to:
- Dynamically generate the model selector interface
- Process text input and create mock tokenization
- Render interactive token visualizations
- Handle user interactions and view switching
- Display real-time statistics and analysis

## Future Enhancements

- Integration with Hugging Face Transformers library for real tokenization
- Attention weight visualization
- Layer-by-layer analysis
- Model comparison tools
- Export functionality for analysis results

## Technologies Used

- **HTML5**: Semantic markup
- **CSS3**: Modern styling with Grid/Flexbox
- **Vanilla JavaScript**: ES6+ features and modern APIs
- **Responsive Design**: Mobile-first approach
- **No build tools required**: Pure static files

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Development Workflow

### Error Handling & Logging

The application includes comprehensive error handling and logging:

- **Global Error Handlers**: Catches uncaught errors and promise rejections
- **Syntax Validation**: Pre-commit hooks ensure code quality
- **Detailed Logging**: Console logging for debugging and monitoring
- **User-Friendly Errors**: Graceful error display with helpful messages
- **Fallback Mechanisms**: Application continues working even with partial failures

### Pre-commit Validation

Before each commit, the pre-commit hook automatically runs syntax validation:

```bash
# Manual validation
node validate-syntax.js

# Automatic validation (runs on every commit)
git commit -m "Your commit message"
```

### Development Branch Workflow

1. **Work in dev branch**: `git checkout -b feature-branch`
2. **Make changes and test**: Ensure syntax validation passes
3. **Commit to dev**: `git commit -m "Feature description"`
4. **Merge to main**: `git checkout main && git merge feature-branch`
5. **Return to dev**: `git checkout feature-branch`

### Debugging

- **Console Logging**: Extensive logging throughout the application
- **Global Error Display**: Errors are shown both in console and UI
- **Instance Access**: Main explorer instance available as `window.languageModelExplorer`
- **Network Tab**: Check for script loading issues
- **Syntax Validation**: Run `node validate-syntax.js` to check syntax

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test in multiple browsers
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Hugging Face for open-source language models
- Modern web standards and best practices
- The open-source community for inspiration