# Sistema de turnos y reservas

API REST construida con **Node.js, Express y FileSystem** para gestionar los servicios y las reservas de un sistema de turnos: qué servicios se ofrecen (nombre, descripción, duración, precio, categoría y disponibilidad) y qué reservas hicieron los clientes sobre esos servicios.

El objetivo es optimizar la gestión de reservas y evitar los conflictos que genera una mala organización. Me basé en el rubro de peluquería, donde las reservas son muy frecuentes y una mala gestión puede causar inconsistencias entre el personal y el cliente.

Es una API que se consume por HTTP (en este caso yo trabajé con Postman), no un programa que se ejecuta en consola.

La información se guarda en archivos JSON, así que **los datos no se pierden al reiniciar el servidor**.

---

## Tecnologías

- Node.js (ESM, `"type": "module"`)
- Express
- dotenv
- FileSystem (`node:fs/promises`) para la persistencia en archivos JSON

---

## Estructura del proyecto

```
src/
  config/
    env.config.js              # Carga y valida las variables de entorno
  routes/
    services.router.js         # Endpoints de services (express.Router)
    bookings.router.js         # Endpoints de bookings (express.Router)
  controllers/
    services.controller.js     # Lee req, llama al service y responde con res
    bookings.controller.js
  services/
    services.service.js        # Reglas de negocio de los servicios
    bookings.service.js        # Reglas de negocio de las reservas
  repositories/
    services.repository.js     # Métodos de acceso a datos de servicios
    bookings.repository.js
  dao/
    services.dao.js            # Lee y escribe services.json
    bookings.dao.js            # Lee y escribe bookings.json
  data/
    services.json              # Persistencia de los servicios
    bookings.json              # Persistencia de las reservas
  app.js                       # Configura la app de Express (middlewares y rutas)
  server.js                    # Pone la app a escuchar en el puerto
package.json
.env.example
.gitignore
README.md
```

---

## Arquitectura en capas

La aplicación está dividida en capas. Cada una tiene una única responsabilidad y solo se comunica con la que tiene inmediatamente debajo:

```
Petición HTTP
   ↓
Router → Controller → Service → Repository → DAO → archivo JSON
```

| Capa           | Qué hace                                                                                             | Qué NO hace                                      |
| -------------- | ---------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| **Router**     | Define los endpoints y los asocia a un controller.                                                   | Ninguna lógica.                                  |
| **Controller** | Lee `req`, llama al service y responde con `res` y el código de estado.                              | No accede a archivos ni tiene reglas de negocio. |
| **Service**    | Aplica las reglas de negocio y las validaciones. Decide cuándo hay un error y con qué código.        | No usa `req`/`res` ni lee archivos.              |
| **Repository** | Ofrece los métodos de acceso a datos (`getAll`, `getById`, `create`, `update`, `delete`) al service. | No tiene reglas de negocio.                      |
| **DAO**        | Lee y escribe directamente el archivo JSON.                                                          | No tiene lógica de negocio.                      |

### Qué hace cada service

**`services.service.js`**

- `getServices`: filtra por `category` y `available`, y valida que `available` sea `true` o `false`.
- `getServiceById`, `updateService`, `deleteService`: lanzan un error 404 si el id no existe. En `updateService` se ignora el `id` que venga en el body, porque no se puede modificar.
- `createService`: valida que el body sea un objeto y que estén los seis campos obligatorios.

**`bookings.service.js`**

- `createBooking`: valida el body y los campos obligatorios (`clientName`, `clientEmail`, `date`, `time`). Toda reserva nace con `status: "pending"` (salvo que se envíe otro) y con la lista de `services` vacía.
- `getBookingById`: lanza un 404 si la reserva no existe.
- `addServiceToBooking`: valida primero la reserva y después el servicio. Si el servicio ya estaba en la reserva, **incrementa su `quantity`**; si no, lo agrega con `quantity: 1`. Esa regla está en el service y no en el DAO.

### Cómo viaja un error

