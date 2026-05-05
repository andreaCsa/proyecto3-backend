# Proyecto 3 - Backend API

API REST desarrollada con `Node.js`, `Express` y `MongoDB Atlas` para el proyecto final del módulo de Backend.

El proyecto incluye autenticación con JWT, roles de usuario, relación entre modelos, subida de imágenes con Cloudinary y una seed para una de las colecciones.

## Tecnologías usadas

- Node.js
- Express
- MongoDB Atlas
- Mongoose
- JWT
- bcrypt
- Cloudinary
- Multer
- dotenv
- CORS

## Modelos del proyecto

### User

- `username`
- `email`
- `password`
- `role`
- `image`
- `imagePublicId`
- `posts` array relacionado con la colección `Post`

### Post

- `title`
- `content`
- `image`
- `author` referencia a `User`

### Car

- `brand`
- `model`
- `type`
- `image`
- `link`

## Requisitos cubiertos

- Mínimo de 2 modelos
- Relación entre colecciones
- CRUD completo
- Middleware de autenticación
- Roles `user` y `admin`
- Registro de usuarios siempre con rol `user`
- El primer admin se cambia manualmente desde MongoDB Atlas
- Un admin puede cambiar el rol de otros usuarios
- Un usuario normal no puede cambiar roles
- Un usuario puede eliminar su propia cuenta
- Un admin puede eliminar cuentas de otros usuarios
- Subida de imagen con Cloudinary
- Eliminación de imagen de Cloudinary al borrar usuario
- Seed para una colección
- Prevención de duplicados en el array `posts` con `$addToSet`

## Instalación

```bash
npm install
```

## Variables de entorno

Crea un archivo `.env` con estas variables:

```env
PORT=3000
MONGO_URI=tu_uri_de_mongodb_atlas
JWT_SECRET=tu_clave_secreta
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
```

## Ejecutar el proyecto

```bash
npm run dev
```

Servidor disponible en `http://localhost:3000`

## Seed

La seed incluida carga datos de ejemplo en la colección `cars`.

```bash
npm run seed
```

## Endpoints principales

### Users

- `POST /users/register`
- `POST /users/login`
- `GET /users` solo admin
- `PUT /users/:id`
- `PATCH /users/image/me`
- `DELETE /users/:id`
- `PUT /users/role/:id` solo admin

### Posts

- `GET /posts`
- `GET /posts/:id`
- `POST /posts`
- `PUT /posts/:id`
- `DELETE /posts/:id`

### Cars

- `GET /cars`
- `GET /cars/:id`
- `POST /cars`
- `PUT /cars/:id`
- `DELETE /cars/:id`

## Notas importantes

- Todos los usuarios se registran con rol `user`.
- Para crear el primer admin hay que cambiar manualmente el campo `role` en MongoDB Atlas.
- El array `posts` del usuario no duplica ids porque se usa `$addToSet`.
- Cuando se elimina un usuario también se elimina su imagen de Cloudinary.
