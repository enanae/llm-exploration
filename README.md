# Language Model Explorer

An interactive website for exploring the internals of language models, with a focus on tokenization visualization. Built with React, TypeScript, and a modern design using white, grey, teal, and green color schemes.

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

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd language-model-explorer
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

### Building for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── components/          # React components
│   ├── Header.tsx      # Application header
│   ├── ModelSelector.tsx # Model selection interface
│   ├── TokenizationExplorer.tsx # Main tokenization component
│   ├── TokenizationControls.tsx # Tokenization parameters
│   ├── TokenStats.tsx  # Tokenization statistics
│   └── TokenVisualizer.tsx # Token visualization
├── types/               # TypeScript type definitions
│   └── tokenization.ts # Token and result types
├── App.tsx             # Main application component
├── main.tsx            # Application entry point
└── index.css           # Global styles
```

## Usage

1. **Select a Model**: Choose from the available language models in the model selector
2. **Input Text**: Enter or modify the text you want to analyze
3. **Adjust Parameters**: Use the controls to modify tokenization behavior
4. **Explore Tokens**: Switch between flow and grid views to explore the tokenization
5. **Analyze Details**: Click on individual tokens to see detailed information

## Future Enhancements

- Integration with Hugging Face Transformers library for real tokenization
- Attention weight visualization
- Layer-by-layer analysis
- Model comparison tools
- Export functionality for analysis results

## Technologies Used

- **React 18**: Modern React with hooks
- **TypeScript**: Type-safe development
- **Vite**: Fast build tool and dev server
- **CSS Grid/Flexbox**: Modern layout techniques
- **Responsive Design**: Mobile-first approach

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Hugging Face for open-source language models
- The React and TypeScript communities
- Modern web design principles and best practices