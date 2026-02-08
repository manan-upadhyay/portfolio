# Manan Upadhyay - 3D Portfolio

A stunning, interactive 3D portfolio website showcasing 4+ years of Full Stack Development experience. Built with React, Three.js, and Framer Motion.

![Portfolio Preview](./docs/assets/preview.png)

## ✨ Features

- **🎨 Dual Theme System** - Morning (sunrise gradients) and Night (aurora/starry) themes with system preference detection
- **🌐 3D Interactive Elements** - Rotating computer model, 3D tech balls, Earth globe
- **⚡ Animated UI** - Typing animations, floating orbs, skill bars, glassmorphism cards
- **📱 Responsive Design** - Optimized for all devices with mobile-specific 3D simplifications
- **📧 Contact Form** - EmailJS integration for instant messaging
- **🔗 Social Integration** - LinkedIn, GitHub, Email links

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/manan-upadhyay/3d-portfolio.git
cd 3d-portfolio

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your EmailJS credentials

# Start development server
npm run dev

# Build for production
npm run build
```

## 🛠️ Tech Stack

| Category | Technologies |
|----------|-------------|
| **Frontend** | React 18, Vite, Tailwind CSS |
| **3D Graphics** | Three.js, React Three Fiber, React Three Drei |
| **Animations** | Framer Motion |
| **State Management** | Zustand |
| **Styling** | CSS Variables, Glassmorphism |
| **Email** | EmailJS |

## 📁 Project Structure

```
src/
├── assets/           # Images, icons, 3D models
├── components/
│   ├── canvas/       # 3D components (Computers, Ball, Earth, Stars)
│   ├── Hero.jsx      # Hero section with typing animation
│   ├── About.jsx     # About with skill bars
│   ├── Experience.jsx# Work timeline
│   ├── Tech.jsx      # Technologies grid
│   ├── Works.jsx     # Projects showcase
│   ├── Contact.jsx   # Contact form
│   ├── Navbar.jsx    # Navigation with theme toggle
│   └── ThemeToggle.jsx # Sun/moon theme switcher
├── constants/        # Data (experience, projects, skills)
├── hoc/              # Higher-order components
├── store/            # Zustand stores
├── utils/            # Animation utilities
└── styles/           # Global styles
```

## 🎨 Customization

### Personal Information

Edit `src/constants/index.js`:

- `personalInfo` - Name, email, LinkedIn, GitHub
- `experiences` - Work history
- `projects` - Portfolio projects
- `skillCategories` - Skills with proficiency levels

### Theme Colors

Edit `src/index.css`:

- `:root` - Light/morning theme variables
- `.dark` - Dark/night theme variables

### 3D Models

Replace models in `public/`:

- `desktop_pc/` - Computer model
- `planet/` - Earth model

## 📋 Environment Variables

```env
VITE_APP_EMAILJS_SERVICE_ID=your_service_id
VITE_APP_EMAILJS_TEMPLATE_ID=your_template_id
VITE_APP_EMAILJS_PUBLIC_KEY=your_public_key
```

## 🧪 Development

```bash
# Start dev server
npm run dev

# Run linting
npm run lint

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📦 Deployment

### Vercel (Recommended)

```bash
npm i -g vercel
vercel
```

### Netlify

```bash
npm run build
# Upload dist/ folder to Netlify
```

### GitHub Pages

```bash
npm run build
# Push dist/ to gh-pages branch
```

## 📚 Documentation

- [Architecture Overview](./docs/ARCHITECTURE.md)
- [Contributing Guide](./docs/CONTRIBUTING.md)
- [Component Documentation](./docs/COMPONENTS.md)
- [Future Roadmap](./docs/ROADMAP.md)
- [AI Development Guide](./docs/AI_DEVELOPMENT.md)

## 📄 License

MIT License - feel free to use this as a template for your own portfolio!

## 👤 Author

**Manan Upadhyay**

- LinkedIn: [manan-upadhyay](https://www.linkedin.com/in/manan-upadhyay)
- GitHub: [@manan-upadhyay](https://github.com/manan-upadhyay)
- Email: <upadhyaymanan01@gmail.com>
