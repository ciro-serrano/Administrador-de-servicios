import "dotenv/config";

//creamos un array con variables que son obligatorias
const REQUIRED_ENV_VARS = ["PORT", "NODE_ENV"];

//filtramos para quedarnos solo con las que no estan o estan vacias
const faltantes = REQUIRED_ENV_VARS.filter((key) => {
  //accedemos a la propiedad del env de forma dinamica con corchetes
  const value = process.env[key];
  return value == undefined || value.trim() === "";
});

if (faltantes.length > 0) {
  console.error(
    `ERROR de configuracion: faltan variables de entornos obligatorias\n
    Variables faltantes : ${faltantes.join(", ")}\n
    Agregue esas variable faltante en un archivo .env `,
  );
  //cortamos la ejecucion del programa
  process.exit(1);
}

//exportamos la configuracion de la forma vista en clase
const envConfig = {
  port: Number(process.env.PORT),
  nodeEnv: process.env.NODE_ENV,
};

export default envConfig;
