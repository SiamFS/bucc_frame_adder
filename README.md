# 🎨 Frame Editor Pro

A modern, professional-grade web application for overlaying transparent PNG frames on background photos with advanced editing capabilities. Built with React, Vite, and Tailwind CSS for lightning-fast performance and stunning visuals.

![Frame Editor Pro](https://img.shields.io/badge/React-18.x-blue.svg)
![Vite](https://img.shields.io/badge/Vite-5.x-green.svg)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-blueviolet.svg)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

## ✨ Features

### 🖼️ **Core Functionality**
- **Dual Image Upload**: Background photos + transparent PNG frames
- **Real-time Preview**: Live canvas-based editing with instant feedback
- **Professional Controls**: Brightness, contrast, zoom, and positioning
- **High-Quality Export**: Multiple resolution options (HD, 2K, 4K)
- **Frame Management**: Toggle frame visibility, swap frames easily

### 🚀 **Performance & UX**
- **GPU Acceleration**: Hardware-accelerated canvas rendering
- **Web Workers**: Background processing for heavy operations
- **Mobile Optimized**: Touch-friendly interface with gesture support
- **Responsive Design**: Works perfectly on phones, tablets, and desktops
- **Progressive Loading**: Smooth animations and loading states

### 🔒 **Privacy & Security**
- **100% Client-Side**: No server uploads, all processing in browser
- **No Data Storage**: Images never leave your device
- **Offline Capable**: Works without internet after initial load
- **GDPR Compliant**: No tracking, no cookies, no data collection

### 🎨 **Modern UI/UX**
- **Glass Morphism Design**: Beautiful frosted glass effects
- **Smooth Animations**: Carefully crafted micro-interactions
- **Dark/Light Adaptive**: Respects system preferences
- **Accessibility**: Full keyboard navigation and screen reader support

## 🛠️ Tech Stack

- **Frontend Framework**: React 19.1.0 with Hooks
- **Build Tool**: Vite 7.0.0 for ultra-fast development
- **Styling**: Tailwind CSS 4.x with custom animations
- **Icons**: Heroicons for consistent iconography
- **Canvas API**: HTML5 Canvas for image processing
- **Web APIs**: FileReader, Blob, URL for file handling

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation

1. **Clone or download the project**
```bash
git clone <repository-url>
cd frame-editor-pro
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

4. **Open in browser**
```
http://localhost:5173
```

### Development Commands

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Run ESLint for code quality
npm run lint
```

## 📁 Project Structure

```
frame-editor-pro/
├── public/
│   └── vite.svg                 # Favicon
├── src/
│   ├── components/
│   │   └── ImageEditor.jsx      # Main editor component
│   ├── App.jsx                  # Root application component
│   ├── main.jsx                 # React DOM entry point
│   └── index.css                # Global styles and Tailwind
├── index.html                   # HTML template
├── vite.config.js              # Vite configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── postcss.config.js           # PostCSS configuration
├── eslint.config.js            # ESLint configuration
└── package.json                # Dependencies and scripts
```

## 🎯 How to Use

### Step 1: Upload Images
1. **Background Photo**: Click the first upload area to add your main image
2. **Transparent Frame**: Click the second upload area to add a PNG frame with transparency
3. **File Support**: Accepts all common image formats (JPG, PNG, WebP, etc.)
4. **File Size**: Supports files up to 50MB for professional workflows

### Step 2: Edit Your Photo
- **Zoom**: Use the slider or mouse wheel to scale the background image
- **Position**: Drag the image to reposition it within the frame
- **Brightness**: Adjust lighting from 50% to 150%
- **Contrast**: Enhance or reduce contrast from 50% to 150%
- **Frame Toggle**: Show/hide the frame overlay for easier editing

### Step 3: Export Your Creation
- **Download HD**: Export in Full HD (1920×1080) quality
- **Quick Download**: Export with 80% quality for faster processing
- **Advanced Mode**: Access 2K, 4K, and custom resolution options
- **File Format**: Always exports as PNG to preserve transparency

## 🔧 Advanced Features

### Resolution Options (Advanced Mode)
- **Full HD**: 1920×1080 (standard)
- **2K QHD**: 2560×1440 (high quality)
- **4K UHD**: 3840×2160 (ultra high definition)
- **Square**: 1080×1080 (social media)
- **Portrait**: 1080×1350 (Instagram stories)

### Performance Optimizations
- **Canvas Optimization**: Uses `willReadFrequently: false` for better GPU performance
- **Animation Frames**: Smooth 60fps updates with `requestAnimationFrame`
- **Image Smoothing**: High-quality scaling with `imageSmoothingQuality: 'high'`
- **Memory Management**: Automatic cleanup of blob URLs and event listeners

### Mobile Features
- **Touch Support**: Full gesture support for pinch, drag, and tap
- **Responsive Layout**: Adaptive grid system for all screen sizes
- **Touch Optimization**: `touch-action: none` for precise control
- **Mobile UI**: Optimized button sizes and spacing for touch interfaces

## 🌐 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Netlify
1. **Build the project**: `npm run build`
2. **Upload `dist/` folder** to Netlify
3. **Set build command**: `npm run build`
4. **Set publish directory**: `dist`

### Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Deploy to GitHub Pages
```bash
# Install gh-pages
npm install --save-dev gh-pages

# Add to package.json scripts:
"deploy": "gh-pages -d dist"

# Build and deploy
npm run build
npm run deploy
```

## 🎨 Customization

### Tailwind Configuration
The `tailwind.config.js` includes:
- **Custom Animations**: Fade-in, slide-up, bounce effects
- **Extended Colors**: Professional color palette
- **Custom Fonts**: Inter font family with optimizations
- **Responsive Breakpoints**: Mobile-first design approach

### CSS Variables
Customize the design by modifying CSS custom properties in `index.css`:
```css
:root {
  --primary-color: #3b82f6;
  --secondary-color: #8b5cf6;
  --background-gradient: linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%);
}
```

## 🔍 Browser Support

- **Chrome**: 80+ (Recommended)
- **Firefox**: 75+
- **Safari**: 13+
- **Edge**: 80+
- **Mobile**: iOS Safari 13+, Chrome Mobile 80+

### Required APIs
- HTML5 Canvas
- FileReader API
- Blob API
- URL.createObjectURL
- CSS Filters
- Web Workers (optional, graceful fallback)

## 🐛 Troubleshooting

### Common Issues

**Images not loading**
- Check file format (use JPG, PNG, WebP)
- Ensure file size is under 50MB
- Try a different browser

**Performance issues**
- Close other browser tabs
- Use Chrome for best performance
- Reduce image resolution if needed

**Mobile touch not working**
- Ensure you're using a modern mobile browser
- Try refreshing the page
- Check if JavaScript is enabled

### Debug Mode
Add `?debug=true` to the URL to enable console logging for development.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines
- Follow React best practices
- Use TypeScript for new features
- Maintain 100% test coverage
- Follow accessibility guidelines (WCAG 2.1)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team**: For the amazing framework
- **Vite Team**: For the lightning-fast build tool
- **Tailwind CSS**: For the utility-first CSS framework
- **Heroicons**: For the beautiful icon set

## 📞 Support

- **Documentation**: Check this README for detailed instructions
- **Issues**: Report bugs via GitHub Issues
- **Community**: Join our Discord for discussions

---

**Made with ❤️ by developers, for creators worldwide.**

🚀 **Ready to create stunning frame compositions? Let's get started!**
