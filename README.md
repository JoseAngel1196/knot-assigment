# knot-assignment

## Quick Start

1. **Start the entire application:**

   ```bash
   make up
   ```

2. **Access the applications:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080
   - Database: localhost:5432

## Available Commands

Run `make` or `make help` to see all available commands.

### Essential Commands

```bash
# Start all services
make up

# Start in background
make up-detached

# Stop all services
make down
```

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   PostgreSQL    │
│   (Next.js)     │────│   (FastAPI)     │────│   Database      │
│   Port: 3000    │    │   Port: 8080    │    │   Port: 5432    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Development

### Environment Variables

- Frontend uses `NEXT_PUBLIC_API_URL` to connect to backend
- Backend uses `DATABASE_URL` to connect to PostgreSQL

## Individual Services

### Backend Only

```bash
cd backend
make docker-up
```

### Frontend Only

```bash
cd frontend
docker-compose up --build
```

## Repo Structure

```
knot-assignment/
├── backend/
│   ├── Dockerfile
│   ├── docker-compose.yml
│   ├── Makefile
│   └── ...
├── frontend/
│   ├── Dockerfile
│   ├── docker-compose.yml
│   └── ...
├── docker-compose.yml        # Full stack orchestration
├── Makefile                  # Full stack commands
└── README.md                 # This file
```