Los services lanzan errores con la propiedad `status` (por ejemplo `400` o `404`). El controller los atrapa con `try/catch` y responde con `error.status || 500`. Así, el service decide **qué** pasó y el controller decide **cómo** responderlo.

### Ejemplo de recorrido

`POST /api/bookings/1/services/2`:

1. El **router** deriva la petición a `addServiceToBooking` del controller.
2. El **controller** lee `bid` y `sid` de `req.params` y llama al service.
3. El **service** busca la reserva y el servicio (404 si no existen) y actualiza `quantity` o agrega la entrada.
4. El **repository** pide al DAO guardar el cambio.
5. El **DAO** escribe `bookings.json`.
6. El controller responde `200` con la reserva actualizada.

### Por qué esta estructura

- Cada archivo tiene una sola responsabilidad, así que es más fácil ubicar un error.
- El service no sabe dónde se guardan los datos. Cuando la persistencia pase de JSON a una base de datos, solo hay que reemplazar el DAO (y, si hace falta, el repository), sin tocar las reglas de negocio ni los controllers.
- Los endpoints, los mensajes y los códigos de estado son exactamente los mismos que antes de la refactorización.

> El `id` de cada recurso lo genera el DAO (`max(id) + 1`), porque es un detalle de cómo se guardan los datos. Una base de datos como MongoDB genera sus propios ids, y así el service no se ve afectado por ese cambio.

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

Las bases de los endpoints son `/api/services` y `/api/bookings`.

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

## El recurso `bookings`

```json
{
  "id": 1,
  "clientName": "Ana Pérez",
  "clientEmail": "ana@mail.com",
  "date": "2026-11-10",
  "time": "15:30",
  "status": "pending",
  "services": [
    { "service": 2, "quantity": 2 },
    { "service": 1, "quantity": 1 }
  ]
}
```

| Campo         | Tipo   | Descripción                                                                                               |
| ------------- | ------ | --------------------------------------------------------------------------------------------------------- |
| `id`          | number | Identificador de la reserva. Se genera automáticamente.                                                   |
| `clientName`  | string | Nombre del cliente. **Obligatorio.**                                                                      |
| `clientEmail` | string | Email del cliente. **Obligatorio.**                                                                       |
| `date`        | string | Fecha de la reserva. **Obligatorio.**                                                                     |
| `time`        | string | Hora de la reserva. **Obligatorio.**                                                                      |
| `status`      | string | Estado de la reserva. Si no se envía, se guarda como `"pending"`.                                         |
| `services`    | array  | Servicios de la reserva. Siempre arranca vacío (`[]`) y se completa con el endpoint de agregar servicios. |

### Cómo se guardan los servicios dentro de una reserva

Cada elemento de `services` es `{ "service": idDelServicio, "quantity": cantidad }`.

- **Solo se guarda el id del servicio**, no una copia. El nombre y el precio viven una única vez en `services.json`, así la reserva siempre refleja el dato actual del servicio.
- **Si se agrega dos veces el mismo servicio**, no se duplica la entrada: se incrementa su `quantity`.

El `id` y el `services` **no se envían en el body** del `POST`: si se envían, se ignoran.

---

## Endpoints de `services`

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

## Endpoints de `bookings`

| Método | Ruta                               | Descripción                                                                            | Códigos de estado |
| ------ | ---------------------------------- | -------------------------------------------------------------------------------------- | ----------------- |
| `POST` | `/api/bookings`                    | Crea una reserva con los datos del body. El `id` se genera y `services` arranca vacío. | `201`, `400`      |
| `GET`  | `/api/bookings/:bid`               | Devuelve la reserva con ese id.                                                        | `200`, `404`      |
| `POST` | `/api/bookings/:bid/services/:sid` | Agrega un servicio a una reserva existente. Si ya estaba, incrementa su `quantity`.    | `200`, `404`      |

### `POST /api/bookings`

Crea una reserva. Hay que enviar en el body `clientName`, `clientEmail`, `date` y `time`. El `status` es opcional (por defecto `"pending"`). La reserva se crea con `services` vacío.

