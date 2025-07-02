# 🎨 BUCC Frame Editor

A modern, professional-grade web application for overlaying the BRAC University Computer Club (BUCC) frame on background photos with advanced editing capabilities. Built with React, Vite, and Tailwind CSS for lightning-fast performance and stunning visuals.

![Frame Editor Pro](https://img.shields.io/badge/React-18.x-blue.svg)
![Vite](https://img.shields.io/badge/Vite-5.x-green.svg)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-blueviolet.svg)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

## ✨ Features

### 🖼️ **Core Functionality**
- **BUCC Frame Integration**: Pre-loaded BRAC University Computer Club frame
- **Background Photo Upload**: Drag & drop or click to upload background images
- **Real-time Preview**: Live canvas-based editing with instant feedback
- **Professional Controls**: Brightness, contrast, zoom, and positioning
- **High-Quality Export**: Multiple resolution options (HD, 2K, 4K) based on user image quality
- **Smart Resolution Selector**: Only shows valid resolutions based on uploaded image quality

### 🚀 **Performance & UX**
- **GPU Acceleration**: Hardware-accelerated canvas rendering
- **Web Workers**: Background processing for heavy operations
- **Mobile Optimized**: Touch-friendly interface with pinch-to-zoom and drag gestures
- **Responsive Design**: Works perfectly on phones, tablets, and desktops
- **Progressive Loading**: Smooth animations and loading states
- **Auto-fit**: Automatically fits background image to frame

### 🔒 **Privacy & Security**
- **100% Client-Side**: No server uploads, all processing in browser
- **No Data Storage**: Images never leave your device
- **Offline Capable**: Works without internet after initial load
- **GDPR Compliant**: No tracking, no cookies, no data collection

### 🎨 **Modern UI/UX**
- **Glass Morphism Design**: Beautiful frosted glass effects
- **BUCC Brand Colors**: Official BUCC blue and red color scheme
- **Smooth Animations**: Carefully crafted micro-interactions
- **Dark/Light Adaptive**: Respects system preferences
- **Accessibility**: Full keyboard navigation and screen reader support

## 🛠️ Tech Stack

- **Frontend Framework**: React 19.1.0 with Hooks
- **Build Tool**: Vite 7.0.0 for ultra-fast development
- **Styling**: Tailwind CSS 4.x with custom BUCC theme
- **Icons**: Heroicons for consistent iconography
- **Canvas API**: HTML5 Canvas for image processing
- **Web APIs**: FileReader, Blob, URL for file handling

## 📁 Project Structure & File Purposes

```
bucc-frame-editor/
├── public/
│   ├── vite.svg                    # Favicon
│   ├── BUCC_Logo.svg              # BUCC logo for production
│   └── BUCC_Logo_icon.svg         # BUCC icon for production
├── src/
│   ├── assets/
│   │   ├── bucc_frame.png         # Main BUCC frame overlay
│   │   ├── bucc_frame.svg         # Vector version of BUCC frame
│   │   ├── BUCC_Logo.svg          # BUCC logo for development
│   │   ├── BUCC_Logo_icon.svg     # BUCC icon for development
│   │   └── react.svg              # React logo
│   ├── components/
│   │   ├── ImageEditor.jsx        # 🎯 MAIN EDITOR COMPONENT
│   │   ├── Navbar.jsx             # Navigation bar with BUCC branding
│   │   └── Footer.jsx             # Footer with BUCC info
│   ├── config/
│   │   └── theme.js               # 🎨 BUCC THEME CONFIGURATION
│   ├── contexts/
│   │   └── ThemeContext.jsx       # Theme context for dark/light mode
│   ├── App.jsx                    # 🏗️ ROOT APPLICATION COMPONENT
│   ├── main.jsx                   # React DOM entry point
│   └── index.css                  # 🎨 GLOBAL STYLES & COMPONENTS
├── index.html                     # HTML template with BUCC meta
├── vite.config.js                # Vite configuration
├── tailwind.config.js            # Tailwind CSS with BUCC theme
├── postcss.config.js             # PostCSS configuration
├── eslint.config.js              # ESLint configuration
└── package.json                  # Dependencies and scripts
```

## 🔧 Key File Explanations

### 📄 `src/config/theme.js`
**Purpose**: Centralized BUCC theme configuration and brand colors

```javascript
// Contains BUCC brand colors, organization info, and theme settings
export const themeConfig = {
  primary: { 500: '#1e40af' },    // BUCC Blue
  secondary: { 500: '#dc2626' },  // BUCC Red
  // ... full color palette
}

export const organizationConfig = {
  name: "BRAC University Computer Club",
  shortName: "BUCC",
  // ... contact info, social links, activities
}
```

**What it controls**:
- BUCC brand colors (blue, red, accent colors)
- Organization information and contact details
- Social media links and hashtags
- Club activities and member benefits
- Theme consistency across the entire app

### 🎨 `src/index.css`
**Purpose**: Global styles, Tailwind components, and BUCC-specific styling

```css
@layer components {
  .glass-morphism { /* Glass effect with BUCC colors */ }
  .btn-primary { /* BUCC branded primary buttons */ }
  .btn-secondary { /* BUCC branded secondary buttons */ }
  .upload-area { /* Drag & drop styling */ }
  .control-panel { /* Editor controls styling */ }
  .slider { /* Custom slider with BUCC colors */ }
}
```

**What it controls**:
- Global background gradients with BUCC colors
- Glass morphism effects for modern UI
- Button styles with BUCC branding
- Upload area styling with drag & drop states
- Slider and control panel appearances
- Dark/light mode transitions
- Custom scrollbar styling
- Mobile-responsive animations

### 🏗️ `src/App.jsx`
**Purpose**: Root application component and main layout

```jsx
function App() {
  // Main app structure with BUCC branding
  return (
    <div>
      <Navbar />           {/* BUCC branded navigation */}
      <Header />           {/* BUCC title and description */}
      <ImageEditor />      {/* Main frame editor */}
      <Footer />           {/* BUCC info and links */}
    </div>
  )
}
```

**What it controls**:
- Overall app layout and structure
- BUCC branding and title display
- Navigation between sections
- Animated background with BUCC colors
- Header with BUCC logo and description
- Footer with BUCC contact information
- Hashtag copying functionality for social media
- Loading states and transitions

### 🎯 `src/components/ImageEditor.jsx`
**Purpose**: Main editor component with canvas-based image processing

**Key Features**:
- Canvas-based image rendering with HTML5 Canvas API
- BUCC frame automatically loaded on component mount
- Real-time image editing (zoom, position, brightness, contrast)
- Smart resolution selector based on user's image quality
- Touch gesture support for mobile devices
- High-quality image export with frame overlay
- Auto-fit functionality to perfectly fit images to BUCC frame

**What it controls**:
- Image upload and validation
- Canvas rendering and image processing
- Photo adjustment controls (brightness, contrast, zoom)
- BUCC frame overlay and positioning
- Export functionality with multiple resolutions
- Mobile touch gestures and desktop mouse interactions
- Notification system for user feedback

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation

1. **Clone or download the project**
```bash
git clone <repository-url>
cd bucc-frame-editor
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

## 🎯 How to Use

### Step 1: Upload Background Image
1. **Upload Area**: Click the "Upload Background Photo" area on the left
2. **Drag & Drop**: Or simply drag and drop your image file
3. **File Support**: Accepts JPG, PNG, WebP, and other common formats
4. **File Size**: Supports files up to 50MB
5. **Auto-Frame**: BUCC frame is automatically loaded and applied

### Step 2: Edit Your Photo
- **Zoom**: Use the zoom slider or mouse wheel to scale the background image
- **Position**: Drag the image in the preview to reposition it within the BUCC frame
- **Brightness**: Adjust lighting from 50% to 150% for perfect exposure
- **Contrast**: Enhance or reduce contrast from 50% to 150%
- **Frame Toggle**: Show/hide the BUCC frame overlay for easier editing
- **Reset & Auto-fit**: Automatically fits your image perfectly to the BUCC frame

### Step 3: Choose Resolution
1. **Click "Image Resolution"** button to open the resolution selector
2. **Smart Options**: Only shows resolutions that your image can support without quality loss
3. **Quality Priority**: Resolutions are based on your background image quality
4. **Frame Upscaling**: Clearly marked when the BUCC frame will be upscaled
5. **Available Options**:
   - **Full HD**: 1920×1080 (default, recommended)
   - **2K QHD**: 2560×1440 (if your image supports it)
   - **4K UHD**: 3840×2160 (if your image supports it)
   - **Square**: 1080×1080 (social media)
   - **Portrait**: 1080×1350 (Instagram stories)

### Step 4: Download Your BUCC Photo
- **Download HD Image**: Export your photo with the BUCC frame
- **High Quality**: Always exports as PNG to preserve transparency
- **Smart Export**: Matches exactly what you see in the preview
- **File Name**: Automatically saved as `Bucc_frame_photo.png`

## 🔧 Advanced Features

### Smart Resolution System
- **Quality Priority**: Export resolutions are limited by your background image quality
- **No Fake Upscaling**: Won't create resolutions larger than your original image
- **Frame Scaling**: BUCC frame is automatically scaled to match your chosen resolution
- **Upscale Indicator**: Clear labels when the frame needs to be upscaled

### Mobile Touch Controls
- **Pinch to Zoom**: Two-finger pinch gesture for precise zooming
- **Drag to Pan**: Single finger drag to reposition the image
- **Touch Gestures**: Optimized for smooth mobile experience
- **Responsive UI**: Adapts perfectly to all screen sizes

### Performance Optimizations
- **Canvas Optimization**: Uses GPU acceleration for smooth rendering
- **Memory Management**: Automatic cleanup of resources
- **Progressive Loading**: Smooth loading states and transitions
- **Web Workers**: Background processing for heavy operations (when available)

## 🌐 Development & Customization

### BUCC Branding Customization

**Colors** (`src/config/theme.js`):
```javascript
primary: { 500: '#1e40af' },    // BUCC Blue - change this for different blue
secondary: { 500: '#dc2626' },  // BUCC Red - change this for different red
```

**Organization Info** (`src/config/theme.js`):
```javascript
organizationConfig: {
  name: "BRAC University Computer Club",
  shortName: "BUCC",
  contact: {
    email: "contact@bucc.org.bd",
    // ... update contact information
  }
}
```

**Styling** (`src/index.css`):
```css
.btn-primary {
  /* Modify BUCC button styling */
}
.glass-morphism {
  /* Customize glass effect */
}
```

### Adding New Features

1. **New Controls**: Add to `ImageEditor.jsx` component
2. **Styling**: Use existing classes in `index.css` or add new ones
3. **Theme Colors**: Reference colors from `theme.js`
4. **BUCC Branding**: Maintain consistency with BUCC brand guidelines

### Frame Replacement

To replace the BUCC frame with a different frame:

1. **Replace Frame File**: Update `src/assets/bucc_frame.png`
2. **Update Import**: Modify import in `ImageEditor.jsx` if needed
3. **Adjust Branding**: Update organization info in `theme.js`
4. **Color Scheme**: Update colors to match new brand

## 🛠️ Building & Deployment

### Build for Production
```bash
npm run build
```
This creates optimized files in the `dist/` folder.

### Deploy to Netlify
1. **Build**: Run `npm run build`
2. **Upload**: Upload the `dist/` folder to Netlify
3. **Settings**: 
   - Build command: `npm run build`
   - Publish directory: `dist`

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

## 🔍 Browser Support

- **Chrome**: 80+ (Recommended for best performance)
- **Firefox**: 75+
- **Safari**: 13+
- **Edge**: 80+
- **Mobile**: iOS Safari 13+, Chrome Mobile 80+

### Required APIs
- HTML5 Canvas (for image processing)
- FileReader API (for file uploads)
- Blob API (for image export)
- URL.createObjectURL (for file handling)
- CSS Filters (for image adjustments)
- Web Workers (optional, graceful fallback)

## 🐛 Troubleshooting

### Common Issues

**BUCC Frame not loading**
- Check internet connection (frame loads from assets)
- Try refreshing the page
- Clear browser cache if needed

**Background image not uploading**
- Check file format (use JPG, PNG, WebP)
- Ensure file size is under 50MB
- Try a different browser (Chrome recommended)

**Resolution selector not showing options**
- Make sure you've uploaded a background image
- Your image might be too small - try a higher resolution image
- Refresh the page and try again

**Touch controls not working on mobile**
- Ensure you're using a modern mobile browser
- Try refreshing the page
- Check if JavaScript is enabled

**Download not working**
- Ensure both background image and BUCC frame are loaded
- Try a different browser
- Check if popup blockers are preventing download

**Performance issues**
- Close other browser tabs to free up memory
- Use Chrome for best performance
- Try reducing zoom level if editing is slow

### Debug Mode
Add `?debug=true` to the URL to enable console logging for development.

## 🤝 Contributing

We welcome contributions to improve the BUCC Frame Editor!

### Development Setup
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes following the guidelines below
4. Commit changes: `git commit -m 'Add amazing feature'`
5. Push to branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

### Development Guidelines
- **React Best Practices**: Use functional components and hooks
- **BUCC Branding**: Maintain BUCC brand consistency
- **Mobile First**: Ensure mobile responsiveness
- **Performance**: Optimize for smooth 60fps animations
- **Accessibility**: Follow WCAG 2.1 guidelines
- **Code Style**: Use ESLint configuration provided

### Code Structure
- **Components**: Keep components focused and reusable
- **Styling**: Use Tailwind classes and theme.js for colors
- **State Management**: Use React hooks for state
- **File Organization**: Follow existing folder structure

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🏫 About BUCC

**BRAC University Computer Club (BUCC)** is the premier technology club at BRAC University, fostering innovation, learning, and community among computer science students and technology enthusiasts.

### Our Mission
- Promote technological excellence and innovation
- Build a strong community of tech enthusiasts
- Provide learning opportunities and skill development
- Bridge the gap between academia and industry

### Contact BUCC
- **Website**: [bucc.org.bd](https://bucc.org.bd)
- **Email**: contact@bucc.org.bd
- **Facebook**: [BUCC Official](https://facebook.com/bucclub)
- **LinkedIn**: [BRAC University Computer Club](https://linkedin.com/company/bucc)

## 🙏 Acknowledgments

- **BUCC Community**: For inspiration and feedback
- **React Team**: For the amazing framework
- **Vite Team**: For the lightning-fast build tool
- **Tailwind CSS**: For the utility-first CSS framework
- **Heroicons**: For the beautiful icon set

## 📞 Support

- **Documentation**: Check this README for detailed instructions
- **BUCC Support**: Contact BUCC through official channels
- **Issues**: Report bugs via GitHub Issues
- **Feature Requests**: Submit via GitHub Issues with feature request label

---

**Made with ❤️ by BUCC developers, for the BUCC community.**

🚀 **Ready to create stunning BUCC frame photos? Let's get started!**

### Quick Links
- [🔧 Development Setup](#quick-start)
- [🎯 How to Use](#how-to-use)
- [🎨 Customization Guide](#development--customization)
- [📱 Mobile Usage Tips](#mobile-touch-controls)
- [🐛 Troubleshooting](#troubleshooting)
