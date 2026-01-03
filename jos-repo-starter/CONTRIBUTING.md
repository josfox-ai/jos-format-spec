# Contributing to JOS

Thank you for your interest in contributing to the **JOS Open Standards Foundation** projects! 🦊

## Code of Conduct

We are committed to providing a welcoming and inclusive environment. Please be respectful and constructive in all interactions.

## How to Contribute

### 1. Reporting Issues

- **Bug Reports**: Use GitHub Issues with the `bug` label
- **Feature Requests**: Use GitHub Issues with the `enhancement` label
- **Questions**: Use GitHub Discussions

### 2. Submitting Changes

1. **Fork** the repository
2. **Create a branch**: `git checkout -b feature/your-feature-name`
3. **Make your changes** following our coding standards
4. **Test your changes**: Run `jos verify` to ensure everything works
5. **Commit** with clear messages: `git commit -m "feat: add new adapter for X"`
6. **Push** to your fork: `git push origin feature/your-feature-name`
7. **Open a Pull Request** against `main`

### 3. Commit Message Format

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]
[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Code style (formatting, no logic change)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

### 4. RFC Process

Major changes require an RFC (Request for Comments):

1. Create a `.jos` artifact describing the proposal
2. Submit as a PR to the `rfcs/` directory
3. Community discussion period (minimum 7 days)
4. Core team review and decision

## Development Setup

```bash
# Clone the repo
git clone https://github.com/josfox-ai/jos-format-spec.git
cd jos-format-spec

# Install dependencies
cd jos && npm install

# Run tests
npm test

# Verify installation
npm run test:cli
```

## Creating .jos Artifacts

When contributing new artifacts:

1. Follow the **JOS v0.0.7 specification**
2. Include complete `meta` block with name, version, description
3. Define clear `intention` with objective and success_criteria
4. Add `guardrails` for safety
5. Test with `jos validate your-artifact.jos`

## License

By contributing, you agree that your contributions will be licensed under the **MIT License**.

---

**Questions?** Open an issue or reach out to the maintainers.

*"Every contribution is a seed in the fractal forest."* 🌲