```
POST /api/bookings
Content-Type: application/json
```

```json
{
  "clientName": "Ana Pérez",
  "clientEmail": "ana@mail.com",
  "date": "2026-11-10",
  "time": "15:30"
}
```

`201`:

```json
{
  "message": "reserva creada con exito",
  "payload": {
    "clientName": "Ana Pérez",
    "clientEmail": "ana@mail.com",
    "date": "2026-11-10",
    "time": "15:30",
    "services": [],
    "status": "pending",
    "id": 1
  }
}
```

`400` si faltan campos obligatorios:

```json
{
  "message": "Faltan campos obligatorios"
}
```

`400` si el body no es un objeto válido (por ejemplo, vacío):

```json
{
  "message": "El body debe ser un objeto con los datos de la reserva"
}
```

> Si el body trae un `id` o un `services`, se ignoran: el `id` se asigna automáticamente y `services` siempre arranca como `[]`.

### `GET /api/bookings/:bid`

Devuelve una reserva por su id.

```
GET /api/bookings/1
```

`200`:

```json
{
  "message": "success",
  "payload": {
    "id": 1,
    "clientName": "Ana Pérez",
    "clientEmail": "ana@mail.com",
    "date": "2026-11-10",
    "time": "15:30",
    "status": "pending",
    "services": []
  }
}
```

`404` (la reserva no existe):

```json
{
  "message": "reserva no encontrada"
}
```

### `POST /api/bookings/:bid/services/:sid`

Agrega el servicio `:sid` a la reserva `:bid`. No lleva body. Antes de agregar, se valida que **existan los dos**:

- Si el servicio **no estaba** en la reserva, se agrega como `{ "service": id, "quantity": 1 }`.
- Si el servicio **ya estaba**, no se duplica: se suma 1 a su `quantity`.

```
POST /api/bookings/1/services/2
```

`200` (primera vez que se agrega el servicio 2):

```json
{
  "message": "Servicio agregado a la reserva con exito",
  "payload": {
    "id": 1,
    "clientName": "Ana Pérez",
    "clientEmail": "ana@mail.com",
    "date": "2026-11-10",
    "time": "15:30",
    "status": "pending",
    "services": [{ "service": 2, "quantity": 1 }]
  }
}
```

Si se repite el mismo pedido, la respuesta es `200` y la entrada queda con `"quantity": 2`, sin crear una segunda entrada.

`404` si el servicio no existe:

```json
{
  "message": "Servicio no encontrado"
}
```

`404` si la reserva no existe:

```json
{
  "message": "Reserva no encontrada"
}
```

---

## Ejemplo de flujo completo

1. Crear una reserva: `POST /api/bookings` → queda con `id: 1` y `services: []`.
2. Agregar el servicio 2: `POST /api/bookings/1/services/2` → `services: [{ service: 2, quantity: 1 }]`.
3. Agregar otra vez el servicio 2: `POST /api/bookings/1/services/2` → `services: [{ service: 2, quantity: 2 }]`.
4. Agregar el servicio 1: `POST /api/bookings/1/services/1` → `services: [{ service: 2, quantity: 2 }, { service: 1, quantity: 1 }]`.
5. Consultar la reserva: `GET /api/bookings/1` → devuelve la reserva con los dos servicios.

---

## Códigos de estado utilizados

| Código | Significado                                                                                    |
| ------ | ---------------------------------------------------------------------------------------------- |
| `200`  | La operación se realizó correctamente.                                                         |
| `201`  | El recurso (servicio o reserva) se creó correctamente.                                         |
| `400`  | Petición inválida: faltan campos, el body no es válido o un filtro es inválido.                |
| `404`  | No existe el servicio o la reserva con el id indicado.                                         |
| `500`  | Error inesperado del servidor (por ejemplo, un problema al leer o escribir los archivos JSON). |

## Autor

Alan Ciro Serrano — Salta, Argentina.
