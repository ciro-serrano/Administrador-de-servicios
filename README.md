# Administrador de servicios

Este programa esta basado en un sistema de turnos, que gestiona de forma organizada los servicios disponibles, precio, duracion, etc. Lo que busca resolver este sistema es la optimizacion en la gestion de reservas de servicios, para evitar conflictos de una mala organizacion.
Yo me base en el tipo de negocio de peluqueria ya que se suele manejar reservas con bastante frecuencia y una mala gestion puede causar inconsistencias entre el personal y el cliente.

## Instalacion

```bash
git clone https://github.com/ciro-serrano/Administrador-de-servicios.git
cd administrador-de-servicios-CLASE-1
npm install
cp .env.example .env
```

## Ejecucion

Cuando se ejecute el comando no se levantara un servidor ni nada por el estilo, solo se mostrara una demo de los 5 metodos CRUD y el resultado por consola para verificar que estan desarrollados correctamente.

```bash
npm start
```

| Nombre de variable | Para que sirve                                                                                         | Ejemplo     |
| ------------------ | ------------------------------------------------------------------------------------------------------ | ----------- |
| PORT               | Le indica a Node.js en que puerto ejectutar el programa                                                | 4050        |
| NODE_ENV           | Indica en que etapa se encuentra el programa, ya sea development (desarrollo) o production(produccion) | development |

**Importante**
Si falta alguna de las dos variables de entorno al arrancar el programa, el mismo se corta automaticamente, no hay un prompt esperando que completes algo, solo un mensaje de error y el corte.

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

- id: es el identificador de cada servicio.
- name: indica el nombre del serivico.
- description: una breve explicacion sobre lo que se llevara a cabo.
- duration: duracion del tiempo estimado del servicio.
- price: precio del servicio.
- category: categoria del servicio.
- available: indica si el servicio se encuentra disponible o no.

### `getServices()`

Devuelve un array con todos los servicios registrados.

```js
const servicios = await manager.getServices(); // [ { id: 1, ... }, { id: 2, ... } ]
```

### `getServiceById(id)`

Devuelve un objeto mostrando unicamente el servicio indicado por parametro.
Si no encuentra el id devuelve un null.

```js
const servicio = await manager.getServiceById(1); // { id: 1, ... }
const noExiste = await manager.getServiceById(999); // null
```

### `addService()`

Devuelve un objeto con los campos creados recientemente, y a su ves agrega el nuevo objeto a services.
Si falta algun campo , lo detecta automaticamente y tira un error para no agregar ese objeto nuevo con credenciales invalidas.

```js
const agregarServicio = await manager.addService({
  name: "perfilado de cejas",
  description:
    "con el uso de una navaja depilar cuidadosamente la zona de cejas",
  duration: 10,
  price: 10000,
  category: "Barberia",
  available: true,
}); //{devuelve el mismo objeto creado y se le agrega un id automaticamente , id : 4}

try {
  const fallaAgregar = await manager.addService({
    name: "solo le paso este campo",
  });
} catch (e) {
  console.log(e.message);
} // Error capturado:  Error: Falta agregar campos Faltantes: description, duration, price, category, available
```

### `updateService(id, actualizacion)`

Devuelve el objeto actualizado y lo actualiza en el array de objetos de servicios.
Si no encuentra el objeto mediante su id, devuelve null porque no se encontron un objeto para mdodificar.
Nunca se pisa el id, no se puede pasar un id como campo para actualizar ya que se genera automaticamente.

```js
const updateService = await manager.updateService(1, { available: false }); // { id: 1, available: false, ... }
const noPisaId = await manager.updateService(2, { id: 999, price: 2000 }); // {id: 2 , price: 2000, ...}

const noExisteId = await manager.updateService(7, { name: "alisado" }); //null
```

### `deleteService(id)`

Devuelve el objeto eliminado , y lo elimina del array de objeto servicios mediante su id.
Si no encuentra el id devuelve null.

```js
const delServicio = await manager.deleteService(1); // { id: 1, ... }
const noExisteServicio = await manager.deleteService(7); // null
```
