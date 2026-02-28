#!/bin/bash
# ===========================================
# shinBlog Production Deployment Script
# ===========================================
# Run on the server: bash deploy.sh [command]
#
# Commands:
#   setup     - First-time server setup (Docker, directories)
#   deploy    - Build and start all services
#   update    - Pull latest code and redeploy
#   ssl       - Set up Let's Encrypt SSL certificate
#   logs      - View all service logs
#   status    - Check service status
#   stop      - Stop all services
#   restart   - Restart all services
#   db-seed   - Run database seed (after first deploy)
#   rag-index - Rebuild RAG index from exported content

set -e

# --- Configuration ---
PROJECT_DIR="/opt/shinblog"
BLOG_DIR="$PROJECT_DIR/shinBlog"
RAG_DIR="$PROJECT_DIR/RAG"
COMPOSE_FILE="docker-compose.prod.yml"
ENV_FILE=".env.production"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log() { echo -e "${GREEN}[deploy]${NC} $1"; }
warn() { echo -e "${YELLOW}[warn]${NC} $1"; }
error() { echo -e "${RED}[error]${NC} $1"; exit 1; }

# --- Commands ---

cmd_setup() {
    log "Setting up server environment..."

    # Install Docker if not present
    if ! command -v docker &> /dev/null; then
        log "Installing Docker..."
        curl -fsSL https://get.docker.com | sh
        sudo systemctl enable docker
        sudo systemctl start docker
        sudo usermod -aG docker "$USER"
        warn "Log out and back in for Docker group to take effect"
    else
        log "Docker already installed: $(docker --version)"
    fi

    # Install Docker Compose plugin if not present
    if ! docker compose version &> /dev/null; then
        log "Installing Docker Compose plugin..."
        sudo apt-get update
        sudo apt-get install -y docker-compose-plugin
    else
        log "Docker Compose already installed: $(docker compose version)"
    fi

    # Create project directories
    sudo mkdir -p "$PROJECT_DIR"
    sudo chown "$USER:$USER" "$PROJECT_DIR"

    log "Setup complete!"
    log ""
    log "Next steps:"
    log "  1. Copy shinBlog code to $BLOG_DIR"
    log "  2. Copy RAG code to $RAG_DIR"
    log "  3. Copy .env.production.example to $BLOG_DIR/.env.production and fill in values"
    log "  4. Run: bash deploy.sh deploy"
}

cmd_deploy() {
    cd "$BLOG_DIR" || error "Blog directory not found: $BLOG_DIR"
    [ -f "$ENV_FILE" ] || error "Missing $ENV_FILE — copy from .env.production.example"
    [ -d "$RAG_DIR/src" ] || error "RAG directory not found: $RAG_DIR"

    log "Building and starting services..."
    docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" up -d --build

    log "Waiting for services to be healthy..."
    sleep 10

    # Run Prisma migrations
    log "Running database migrations..."
    docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" exec blog npx prisma db push

    log "Deployment complete!"
    cmd_status
}

cmd_update() {
    cd "$BLOG_DIR" || error "Blog directory not found: $BLOG_DIR"

    log "Rebuilding and restarting services..."
    docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" up -d --build

    log "Running database migrations..."
    sleep 5
    docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" exec blog npx prisma db push

    log "Update complete!"
    cmd_status
}

cmd_ssl() {
    cd "$BLOG_DIR" || error "Blog directory not found: $BLOG_DIR"

    read -p "Enter your domain name (e.g., shin.blog): " DOMAIN
    read -p "Enter your email for Let's Encrypt: " EMAIL

    log "Requesting SSL certificate for $DOMAIN..."
    docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" run --rm certbot certonly \
        --webroot --webroot-path=/var/www/certbot \
        --email "$EMAIL" --agree-tos --no-eff-email \
        -d "$DOMAIN"

    log "SSL certificate obtained!"
    log ""
    log "Now update nginx/conf.d/default.conf:"
    log "  1. Uncomment the HTTPS server block"
    log "  2. Uncomment the HTTP→HTTPS redirect block"
    log "  3. Comment out the plain HTTP server block"
    log "  4. Replace 'your-domain.com' with '$DOMAIN'"
    log "  5. Run: bash deploy.sh restart"
    log ""
    log "Set up auto-renewal cron job:"
    log "  echo '0 3 * * 0 cd $BLOG_DIR && docker compose -f $COMPOSE_FILE run --rm certbot renew && docker compose -f $COMPOSE_FILE exec nginx nginx -s reload' | crontab -"
}

cmd_logs() {
    cd "$BLOG_DIR" || error "Blog directory not found: $BLOG_DIR"
    docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" logs -f --tail=50 "$@"
}

cmd_status() {
    cd "$BLOG_DIR" || error "Blog directory not found: $BLOG_DIR"
    log "Service status:"
    docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" ps
    log ""
    log "Memory usage:"
    docker stats --no-stream --format "table {{.Name}}\t{{.MemUsage}}\t{{.CPUPerc}}" 2>/dev/null || true
}

cmd_stop() {
    cd "$BLOG_DIR" || error "Blog directory not found: $BLOG_DIR"
    log "Stopping all services..."
    docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" down
    log "Stopped."
}

cmd_restart() {
    cd "$BLOG_DIR" || error "Blog directory not found: $BLOG_DIR"
    log "Restarting services..."
    docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" restart
    log "Restarted."
    cmd_status
}

cmd_db_seed() {
    cd "$BLOG_DIR" || error "Blog directory not found: $BLOG_DIR"
    log "Seeding database..."

    # Copy seed script into container and run
    docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" exec blog \
        sh -c "node scripts/seed-blog-posts.js"

    log "Database seeded!"
}

cmd_rag_index() {
    cd "$BLOG_DIR" || error "Blog directory not found: $BLOG_DIR"
    log "Rebuilding RAG index..."

    docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" exec rag-api \
        python -m src.rust_doc_assistant.core.indexer

    log "RAG index rebuilt! Restarting RAG service..."
    docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" restart rag-api
    log "Done."
}

# --- Main ---
case "${1:-}" in
    setup)     cmd_setup ;;
    deploy)    cmd_deploy ;;
    update)    cmd_update ;;
    ssl)       cmd_ssl ;;
    logs)      cmd_logs "${@:2}" ;;
    status)    cmd_status ;;
    stop)      cmd_stop ;;
    restart)   cmd_restart ;;
    db-seed)   cmd_db_seed ;;
    rag-index) cmd_rag_index ;;
    *)
        echo "Usage: bash deploy.sh <command>"
        echo ""
        echo "Commands:"
        echo "  setup      First-time server setup (Docker, directories)"
        echo "  deploy     Build and start all services"
        echo "  update     Rebuild and restart (after code changes)"
        echo "  ssl        Set up Let's Encrypt SSL certificate"
        echo "  logs       View service logs (add service name to filter)"
        echo "  status     Check service status and memory"
        echo "  stop       Stop all services"
        echo "  restart    Restart all services"
        echo "  db-seed    Seed blog posts into database"
        echo "  rag-index  Rebuild RAG vector index"
        ;;
esac
