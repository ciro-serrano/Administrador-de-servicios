# Administrador de servicios

API REST construida con **Node.js y Express** para gestionar los servicios de un sistema de turnos y reservas: nombre, descripción, duración, precio, categoría y disponibilidad.

El objetivo es optimizar la gestión de reservas y evitar los conflictos que genera una mala organización. Me basé en el rubro de peluquería, donde las reservas son muy frecuentes y una mala gestión puede causar inconsistencias entre el personal y el cliente.

Es una API que se consume por HTTP (en este caso yo trabaje con Postman), no un programa que se ejecuta en consola.

---

## Tecnologías

- Node.js (ESM, `"type": "module"`)
- Express
- dotenv

---

## Estructura del proyecto

```
src/
  config/
    env.config.js          # Carga y valida las variables de entorno
  managers/
    ServiceManager.js      # Lógica de los servicios (lectura, alta, edición, baja y filtros)
  routes/
    services.router.js     # Endpoints del recurso services (express.Router)
  data/
    services.json          # Persistencia de los servicios
  app.js                   # Configura la app de Express (middlewares y rutas)
  server.js                # Pone la app a escuchar en el puerto
package.json
.env.example
.gitignore
README.md
```

La lógica de los servicios vive en `ServiceManager`. El router solo recibe la petición, llama al manager y responde con el código de estado correspondiente.

---

## Instalación

```bash
git clone https://github.com/ciro-serrano/Administrador-de-servicios
cd Administrador-de-servicios
npm install
cp .env.example .env
```

---

## Variables de entorno

| Nombre de variable | Para qué sirve                                                                                       | Ejemplo       |
| ------------------ | ---------------------------------------------------------------------------------------------------- | ------------- |
| `PORT`             | Indica en qué puerto escucha el servidor                                                             | `8080`        |
| `NODE_ENV`         | Indica en qué etapa se encuentra el programa: `development` (desarrollo) o `production` (producción) | `development` |

**Importante:** si falta alguna de las dos variables al arrancar, el programa se corta automáticamente y muestra un mensaje de error indicando cuál falta. No queda ningún prompt esperando que la completes.

El archivo `.env` no se sube al repositorio. Usá `.env.example` como plantilla.

---

## Ejecución

```bash
npm start
```

Se levanta un servidor que queda escuchando en el puerto indicado en el `.env`. Con `PORT=8080`, la API queda disponible en:

```
http://localhost:8080
```

La base de todos los endpoints es `/api/services`.

---

## El recurso `services`

```json
{
  "id": 1,
  "name": "Corte de cabello",
  "description": "Corte clásico con lavado y peinado incluido.",
  "duration": 30,
  "price": 8000,
  "category": "Peluqueria",
  "available": true
}
```

| Campo         | Tipo    | Descripción                                            |
| ------------- | ------- | ------------------------------------------------------ |
| `id`          | number  | Identificador del servicio. Se genera automáticamente. |
| `name`        | string  | Nombre del servicio.                                   |
| `description` | string  | Breve explicación de lo que incluye el servicio.       |
| `duration`    | number  | Duración estimada del servicio.                        |
| `price`       | number  | Precio del servicio.                                   |
| `category`    | string  | Categoría a la que pertenece.                          |
| `available`   | boolean | Indica si el servicio se encuentra disponible o no.    |

El `id` **no se envía en el body** del `POST` y **no se puede modificar** con el `PUT`: si se envía, se ignora.

---

## Endpoints

| Método   | Ruta                 | Descripción                                                                  | Códigos de estado |
| -------- | -------------------- | ---------------------------------------------------------------------------- | ----------------- |
| `GET`    | `/api/services`      | Devuelve todos los servicios. Acepta los filtros `?category` y `?available`. | `200`, `400`      |
| `GET`    | `/api/services/:sid` | Devuelve el servicio con ese id.                                             | `200`, `404`      |
| `POST`   | `/api/services`      | Crea un servicio con los datos del body. El `id` se genera automáticamente.  | `201`, `400`      |
| `PUT`    | `/api/services/:sid` | Actualiza el servicio. El `id` no se puede modificar.                        | `200`, `404`      |
| `DELETE` | `/api/services/:sid` | Elimina el servicio con ese id.                                              | `200`, `404`      |

Todas las respuestas son JSON. Las exitosas tienen la forma `{ "message": "...", "payload": ... }`. Los errores devuelven `{ "message": "..." }`.

### `GET /api/services`

Devuelve la lista completa de servicios.

