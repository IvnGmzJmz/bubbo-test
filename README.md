# Bubbo app backend 

## Dependencias

Se ha utilizado para conectarse con Firebase firebase-admin, tal y como se especificaba en el enunciado.

Para las dependencias no mencionadas anteriormente sólo tenemos las relacionadas con las utilizadas para los tests.
```
npm install --save-dev mocha chai sinon chai-as-promised
```

## Test

Esta aplicación cuenta con test unitarios para la capa de servicios. Para ejecutarlos:

```
npx mocha tests --exit
```

## Desarrollos futuros

- Más tests (sobre todo en las otras capas de la aplicación) y controles de seguridad.
- La implementación de funcionalidades extra como usuarios etc...
