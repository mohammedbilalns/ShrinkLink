# ShrinkLink

ShrinkLink is a URL shortener built with Go and React.

It allows users to create short URLs, generate custom slugs, track click counts, and manage their URLs through a dashboard.

---

## Features

- Shorten long URLs instantly
- Redirect short URLs to their original destination
- Click tracking
- JWT authentication
- Custom short URLs
- Personal dashboard
- paginated URL history
- Track URL click statistics

---

## Tech Stack

### Backend

- Go
- MongoDB
- Redis
- JWT Authentication
- Brevo Email Service

### Frontend

- React
- Vite
- TanStack Router
- TanStack Query
- Redux Toolkit
- Axios
- Tailwind CSS
- Sonner Toasts

---

## Project Structure

```text
ShrinkLink/
├── backend/
│   ├── cmd/api
│   ├── internal/
│   │   ├── app
│   │   ├── cache
│   │   ├── config
│   │   ├── db
│   │   ├── handler
│   │   ├── middleware
│   │   ├── repository
│   │   ├── router
│   │   └── services
│   └── go.mod
│
├── frontend/
│   ├── src/
│   │   ├── api
│   │   ├── components
│   │   ├── pages
│   │   ├── routing
│   │   ├── store
│   │   └── utils
│   └── package.json
│
└── README.md

