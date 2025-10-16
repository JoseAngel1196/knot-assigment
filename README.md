# Knot Assigment

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

# View logs
make logs

# Check status
make ps
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

### Hot Reloading
Both frontend and backend support hot reloading during development:
- Frontend: Source files are mounted as volumes
- Backend: Source files are mounted as volumes

### Database
- Persistent data storage using Docker volumes
- Automatic migrations on backend startup
- Database user: `knot` / password: `knot_password`

### Environment Variables
- Frontend uses `NEXT_PUBLIC_API_URL` to connect to backend
- Backend uses `DATABASE_URL` to connect to PostgreSQL

## Individual Services

You can also run services individually:

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

## Troubleshooting

### Port Conflicts
If you get port conflicts, make sure these ports are free:
- 3000 (frontend)
- 8080 (backend)
- 5432 (database)

### Database Issues
```bash
# Check database logs
make logs-postgres

# Reset database (removes all data)
make down-volumes
make up
```

### Service Issues
```bash
# Check individual service logs
make logs-backend
make logs-frontend

# Restart specific service
docker-compose restart backend
docker-compose restart frontend
```

### Clean Restart
```bash
# Stop everything and remove volumes
make down-volumes

# Rebuild and start fresh
make up
```

## Production Considerations

This setup is optimized for development. For production:
1. Use proper environment variables
2. Set up proper SSL/TLS certificates
3. Use a production database
4. Configure proper networking and security
5. Set up proper logging and monitoring

## File Structure

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
