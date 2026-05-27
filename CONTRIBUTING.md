# Contributing to Lucky Draw Picker

Thanks for your interest in contributing! We welcome contributions from everyone.

## How to Contribute

### Report a Bug

1. Check if the bug has already been reported in [Issues](https://github.com/chennaireact/luckydraw-picker/issues)
2. If not, open a new issue with:
   - A clear, descriptive title
   - Steps to reproduce
   - Expected vs. actual behavior
   - Screenshots if applicable
   - Browser/device info

### Suggest a Feature

1. Open an issue with the label `enhancement`
2. Describe the feature, the use case, and why it would benefit the project

### Submit a Pull Request

1. **Fork** the repository
2. Create a **feature branch** from `main`:
   ```bash
   git checkout -b feature/my-feature
   ```
3. Make your changes with clear, descriptive commits
4. **Test locally** — make sure all checks pass:
   ```bash
   npm run lint        # ESLint must pass
   npm run test:run    # All 45 tests must pass
   npm run build       # Production build must succeed
   ```
5. Push your branch and open a **Pull Request** against `main`

## Development Setup

```bash
# Clone your fork
git clone https://github.com/your-username/luckydraw-picker.git
cd luckydraw-picker

# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

### Available Scripts

| Command                 | Description                           |
| ----------------------- | ------------------------------------- |
| `npm run dev`           | Start development server (hot reload) |
| `npm run build`         | Create production build               |
| `npm run preview`       | Preview the production build locally  |
| `npm run lint`          | Lint all JS/JSX files with ESLint     |
| `npm run format`        | Format all files with Prettier        |
| `npm run test`          | Run tests in watch mode               |
| `npm run test:run`      | Run tests once (CI-friendly)          |
| `npm run test:coverage` | Run tests with coverage report        |

## Writing Tests

We use [Vitest](https://vitest.dev) with [Testing Library](https://testing-library.com). All new features or bug fixes **should include tests**.

### Test Structure

```
src/test/
├── setup.js           # jsdom environment, canvas/audio mocks
├── logic.test.js       # Pure logic unit tests
└── App.test.jsx        # React component integration tests
```

### Adding a New Test

- **Pure logic** (parsing, calculations, algorithms) → add to `logic.test.js`
- **Component rendering / UI behavior** → add to `App.test.jsx`
- **New component** → create `ComponentName.test.jsx` in `src/test/`

### Test Conventions

- Use `describe` / `it` blocks for organization
- Test file names must match `*.test.{js,jsx}` for Vitest to pick them up
- Mock external libraries (`canvas-confetti`, `framer-motion`, `html2canvas`) at the top of the test file
- Import `@testing-library/jest-dom/vitest` matchers are set up globally in `setup.js`

### Running Tests

```bash
# Watch mode — re-runs on file changes
npm run test

# Single run — for CI and pre-push
npm run test:run

# With coverage report
npm run test:coverage
```

## Code Style

- Use **PascalCase** for React components
- Keep CSS organized — new features go in the appropriate section of `App.css`
- Write meaningful, concise commit messages
- Keep the UI consistent with the existing clean corporate aesthetic
- Run `npm run format` before committing to ensure consistent formatting

## Git Hooks

[Husky](https://github.com/typicode/husky) automatically runs checks:

- **pre-commit** — lint-staged runs ESLint and Prettier on staged files
- **pre-push** — runs `npm run lint` + `npm run test:run`
  - Push is blocked if linting fails or any tests fail

If you need to skip hooks temporarily (not recommended):

```bash
git commit --no-verify    # Skip pre-commit
git push --no-verify      # Skip pre-push
```

## Pull Request Guidelines

- One feature or fix per PR — keep it focused
- Include a clear description of what changed and why
- Add screenshots for any visual changes
- All tests must pass (`npm run test:run`)
- Linting must pass (`npm run lint`)
- Production build must succeed (`npm run build`)
- Keep PRs small and easy to review

## Questions?

Feel free to open an issue or reach out to the [ChennaiReact](https://chennaireact.in) team.

---

Made with 💙 by [ChennaiReact](https://chennaireact.in)
