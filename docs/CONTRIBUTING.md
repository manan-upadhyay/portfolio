# Contributing Guide

Thank you for considering contributing to this portfolio project! This guide will help you get started.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm 9+
- Git

### Setup

```bash
# Fork and clone the repository
git clone https://github.com/YOUR_USERNAME/3d-portfolio.git
cd 3d-portfolio

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start development server
npm run dev
```

## 📁 Project Structure

```
src/
├── assets/           # Static assets (images, icons)
├── components/       # React components
│   └── canvas/       # 3D components
├── constants/        # Data files
├── hoc/              # Higher-order components
├── store/            # State management
├── utils/            # Utility functions
└── styles.js         # Style utilities
```

## 🔧 Development Workflow

### 1. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

### 2. Make Changes

- Follow the existing code style
- Use meaningful variable/function names
- Add comments for complex logic
- Test both light and dark themes
- Test on mobile viewports

### 3. Test Your Changes

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Run linting
npm run lint
```

### 4. Commit Changes

Follow conventional commits:

```bash
git commit -m "feat: add new feature description"
git commit -m "fix: resolve bug description"
git commit -m "docs: update documentation"
git commit -m "style: format code"
git commit -m "refactor: improve code structure"
```

### 5. Push and Create PR

```bash
git push origin feature/your-feature-name
```

## 📝 Code Style Guidelines

### JavaScript/JSX

- Use functional components
- Use hooks for state/lifecycle
- Destructure props
- Use template literals
- Prefer `const` over `let`

```jsx
// ✅ Good
const MyComponent = ({ title, onClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <button onClick={onClick}>
      {title}
    </button>
  );
};

// ❌ Avoid
function MyComponent(props) {
  var isOpen = false;
  return <button onClick={props.onClick}>{props.title}</button>;
}
```

### CSS/Styling

- Use CSS variables for theme colors
- Use Tailwind utility classes
- Use Framer Motion for animations
- Mobile-first approach

```jsx
// ✅ Good - Uses CSS variables
style={{ color: 'var(--color-text)' }}

// ❌ Avoid - Hardcoded colors
style={{ color: '#ffffff' }}
```

### 3D Components

- Use Suspense with fallback
- Optimize for mobile (hide or simplify)
- Use Drei helpers where possible

```jsx
// ✅ Good
<Canvas>
  <Suspense fallback={<CanvasLoader />}>
    <My3DComponent />
  </Suspense>
  <Preload all />
</Canvas>
```

## 🧪 Testing Checklist

Before submitting a PR, verify:

- [ ] `npm run dev` starts without errors
- [ ] `npm run build` completes successfully
- [ ] Theme toggle works (light ↔ dark)
- [ ] Mobile menu opens/closes
- [ ] All sections render correctly
- [ ] No console errors
- [ ] Responsive on mobile (375px)
- [ ] Responsive on tablet (768px)
- [ ] Contact form validation works

## 🎨 Adding New Features

### New Component

1. Create in `src/components/`
2. Follow the section template from `docs/AI_DEVELOPMENT.md`
3. Export from `src/components/index.js`
4. Add to `App.jsx` if needed

### New 3D Element

1. Create in `src/components/canvas/`
2. Use Canvas and Suspense
3. Export from `src/components/canvas/index.js`
4. Consider mobile fallback

### New Theme Colors

1. Add CSS variable in `src/index.css`
2. Add to both `:root` and `.dark`
3. Update Tailwind config if needed

## 📋 Issue Labels

| Label | Description |
|-------|-------------|
| `bug` | Something isn't working |
| `enhancement` | New feature request |
| `documentation` | Documentation updates |
| `good first issue` | Good for newcomers |
| `help wanted` | Extra attention needed |
| `performance` | Performance improvements |
| `design` | UI/UX improvements |

## 🙏 Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Welcome newcomers
- Focus on collaboration

## 📞 Need Help?

- Open an issue with `question` label
- Check existing issues/PRs
- Review documentation in `/docs`

Thank you for contributing! 🎉
