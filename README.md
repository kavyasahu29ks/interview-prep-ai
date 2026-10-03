# InterviewPrepAI

A production-ready interview preparation platform with React + Vite frontend, Express backend, JWT authentication, and Gemini-powered question explanations.

## Project structure

- /client - React + Vite + Tailwind frontend
- /server - Express + Mongoose + JWT backend

## Environment setup

Create server environment variables from the example file:

```bash
cp server/.env.example server/.env
```

Set values for:
- MONGO_URI
- JWT_SECRET
- GEMINI_API_KEY
- PORT

## Install dependencies

```bash
npm install
npm install --prefix server
npm install --prefix client
```

## Run the app

Backend:

```bash
npm --prefix server run dev
```

Frontend:

```bash
npm --prefix client run dev
```

## Features implemented

- Auth: register, login, JWT protected routes
- Workspaces: create, read, update, delete
- Questions: generate, save, complete, delete
- AI explanation: Gemini-powered structured explanations
- Dashboard and modern responsive UI

## Notes

- Gemini integration is server-side only.
- API keys are never stored in the frontend.
- Passwords are never exposed by the API.
