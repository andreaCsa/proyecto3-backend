## Proyecto 3 - Backend

Este es mi proyecto del módulo de Backend.

He creado un servidor con Express conectado a MongoDB Atlas.

## Lo que incluye mi proyecto

- Dos modelos como mínimo
- Relación entre modelos
- CRUD completo
- Sistema de roles (user y admin)
- Middleware de autenticación
- Subida de imágenes con Cloudinary
- Eliminación de imagen al borrar usuario
- Seed de datos

## Para ejecutarlo

npm install  
npm run dev

Proyecto realizado, Andrea
#  Proyecto 3 – Backend API

Backend desarrollado con Node.js y Express que implementa autenticación con JWT, roles de usuario, relaciones entre modelos, subida de imágenes con Cloudinary y seed de datos.

---

## 🛠 Tecnologías utilizadas

- Node.js
- Express
- MongoDB
- Mongoose
- JWT (jsonwebtoken)
- bcrypt
- Cloudinary
- Multer
- dotenv
- CORS

---

## Modelos
## User
- username
- email
- password (encriptado con bcrypt)
- role ("user" / "admin")
- image
- imagePublicId
- posts (array relacionado con Post)

### Post
- title
- content
- author (referencia a User)

###  Car
- Modelo independiente con CRUD completo

---

## Autenticación

- Registro de usuario
- Login con generación de JWT
- Middleware de autenticación
- Protección de rutas
- Control de roles (admin / user)

### Seguridad implementada

- Password encriptada
- Token JWT con expiración
- Solo el usuario puede eliminar su propia cuenta
- Solo el admin puede cambiar roles
- Rutas protegidas mediante middleware
- No se permiten duplicados en el array de posts (uso de `$addToSet`)

---

## CRUD Implementado

### Users
- Register
- Login
- Get users (protegido)
- Delete user (protegido con validación de identidad)
- Update role (solo admin)

### Posts
- Create (protegido)
- Get all
- Get by id
- Update
- Delete (solo autor o admin)

### Cars
- Create (protegido)
- Get all
- Get by id
- Update (protegido)
- Delete (protegido)

---

##  Seed

Para ejecutar datos de prueba:

```
npm run seed
```

---

## ▶️ Cómo ejecutar el proyecto

1. Instalar dependencias:

```
npm install
```

2. Configurar archivo `.env`:

```
MONGO_URI=tu_uri
JWT_SECRET=tu_secret
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

3. Ejecutar servidor:

```
npm run dev
```

Servidor disponible en:

```
http://localhost:3000
```

---

## Estado del proyecto

✔ Autenticación funcional  
✔ Roles implementados  
✔ Middleware funcionando  
✔ CRUD completo  
✔ Relaciones entre modelos  
✔ Protección real de datos  
✔ Seed funcional

---

Proyecto realizado por Andrea Simon