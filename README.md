# Servicio Web de Inicio de Sesión
**Evidencia:** GA7-220501096-AA5-EV01

Sistema de autenticación web desarrollado con **React** (frontend) y **NestJS** (backend),
que valida usuario y contraseña contra una base de datos SQLite con contraseñas cifradas en bcrypt.

---

## Estructura del proyecto

```
├── backend/          # API REST con NestJS + TypeORM + SQLite
│   └── src/
│       ├── auth/     # Módulo de autenticación (login + JWT)
│       └── users/    # Módulo de usuarios (entidad + servicio)
├── frontend/         # SPA con React + Vite
│   └── src/
│       ├── components/   # LoginForm
│       ├── pages/        # Dashboard (post-login)
│       └── services/     # authService (llamadas a la API)
└── README.md
```

---

## Tecnologías utilizadas

| Capa      | Tecnología                              |
|-----------|-----------------------------------------|
| Frontend  | React 18, Vite, Axios                   |
| Backend   | NestJS 10, TypeORM, Passport, JWT       |
| Base de datos | SQLite (archivo local `database.sqlite`) |
| Seguridad | bcrypt (hash de contraseñas), JWT (tokens) |

---

## Requisitos previos

- Node.js v18 o superior
- npm v9 o superior
- Git

---

## Instalación y ejecución

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd "Diseño y Desarrollo de servicios web - caso GA7-220501096-AA5-EV01"
```

### 2. Backend (NestJS)

```bash
cd backend
npm install
npm run start:dev
```

El servidor arranca en **http://localhost:3000**

Al iniciar por primera vez, se crea automáticamente un usuario de prueba:
| Campo    | Valor     |
|----------|-----------|
| Usuario  | `admin`   |
| Contraseña | `Admin123!` |

### 3. Frontend (React)

```bash
cd frontend
npm install
npm run dev
```

La aplicación estará disponible en **http://localhost:5173**

---

## Endpoint de la API

### POST /auth/login

Valida credenciales y retorna un token JWT.

**Request:**
```json
{
  "username": "admin",
  "password": "Admin123!"
}
```

**Response exitoso (200):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "username": "admin"
}
```

**Response fallido (401):**
```json
{
  "statusCode": 401,
  "message": "Credenciales inválidas"
}
```

---

## Variables de entorno (backend)

Crear un archivo `.env` en la carpeta `backend/` basado en `.env.example`:

```env
JWT_SECRET=tu_secreto_seguro_aqui
PORT=3000
```

---

## Flujo de autenticación

```
Usuario        Frontend (React)         Backend (NestJS)       Base de datos
  |                  |                        |                      |
  |--- usuario/pass->|                        |                      |
  |                  |-- POST /auth/login ---->|                      |
  |                  |                        |-- buscar usuario ---->|
  |                  |                        |<-- user + hash -------|
  |                  |                        |-- bcrypt.compare()    |
  |                  |<---- JWT token ---------|                      |
  |<-- Dashboard ----|                        |                      |
```

---

## Seguridad implementada

- Las contraseñas **nunca se almacenan en texto plano** — se usa bcrypt con salt rounds = 10
- Los tokens JWT expiran en **1 hora**
- Se validan los datos de entrada con `class-validator` (DTOs)
- CORS configurado para aceptar solo el origen del frontend
- Las credenciales incorrectas retornan un mensaje genérico (no se revela si el usuario existe)

---

## Versionamiento

Este proyecto usa **Git** para control de versiones. Historial de commits:

```bash
git log --oneline
```
