# Contributing to SmartRental Platform

Thank you for your interest in contributing to SmartRental! 🎉

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for everyone.

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in [Issues](https://github.com/your-repo/issues)
2. If not, create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Environment details (OS, Node version, browser)

### Suggesting Features

1. Check existing [Issues](https://github.com/your-repo/issues) for similar requests
2. Create a new issue with:
   - Clear description of the feature
   - Use cases and benefits
   - Possible implementation approach

### Pull Requests

1. **Fork the repository**
   ```bash
   git clone https://github.com/your-username/smart-rental-frontend.git
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Make your changes**
   - Write clean, readable code
   - Follow existing code style
   - Add comments for complex logic
   - Update documentation if needed

4. **Test your changes**
   ```bash
   npm run build
   npm run lint
   npm run type-check
   ```

5. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add amazing feature"
   ```
   
   Follow [Conventional Commits](https://www.conventionalcommits.org/):
   - `feat:` new feature
   - `fix:` bug fix
   - `docs:` documentation changes
   - `style:` formatting changes
   - `refactor:` code refactoring
   - `test:` adding tests
   - `chore:` maintenance tasks

6. **Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```

7. **Create Pull Request**
   - Go to the original repository
   - Click "New Pull Request"
   - Select your branch
   - Fill in PR template with details

## Development Guidelines

### Code Style

- Use TypeScript for type safety
- Follow ESLint rules (`npm run lint`)
- Use functional components with hooks
- Keep components small and focused
- Extract reusable logic into custom hooks

### File Naming

- Components: PascalCase (e.g., `PropertyCard.tsx`)
- Utilities: camelCase (e.g., `formatPrice.ts`)
- Pages: lowercase with dash (e.g., `property-detail.tsx`)

### Component Structure

```tsx
// Imports
import React from 'react'
import { SomeType } from '@/types'

// Types/Interfaces
interface ComponentProps {
  title: string
  count: number
}

// Component
export const Component: React.FC<ComponentProps> = ({ title, count }) => {
  // State and hooks
  const [state, setState] = useState()
  
  // Effects
  useEffect(() => {
    // ...
  }, [])
  
  // Handlers
  const handleClick = () => {
    // ...
  }
  
  // Render
  return (
    <div>
      {/* JSX */}
    </div>
  )
}

export default Component
```

### CSS/Tailwind

- Use Tailwind utility classes
- Keep custom CSS minimal
- Use consistent spacing (multiples of 4)
- Follow mobile-first approach

### TypeScript

- Always define types for props
- Use interfaces for object shapes
- Avoid `any` type
- Use strict mode

## Testing

```bash
# Run all tests (TODO: Add tests)
npm test

# Run with coverage
npm run test:coverage

# E2E tests with Cypress (TODO)
npm run cypress:open
```

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/          # Next.js pages (routes)
├── lib/            # Core utilities
├── styles/         # Global styles
├── types/          # TypeScript types
└── utils/          # Helper functions
```

## Documentation

- Update README.md for user-facing changes
- Add JSDoc comments for complex functions
- Update SETUP.md for setup changes
- Keep CHANGELOG.md updated

## Questions?

- Open a [Discussion](https://github.com/your-repo/discussions)
- Reach out on Discord/Slack
- Email: dev@smartrental.com

## Recognition

Contributors will be added to the README and project documentation.

Thank you for contributing! 🙌
