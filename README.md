# 🌸 Nari AI - PCOS Wellness Compass

## 💖 Your AI-Powered Companion for PCOS Wellness

Nari AI is a comprehensive web application designed to support individuals with Polycystic Ovary Syndrome (PCOS) through AI-powered tools, personalized guidance, and evidence-based health management features.

## ✨ Features

### 🎯 **Core Features (Live)**
- **🔐 Secure Authentication** - Auth0 integration with social login
- **📝 Comprehensive PCOS Assessment** - Interactive quiz with progress tracking
- **🤖 AI-Powered Chat Interface** - Personalized PCOS guidance with Fireworks AI
- **📸 Smart Food Analysis** - AI-powered image recognition for PCOS-friendly meal analysis
- **📊 Nutritional Insights** - Detailed macronutrient, glycemic load, and inflammation scoring
- **📱 Responsive Design** - Mobile-first approach with modern UI/UX

### 🚀 **Advanced Features**
- **👤 User Profile Management** - Personalized health profiles with symptom tracking
- **📈 Progress Tracking** - Visual charts and analytics for health metrics
- **🍽️ Food History** - Complete meal logging and analysis history
- **💬 Chat History** - Persistent conversation storage with Nari AI
- **🎨 Modern UI Components** - Mantine UI with custom PCOS-themed design
- **🔍 Extended Health Quiz** - Detailed wellness assessment for personalized recommendations

## 🛠️ Tech Stack

### **Frontend**
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Mantine UI** for component library
- **React Router DOM** for navigation
- **Tailwind CSS** for styling
- **React Markdown** for rich text rendering

### **Backend & Services**
- **Auth0** for authentication and user management
- **Fireworks AI** for conversational AI capabilities
- **Local Storage** for data persistence
- **Vercel** for deployment and hosting

### **Development Tools**
- **ESLint & TypeScript** for code quality
- **Playwright** for end-to-end testing
- **pnpm** for package management
- **GitHub Actions** for CI/CD

## 📋 Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [pnpm](https://pnpm.io/installation) (Package manager)
- Auth0 account for authentication setup
- Fireworks AI API key for chat functionality

## 🚀 Getting Started

### 1. **Clone the Repository**
```bash
git clone https://github.com/paritoshk/pcos-wellness-compass.git
cd pcos-wellness-compass
```

### 2. **Install Dependencies**
```bash
pnpm install
```

### 3. **Environment Setup**
Create a `.env` file in the root directory:

```env
# Auth0 Configuration
VITE_AUTH0_DOMAIN=your-auth0-domain.auth0.com
VITE_AUTH0_CLIENT_ID=your-auth0-client-id

# App Configuration
VITE_APP_URL=http://localhost:8080

# AI Service Configuration
VITE_FIREWORKS_API_KEY=your-fireworks-api-key
```

### 4. **Start Development Server**
```bash
pnpm run dev
```

The application will be available at `http://localhost:8080`

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── AuthGuard.tsx   # Authentication protection
│   ├── Layout.tsx      # Main app layout
│   └── ui/             # shadcn-ui components
├── contexts/           # React contexts
│   └── UserContext.tsx # User state management
├── pages/              # Route components
│   ├── WelcomePage.tsx # Landing page
│   ├── PcosQuiz.tsx    # Main onboarding quiz
│   ├── ChatInterface.tsx # AI chat interface
│   ├── FoodAnalysis.tsx # Food analysis tool
│   └── HistoryLog.tsx  # User history tracking
├── services/           # External service integrations
│   └── fireworksAI.ts  # AI service implementation
└── styles/             # Global styles and themes
```

## 🧪 Testing

### **Run Tests**
```bash
# Unit and integration tests
pnpm run test

# End-to-end tests
pnpm run test:e2e

# Linting
pnpm run lint

# Type checking
pnpm run build
```

## 🚀 Deployment

### **Vercel (Recommended)**
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Configure Auth0 callback URLs for your Vercel domain
4. Deploy automatically on push to main branch

### **Environment Variables for Production**
```env
VITE_AUTH0_DOMAIN=your-domain.auth0.com
VITE_AUTH0_CLIENT_ID=your-client-id
VITE_APP_URL=https://your-app.vercel.app
VITE_FIREWORKS_API_KEY=your-api-key
```

## 🔧 Auth0 Setup

### **Application Settings**
- **Application Type**: Single Page Application
- **Allowed Callback URLs**: `http://localhost:8080, https://your-domain.vercel.app`
- **Allowed Logout URLs**: `http://localhost:8080, https://your-domain.vercel.app`
- **Allowed Web Origins**: `http://localhost:8080, https://your-domain.vercel.app`

### **For Vercel Preview Deployments**
- **Allowed Callback URLs**: `https://*.vercel.app`
- **Allowed Logout URLs**: `https://*.vercel.app`
- **Allowed Web Origins**: `https://*.vercel.app`

## 🎨 UI/UX Features

### **Design System**
- **Primary Colors**: PCOS-themed pink gradient palette
- **Typography**: Poppins for headings, Inter for body text
- **Components**: Fully accessible Mantine UI components
- **Responsive**: Mobile-first design with breakpoint optimization

### **User Experience**
- **Progressive Onboarding**: Step-by-step PCOS assessment
- **Intuitive Navigation**: Clear visual hierarchy and navigation
- **Real-time Feedback**: Instant AI responses and food analysis
- **Persistent State**: User data and chat history preservation

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### **Development Guidelines**
- Follow TypeScript best practices
- Maintain component modularity
- Add tests for new features
- Update documentation as needed
- Follow the existing code style

## 📊 Recent Updates

### **Latest Major Changes (PR #8)**
- ✅ Complete Auth0 integration with social login
- ✅ Redesigned PCOS quiz with progress bar UI
- ✅ AI-powered chat interface with Fireworks AI
- ✅ Smart food analysis with image recognition
- ✅ Comprehensive user profile management
- ✅ Mobile-responsive design overhaul
- ✅ TypeScript improvements and error handling
- ✅ Enhanced security and data privacy

## 🎯 Roadmap

### **Coming Soon**
- 📊 Advanced analytics and insights dashboard
- 🏥 Healthcare provider integration
- 📱 Progressive Web App (PWA) capabilities
- 🔔 Smart notifications and reminders
- 🌐 Multi-language support
- 📈 Advanced symptom correlation analysis

### **Future Enhancements**
- 🤝 Community features and support groups
- 🏆 Gamification and achievement system
- 📚 Educational content library
- 🎯 Personalized meal planning
- 💊 Medication tracking integration

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Medical Advisors** for PCOS guidance and validation
- **Open Source Community** for the amazing tools and libraries
- **Auth0** for secure authentication infrastructure
- **Fireworks AI** for conversational AI capabilities
- **Vercel** for seamless deployment and hosting

---

**Built with ❤️ for the PCOS community**

*Last updated: December 2024*