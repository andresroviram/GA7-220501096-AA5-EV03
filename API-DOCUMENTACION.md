# Documentación de APIs — GA7-220501096-AA5-EV03

Base URL: `http://localhost:3000`
Todas las rutas protegidas requieren el header:
`Authorization: Bearer <access_token>`

---

## 1. Autenticación — `POST /auth/login`

Valida correo y contraseña del usuario. Devuelve un token JWT y los datos básicos de sesión.

**BODY:**
```json
{
  "correo": "admin@escuela.edu",
  "password": "Admin123!"
}
```

**RESPONSE:** `200 OK`
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "id": 1,
  "correo": "admin@escuela.edu",
  "nombre": "Carlos Admin",
  "tipo_usuario": "administrativo",
  "telefono": "+57 300 000 0000"
}
```

**Errores:**
- `400` — Datos de entrada inválidos (correo mal formado, contraseña muy corta)
- `401` — Credenciales inválidas

---

## 2. Alumnos — `POST /alumnos`

Registra un nuevo alumno en el sistema. Requiere autenticación.

**BODY:**
```json
{
  "nombre": "Juan",
  "apellido": "Pérez",
  "fecha_nacimiento": "2010-05-15",
  "id_grupo": 1,
  "email": "juan.perez@estudiante.edu",
  "telefono": "+57 300 000 0000",
  "direccion": "Calle 123 #45-67",
  "tutor": "María García",
  "tutor_telefono": "+57 300 111 2222",
  "promedio": 8.5,
  "estado": "Activo",
  "id_padre": 3
}
```

**RESPONSE:** `201 Created`
```json
{
  "id": 12,
  "nombre": "Juan Pérez",
  "email": "juan.perez@estudiante.edu",
  "grupo": "3A",
  "edad": 15,
  "telefono": "+57 300 000 0000",
  "direccion": "Calle 123 #45-67",
  "tutor": "María García",
  "tutorTelefono": "+57 300 111 2222",
  "tutorId": 3,
  "promedio": 8.5,
  "estado": "Activo"
}
```

**Errores:**
- `400` — Campos requeridos faltantes o formato inválido
- `401` — Token no enviado o inválido

---

## 3. Alumnos — `PATCH /alumnos/:id`

Actualiza los datos de un alumno existente. Todos los campos son opcionales. Si se envía `id_padre`, la relación con el acudiente se actualiza en la tabla `relacion_padres`.

**URL:** `PATCH /alumnos/12`

**BODY:**
```json
{
  "email": "juan.nuevo@estudiante.edu",
  "grupo": "3B",
  "tutor": "Ana López",
  "id_padre": 5
}
```

**RESPONSE:** `200 OK`
```json
{
  "id": 12,
  "nombre": "Juan Pérez",
  "email": "juan.nuevo@estudiante.edu",
  "grupo": "3B",
  "edad": 15,
  "telefono": "+57 300 000 0000",
  "direccion": "Calle 123 #45-67",
  "tutor": "Ana López",
  "tutorTelefono": "+57 300 111 2222",
  "tutorId": 5,
  "promedio": 8.5,
  "estado": "Activo"
}
```

**Errores:**
- `400` — Formato de campo inválido
- `401` — Token no enviado o inválido
- `404` — Alumno no encontrado

---

## 4. Calificaciones — `POST /calificaciones`

Registra una nueva calificación para un alumno en una materia.

**BODY:**
```json
{
  "id_alumno": 12,
  "id_materia": 3,
  "valor": 8.5,
  "fecha_registro": "2026-04-08"
}
```

**RESPONSE:** `201 Created`
```json
{
  "id": 45,
  "id_alumno": 12,
  "id_materia": 3,
  "valor": 8.5,
  "fecha_registro": "2026-04-08"
}
```

**Errores:**
- `400` — `valor` fuera del rango (0-10), fecha con formato incorrecto o campos faltantes
- `401` — Token no enviado o inválido

---

## 5. Calificaciones — `GET /calificaciones/stats/promedios`

Devuelve el promedio de calificaciones agrupado por grupo académico. Útil para el dashboard administrativo.

**BODY:** No aplica

**RESPONSE:** `200 OK`
```json
[
  {
    "grupo": "1A",
    "promedio": 8.3
  },
  {
    "grupo": "2B",
    "promedio": 7.9
  },
  {
    "grupo": "3A",
    "promedio": 9.1
  }
]
```

**Errores:**
- `401` — Token no enviado o inválido

---

## 6. Usuarios — `POST /usuarios`

Crea un nuevo usuario del sistema (administrativo, docente o padre/acudiente).

**BODY:**
```json
{
  "nombre": "Carlos",
  "apellido": "García",
  "correo": "carlos@escuela.edu",
  "password": "Admin123!",
  "tipo_usuario": "docente",
  "telefono": "+57 300 000 0000"
}
```

**RESPONSE:** `201 Created`
```json
{
  "id": 8,
  "nombre": "Carlos",
  "apellido": "García",
  "correo": "carlos@escuela.edu",
  "tipo_usuario": "docente",
  "telefono": "+57 300 000 0000",
  "isActive": true
}
```

**Errores:**
- `400` — Campos inválidos o contraseña muy corta
- `401` — Token no enviado o inválido
- `409` — El correo ya está registrado

---

## 7. Horarios — `POST /horarios/bloques`

Registra un bloque de horario asignando un grupo, materia, docente y aula a una franja horaria existente.

**BODY:**
```json
{
  "id_grupo": 1,
  "id_horario": 3,
  "materia": "Matemáticas",
  "docente": "Carlos García",
  "aula": "Aula 101"
}
```

**RESPONSE:** `201 Created`
```json
{
  "id": 22,
  "grupo": "3A",
  "materia": "Matemáticas",
  "docente": "Carlos García",
  "dia": "Lunes",
  "horaInicio": "07:00",
  "horaFin": "09:00",
  "aula": "Aula 101",
  "estado": "Activo"
}
```

**Errores:**
- `400` — Campos faltantes o estado inválido
- `401` — Token no enviado o inválido

---

## 8. Usuarios — `GET /usuarios?tipo=padre`

Lista los usuarios del sistema. El parámetro opcional `tipo` filtra por rol.

**URL:** `GET /usuarios?tipo=padre`

**BODY:** No aplica

**RESPONSE:** `200 OK`
```json
[
  {
    "id": 3,
    "nombre": "Juan",
    "apellido": "Rodríguez",
    "correo": "juan.rodriguez@escuela.edu",
    "tipo_usuario": "padre",
    "telefono": "+57 300 200 0000",
    "isActive": true
  }
]
```

**Errores:**
- `401` — Token no enviado o inválido
