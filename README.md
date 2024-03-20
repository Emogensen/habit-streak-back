# HABIT STREAK BACKEND

## Description

This project serves as the backend foundation for a habit tracking website, designed to empower users to monitor and foster their daily habits for personal growth and improvement. Currently, it features a robust authentication system, laying the groundwork for a secure user experience. The future roadmap includes extending this backend to support a comprehensive suite of functionalities enabling users to create, track, and analyze their habits over time.

Built with the robustness of TypeScript, the efficiency of Node.js, the flexibility of Express, and the power of Mongoose, this project is engineered to provide a scalable and maintainable platform.

## Installation

- [Install Node](https://nodejs.org/en)
- [Install npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
- Install dependencies `npm install`
- Add a file for env variables in the root directory `touch .env` (on Unix systems), `type nul >> .env` (on Windows) or just add it manually
- Add the following variables to your .env file:

```bash
# .env example
DB_URI = secret
JWT_SECRET = secret
REFRESH_SECRET = secret
```

- [Set up a MongoDB Cluster](https://www.mongodb.com/docs/guides/atlas/cluster/)
- [Get connection string](https://www.mongodb.com/docs/guides/atlas/connection-string/)
- Add your database connection string to your `DB_URI`-variable
- Generate a random Base64 string and add it to your `JWT_SECRET`-variable
- Generate a random Base64 string and add it to your `REFRESH_SECRET`-variable
- Start dev server `npm dev`
