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

Swapi requires **Node.js** and **npm**. Install dependencies using:

```sh
npm install
```

You will need to run this in the root directory, as well as both the client and server folders.

### 3. Running the Project Locally (Vite + Express)

Swapi is now a **Vite + Express** project. Use the following commands based on what you need:

- **Start the development server from the root directory (this spins up both frontend & backend with hot reloading):**

  ```sh
  npm run dev
  ```

  - **Frontend runs on** `http://localhost:5173`
  - **Backend API runs on** `http://localhost:5000`
  - **Requests from :5173 will proxy to :5000**

- **Run only the backend (Express server with Nodemon):**

  ```sh
  npm run dev:server
  ```

- **Run only the frontend (Vite's hot-reload dev server):**

  ```sh
  npm run dev:client
  ```

- **Build the frontend for production:**
  ```sh
  npm run build
  ```

### 4. MongoDB Setup & Seeding

Swapi requires a **MongoDB instance** to run locally.

## 🌱 Seeding the Database

Before running the project, you may want to **populate the database** with demo data.

### **🛠 Running the Seed Script**

To seed **all available models**, from inside of the **server directory**, run:

```sh
npm run seed
```

🛠 Seeding Specific Models
You can optionally specify which models to seed:

```sh
npm run seed -- people films planets
```

This will only seed the people, films, and planets collections.

- NOTE: passing starships or vehicles will automatically seed from "transports".

⚠️ Confirmation Step
The script will prompt you for confirmation before proceeding with the seeding process.

🛠 Resetting the Database
If you need to completely reset the database, you can run:

```sh
node resetDB.js
```

🚀 Now you're ready to contribute!

---

## 📌 Coding Standards

- Follow the existing **code style and structure**.
- Use **meaningful commit messages**.
- Write **clear and concise comments** where necessary.
- Ensure code changes **do not break existing functionality**.
- Format code for tabs with a size of 2.

---

## 🐛 Reporting Issues

If you find a bug or have a feature request:

1. **Search existing issues** to avoid duplicates.
2. If no similar issue exists, [open a new issue](https://github.com/semperry/swapi/issues/new).
3. Include **steps to reproduce, expected vs. actual behavior, and environment details (OS, Node.js version, etc.)**.

---

## 🚀 Submitting Pull Requests (PRs)

### 1. Create a Feature Branch

Always create a new branch from `dev` for your changes:

```sh
git checkout dev # Switch to the dev branch
git fetch upstream dev # Fetch the latest dev branch from the main repo
git pull upstream dev # Ensure your local dev branch is up to date
git checkout -b feature-branch-name # Create your feature branch
```

#### ✅ This ensures all features branch from dev, preventing conflicts in main.

### 2. Make Your Changes

- Test your changes locally.
- Ensure new features do not introduce breaking changes.
- If making UI or API changes, update relevant **documentation** in the documentation React component as well as the README file if necessary.

### 3. Commit and Push

```sh
git add .
git commit -m "Brief description of changes"
git push origin feature-branch-name
```

### 4. Open a Pull Request

1. **Make sure your feature branch is up to date with `dev` from the main repo:**
   ```sh
   git checkout dev
   git fetch upstream dev # Fetch the latest changes
   git pull upstream dev # Pull the latest dev into local dev branch
   git checkout your-feature-name
   git merge dev  # Merge the latest dev into your feature branch
   ```
2. Push your branch to GitHub. If there were conflicts or final changes made, be sure to add and commit first.
   ```sh
   git push origin your-feature-name
   ```
3. Go to your forked repository on GitHub.
4. Click **Compare & pull request**.

- Base branch: `dev` (not main!)
- Compare branch: your-feature-name
- Fill in a clear **title and description** of your changes.
- Ensure all commits are squashed into a single meaningful commit before submitting the PR.
- Add yourself to the [`CONTRIBUTORS.md`](CONTRIBUTORS.md) file under the appropriate section and in alphabetical order, if you haven't already. Recommit and push if necessary.
- If you have financially supported the project, you may also add yourself under the **Donors & Supporters section** in both this file and the [`CONTRIBUTORS.md`](CONTRIBUTORS.md).

9. Submit the PR and wait for review!

---

## 🔥 Contribution Types & Recognition

All contributions are recognized in [`CONTRIBUTORS.md`](CONTRIBUTORS.md). You can contribute in multiple ways:

- 🛠 **Code Contributions**: API improvements, bug fixes, optimizations.
- 📝 **Documentation**: Enhancing API docs, adding examples.
- 🐛 **Bug Reports & Testing**: Finding and reporting issues.
- 🌱 **Ideas & Suggestions**: Proposing new features.
- 🔌 **Third-Party Integrations**: Creating libraries or SDKs.
- 📢 **Community & Support**: Helping others use Swapi.
- 💖 **Donors & Supporters**: Providing financial contributions to keep the project running.

Want to be listed? Open an issue or PR! 🚀

---

## ❓ Need Help?

If you have any questions, feel free to **open a discussion** or reach out via [GitHub Issues](https://github.com/semperry/swapi/issues). Happy coding! 🎉
