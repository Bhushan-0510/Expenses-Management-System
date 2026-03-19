# Personal Expense Analyzer Backend

Production-ready backend using **Node.js**, **Express**, and **MongoDB (Mongoose)** with JWT authentication.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env` (copy from `.env.example`) and set values:

```bash
copy .env.example .env
```

3. Start server:

```bash
npm run dev
```

Health check: `GET /health`

Swagger UI (interactive docs): `GET /api-docs`

## API

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`

### Categories (JWT required)

- `POST /api/categories` (body: `{ "name": "Food" }`)
- `GET /api/categories`

### Expenses (JWT required)

- `POST /api/expenses` (body: `{ "amount": 120, "note": "Lunch", "categoryId": "...", "date": "2026-03-18" }`)
  - If `date` not provided, current date is used
  - Future dates are rejected
- `GET /api/expenses?month=YYYY-MM&categoryId=<id>`
- `DELETE /api/expenses/:id`

## Postman

- Import `postman_collection.json` into Postman.
- Set `baseUrl` collection variable to your server URL (e.g. `https://expenses-management-system-ga8g.onrender.com`).
- Call **Auth → Login** once; it will store `jwtToken` for subsequent protected requests.


