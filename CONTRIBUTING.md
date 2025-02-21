# Contributing to Swapi

Thank you for your interest in contributing to Swapi! 🚀 This guide will help you get started with making meaningful contributions to the project.

---

## 🛠 Getting Started

### 1. Fork the Repository

1. Go to the [Swapi GitHub repository](https://github.com/semperry/swapi).
2. Click the **Fork** button in the top-right corner.
3. Clone your forked repository to your local machine:
   ```sh
   git clone https://github.com/YOUR_GITHUB_USERNAME/swapi.git
   cd swapi
   ```
4. Add the upstream repository to keep your fork updated:
   ```sh
   git remote add upstream https://github.com/semperry/swapi.git
   ```

### 2. Install Dependencies

Swapi requires Node.js and npm. Install dependencies using:

```sh
npm install
```

### 3. Run the Project Locally

There are multiple ways to start the project based on your needs:

- **Start the frontend development server for React and SCSS work**:
  ```sh
  npm start
  ```
- **Start the backend development server for API development**:
  ```sh
  npm run dev:server
  ```
- **Build the frontend and run the backend for a production mockup, and to have requests proxied properly**:
  ```sh
  npm run dev
  ```

The API should now be running on `http://localhost:8080` or potentially `http://localhost:8081`. Adjust scripts as needed based on your environment.

The API should now be running on `http://localhost:8080`.

### 4. Seed your Mongo instance

Currently, there is no seed script available. The fixtures includes the original data from swapi. Seed script is in the making.

---

## 📌 Coding Standards

- Follow the existing **code style and structure**.
- Use **meaningful commit messages**.
- Write **clear and concise comments** where necessary.
- Ensure code changes **do not break existing functionality**.

---

## 🐛 Reporting Issues

If you find a bug or have a feature request:

1. **Search existing issues** to avoid duplicates.
2. If no similar issue exists, [open a new issue](https://github.com/semperry/swapi/issues/new).
3. Include **steps to reproduce, expected vs. actual behavior, and environment details (OS, Node.js version, etc.)**.

---

## 🚀 Submitting Pull Requests (PRs)

### 1. Create a Feature Branch

Always create a new branch for your changes:

```sh
# From the main branch
git checkout -b feature-branch-name
```

### 2. Make Your Changes

- Test your changes locally.
- Ensure new features do not introduce breaking changes.
- If making UI or API changes, update relevant **documentation**.

### 3. Commit and Push

```sh
git add .
git commit -m "Brief description of changes"
git push origin feature-branch-name
```

### 4. Open a Pull Request

1. Go to your forked repository on GitHub.
2. Click **Compare & pull request**.
3. Fill in a clear **title and description** of your changes.
4. Ensure all commits are squashed into a single meaningful commit before submitting the PR.
5. Add yourself to the [`CONTRIBUTORS.md`](CONTRIBUTORS.md) file under the appropriate section and in alphabetical order.
6. Submit the PR and wait for review!

---

## 🔥 Contribution Types & Recognition

All contributions are recognized in [`CONTRIBUTORS.md`](CONTRIBUTORS.md). You can contribute in multiple ways:

- 🛠 **Code Contributions**: API improvements, bug fixes, optimizations.
- 📝 **Documentation**: Enhancing API docs, adding examples.
- 🐛 **Bug Reports & Testing**: Finding and reporting issues.
- 🌱 **Ideas & Suggestions**: Proposing new features.
- 🔌 **Third-Party Integrations**: Creating libraries or SDKs.
- 📢 **Community & Support**: Helping others use Swapi.

Want to be listed? Open an issue or PR! 🚀

---

## ❓ Need Help?

If you have any questions, feel free to **open a discussion** or reach out via [GitHub Issues](https://github.com/semperry/swapi/issues). Happy coding! 🎉
