# Welcome to the StarKitchen app monorepo

## Getting Started

Follow these steps to get started with the monorepo and set up your project:

1. **Decide on the Look and Feel**
   - Use tools like [https://v0.dev](https://v0.dev) or similar to play around and decide on the design and aesthetics of your project.

2. **Fork and Clone the Repository**
   - Fork this repository and clone it to your local machine.

3. **Install Node.js**
   - Ensure you have **Node.js v20 or higher** installed on your computer. Download it from [Node.js](https://nodejs.org).

4. **Install `pnpm` Globally**
   - Run the following command to install `pnpm` globally:
     ```bash
     npm install -g pnpm
     ```

5. **Navigate to the Monorepo Root**
   - Change to the root directory of the monorepo:
     ```bash
     cd <path-to-monorepo-root>
     ```

6. **Add Env Variables**
   - Add env variable files - `".env.development"` and `".env.production"` under your-app-name/apps/app-name aka - frontend package root folder (ask Itay/Liad/Gil for variable values)

7. **Update Application Name**
   - Replace all occurrences of `"catering-app"` and `"starkitchen"` in the repository with your desired application name. This may include package names, configurations, or deployment references.

8. **Install Dependencies**
   - Run the following command to install all dependencies:
     ```bash
     pnpm i
     ```

9. **Customize Functionality**
   - Navigate to the `apps/starkitchen` folder:
     ```bash
     cd apps/starkitchen
     ```
   - Start adding or removing functionality to tailor it to your app's requirements. **Important:** Do not delete the `components/ui` folder, as it contains essential UI components.

10. **Run the App**
   - Start the app using one of the following commands:
     - From the `apps/starkitchen` directory:
       ```bash
       pnpm run dev
       ```
     - From the monorepo root:
       ```bash
       pnpm run dev:starkitchen
       ```

11. **Check your deployed up**
    - You can see your app live on {your-github-username}.github.io/{repo-name} for example: gilbens-starkware.github.io/catering-app
---

### IMPORTANT: Deployment

1. **Make the Repository Public**
   - Update the repository visibility to **public** in your Git hosting provider (e.g., GitHub).

2. **Deploy the App**
   - Deploy the app using:
     ```bash
     pnpm run deploy
     ```

3. **Explore Other Scripts**
   - Check the `package.json` file for other available scripts and explore their functionality.

---

# Sub Packages' Readme files

## packages/starknet-contract-connect

### [StarkNet Contract Connect](packages/starknet-contract-connect/README.md)
A reusable library for wallet integration and smart contract interaction with on Starknet with React + Typescript at its core.

---

## apps/starkitchen

### [StarKitchen](apps/starkitchen/README.md)
A StarkNet-powered application showcasing the usage of the `starknet-contract-connect` library in a catering registration web app.
