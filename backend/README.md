i addded volumes in docker both inside environment and outside : 

version: '3.8'

services:
  postgres:
    image: postgres:15
    restart: always
    container_name: library_postgres
    environment:
      POSTGRES_USER: posgtres
      POSTGRES_PASSWORD: NightyWolf
      POSTGRES_DB: library_db
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
  
volumes:
  postgres_data:


then : docker-compose -f docker/docker-compose.yml up -d


