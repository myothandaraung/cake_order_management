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

## Image uploads (Supabase Storage)

Cake photos are uploaded by the admin UI to `POST /api/v1/files` (multipart field `file`),
which stores them in a Supabase Storage bucket and returns `{ url, path, bucket }`.
The URL is then saved on the cake as `imageUrl` / `image_url`.

The service role key stays on the server — the browser only ever sees the public object URL.

1. In Supabase, create a **public** bucket (default name `cake-images`).
2. Add the credentials to `admin-api/.env` (or the environment):

   ```properties
   SUPABASE_URL=https://<project-ref>.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
   SUPABASE_STORAGE_BUCKET=cake-images   # optional
   SUPABASE_MAX_FILE_SIZE_MB=5           # optional
   ```

3. Restart the API. Uploads are limited to JPG, PNG, WebP, GIF and AVIF.
   Without these values the endpoint answers `503` with a clear message and the UI shows it.

## Getting Started

### Prerequisites

- JDK 21
- Maven 3.9+
- PostgreSQL 15+ (or Supabase)

### Configuration

1. Copy `.env.example` to `.env` and configure your database credentials
2. Add the Supabase Storage values above so cake photos can be uploaded
3. Update `application.yml` or environment variables as needed

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