```
GET /api/services
```

```json
{
  "message": "Servicios obtenidos con exito",
  "payload": [
    { "id": 1, "name": "Corte de cabello", "...": "..." },
    { "id": 2, "name": "Coloracion completa", "...": "..." }
  ]
}
```

**Filtros por query params** (ambos son opcionales y se pueden combinar):

| Parámetro   | Valores          | Comportamiento                                                    |
| ----------- | ---------------- | ----------------------------------------------------------------- |
| `category`  | texto            | Devuelve los servicios de esa categoría. No distingue mayúsculas. |
| `available` | `true` o `false` | Devuelve solo los servicios disponibles o no disponibles.         |

```
GET /api/services?category=peluqueria
GET /api/services?available=true
GET /api/services?category=peluqueria&available=true
```

- Si ningún servicio coincide con el filtro, responde `200` con un array vacío (`"payload": []`): una búsqueda sin resultados no es un error.
- Si `available` tiene un valor distinto de `true` o `false`, responde `400`:

```
GET /api/services?available=hola
```

```json
{
  "message": "ERROR: available solamente debe ser true o false"
}
```

### `GET /api/services/:sid`

Devuelve un servicio por su id.

```
GET /api/services/1
```

`200`:

```json
{
  "message": "success",
  "payload": {
    "id": 1,
    "name": "Corte de cabello",
    "description": "Corte clásico con lavado y peinado incluido.",
    "duration": 30,
    "price": 8000,
    "category": "Peluqueria",
    "available": true
  }
}
```

`404` (el id no existe):

```json
{
  "message": "no se encontro el servicio seleccionado"
}
```

### `POST /api/services`

Crea un servicio. Hay que enviar en el body los seis campos: `name`, `description`, `duration`, `price`, `category` y `available`. El `id` **no se envía**: se genera automáticamente.

```
POST /api/services
Content-Type: application/json
```

```json
{
  "name": "Perfilado de cejas",
  "description": "Perfilado cuidadoso de la zona de cejas con navaja.",
  "duration": 10,
  "price": 10000,
  "category": "Barberia",
  "available": true
}
```

`201`:

```json
{
  "message": "servicio creado con exito",
  "payload": {
    "name": "Perfilado de cejas",
    "description": "Perfilado cuidadoso de la zona de cejas con navaja.",
    "duration": 10,
    "price": 10000,
    "category": "Barberia",
    "available": true,
    "id": 4
  }
}
```

`400` si faltan campos (el mensaje indica cuáles) o si el body no es un objeto válido:

```json
{
  "message": "Faltan agregar campos. Faltantes: description, duration, price, category, available"
}
```

> Si el body trae un `id`, se ignora y se asigna el siguiente correlativo.

### `PUT /api/services/:sid`

Actualiza los campos enviados en el body y conserva el resto. El `id` no se puede modificar.

```
PUT /api/services/1
Content-Type: application/json
```

```json
{
  "price": 9500,
  "available": false
}
```

`200`:

```json
{
  "message": "servicio actualizado con exito",
  "payload": {
    "id": 1,
    "name": "Corte de cabello",
    "description": "Corte clásico con lavado y peinado incluido.",
    "duration": 30,
    "price": 9500,
    "category": "Peluqueria",
    "available": false
  }
}
```

`404` (el id no existe):

```json
{
  "message": "ningun servicio coincide con el id seleccionado"
}
```

> Si el body incluye un `id` distinto (por ejemplo `{ "id": 999, "price": 5000 }`), el servicio conserva su `id` original.

### `DELETE /api/services/:sid`

Elimina un servicio y devuelve el servicio eliminado.

```
DELETE /api/services/4
```

`200`:

```json
{
  "message": "servicio eliminado con exito",
  "payload": {
    "id": 4,
    "name": "Perfilado de cejas",
    "...": "..."
  }
}
```

`404` (el id no existe, por ejemplo si se vuelve a borrar el mismo):

```json
{
  "message": "no se encontro ningun elemento para eliminar"
}
```

---

## Códigos de estado utilizados

| Código | Significado                                                                     |
| ------ | ------------------------------------------------------------------------------- |
| `200`  | La operación se realizó correctamente.                                          |
| `201`  | El servicio se creó correctamente.                                              |
| `400`  | Petición inválida: faltan campos, el body no es válido o un filtro es inválido. |
| `404`  | No existe un servicio con el id indicado.                                       |

---

## Autor

Alan Ciro Serrano — Salta, Argentina.
