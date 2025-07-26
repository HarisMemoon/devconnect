# DevConnect - Developer Social Platform

A modern, AI-powered social platform for developers to connect, share ideas, and collaborate on projects.

## 🚀 Features

- **Smart Content Creation**: AI-powered content suggestions and writing assistance
- **Intelligent Comment Moderation**: Automatic spam detection and content filtering
- **Content Enhancement**: AI-driven content analysis, summarization, and improvement suggestions
- **Real-time Interactions**: Like, comment, and engage with posts instantly
- **Responsive Design**: Optimized for desktop and mobile devices
- **Progressive Web App**: Installable with offline capabilities
- **Performance Optimized**: Code splitting, lazy loading, and caching strategies

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, TailwindCSS
- **State Management**: React Hooks
- **HTTP Client**: Axios with interceptors
- **AI Integration**: Custom AI service layer
- **Performance**: Service Workers, Code Splitting, Memoization
- **Deployment**: Netlify/Vercel ready

## 📦 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd devconnect-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Update the environment variables in `.env.local`:
```env
VITE_API_URL=http://localhost:5000/api
VITE_AI_ENABLED=true
```

## 🏃‍♂️ Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:prod` - Build for production with optimizations
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run clean` - Clean build directory

## 🚀 Deployment

### Netlify

1. Build the project:
```bash
npm run build:prod
```

2. Deploy to Netlify:
```bash
npm run deploy:netlify
```

Or use the Netlify dashboard to deploy the `dist` folder.

### Vercel

1. Build the project:
```bash
npm run build:prod
```

2. Deploy to Vercel:
```bash
npm run deploy:vercel
```

Or connect your repository to Vercel for automatic deployments.

### Manual Deployment

1. Build the project:
```bash
npm run build:prod
```

2. Upload the `dist` folder to your hosting provider.

## 🔧 Configuration

### Environment Variables

- `VITE_API_URL` - Backend API URL
- `VITE_AI_ENABLED` - Enable/disable AI features
- `VITE_APP_NAME` - Application name
- `VITE_OPENAI_API_KEY` - OpenAI API key (optional)

### Production Configuration

The application includes production optimizations:

- Code splitting for vendor libraries
- Service worker for caching
- Image optimization
- Bundle size optimization
- Performance monitoring

## 🎨 Features Overview

### AI-Powered Content Creation
- Smart title suggestions based on content
- Content improvement recommendations
- Auto-tagging and categorization
- Writing quality analysis

### Smart Comment System
- Real-time spam detection
- Content moderation
- Comment quality suggestions
- Rate limiting

### Performance Features
- Lazy loading for images and components
- Virtual scrolling for large lists
- Debounced search and input
- Optimized re-renders with React.memo

### PWA Capabilities
- Offline functionality
- Installable on mobile devices
- Push notifications (future feature)
- Background sync (future feature)

## 🔒 Security Features

- Input sanitization
- XSS protection
- Content validation
- Rate limiting
- Secure API communication

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please open an issue in the repository.
