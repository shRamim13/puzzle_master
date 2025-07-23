# Docker Setup for Treasure Hunt Game

## Quick Setup

### 1. Install Docker (if not installed)
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install docker.io docker-compose -y

# Start Docker service
sudo systemctl start docker
sudo systemctl enable docker

# Add user to docker group (optional)
sudo usermod -aG docker $USER
```

### 2. Build and Run
```bash
# Build the images
docker-compose build

# Run the application
docker-compose up

# Or run in background
docker-compose up -d
```

### 3. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

### 4. Stop the Application
```bash
docker-compose down
```

## Individual Services

### Run Backend Only
```bash
docker build -f Dockerfile.backend -t treasure-hunt-backend .
docker run -p 5000:5000 treasure-hunt-backend
```

### Run Frontend Only
```bash
docker build -f Dockerfile.frontend -t treasure-hunt-frontend .
docker run -p 3000:3000 treasure-hunt-frontend
```

## Environment Variables

The application uses these environment variables (already set in docker-compose.yml):

```env
# Backend
NODE_ENV=development
MONGODB_URI=mongodb+srv://shramim13:sabbirRamim13@picnic.bu4fww5.mongodb.net/treasure_hunt
JWT_SECRET=treasure_hunt_jwt_secret_key_2024_make_it_very_long_and_secure
PORT=5000

# Frontend
REACT_APP_API_URL=http://localhost:5000/api
CHOKIDAR_USEPOLLING=true
```

## Troubleshooting

### Port Already in Use
If ports 3000 or 5000 are already in use:
```bash
# Check what's using the ports
sudo netstat -tlnp | grep :3000
sudo netstat -tlnp | grep :5000

# Kill the processes or change ports in docker-compose.yml
```

### Permission Issues
```bash
# If you get permission errors
sudo chown -R $USER:$USER .
```

### Database Connection Issues
- Make sure MongoDB Atlas is accessible
- Check network connectivity
- Verify connection string in environment variables

## Development with Docker

### View Logs
```bash
# All services
docker-compose logs

# Specific service
docker-compose logs backend
docker-compose logs frontend

# Follow logs
docker-compose logs -f
```

### Rebuild After Changes
```bash
# Rebuild and restart
docker-compose up --build

# Rebuild specific service
docker-compose build backend
docker-compose up backend
```

### Access Container Shell
```bash
# Backend container
docker-compose exec backend sh

# Frontend container
docker-compose exec frontend sh
```

## Production Deployment

For production, modify the Dockerfiles:

1. Use `npm run build` for frontend
2. Use `npm start` for backend (not dev)
3. Set `NODE_ENV=production`
4. Use nginx for frontend serving
5. Add health checks

## Sample Commands

```bash
# Start everything
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f

# Stop everything
docker-compose down

# Remove everything including volumes
docker-compose down -v

# Clean up images
docker system prune -a
``` 