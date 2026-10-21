# Cake Ordering System - Admin API

Spring Boot 3.x REST API for the Cake Ordering System admin back office.

## Tech Stack

- Java 21
- Spring Boot 3.3.x
- Spring Data JPA + PostgreSQL
- Spring Security + JWT (jjwt)
- Flyway for database migrations
- OpenAPI 3 (springdoc)
- Testcontainers for integration testing

## Getting Started

### Prerequisites

- JDK 21
- Maven 3.9+
- PostgreSQL 15+ (or Supabase)

### Configuration

1. Copy `.env.example` to `.env` and configure your database credentials
2. Update `application.yml` or environment variables as needed

### Running Locally

```bash
mvn spring-boot:run
```

The API will be available at `http://localhost:8080/api/v1`

### API Documentation

- Swagger UI: `http://localhost:8080/api/v1/swagger-ui.html`
- OpenAPI Spec: `http://localhost:8080/api/v1/v3/api-docs`

### Running Tests

```bash
mvn test
```

### Building

```bash
mvn clean package
```
