# Frontend del catálogo

Este frontend consume la API Spring Boot disponible en:

`http://localhost:8080/api/productos`

## 1. Ejecutar el backend

Desde la raíz del proyecto en Windows:

```powershell
.\mvnw.cmd spring-boot:run
```

La API debe responder en:

`http://localhost:8080/api/productos`

## 2. Ejecutar el frontend

No abras `index.html` directamente con doble clic. Sírvelo mediante HTTP.

### Opción A - VS Code + Live Server

Abre la carpeta `frontend`, pulsa clic derecho en `index.html` y selecciona `Open with Live Server`.

El proyecto acepta el origen `http://127.0.0.1:5500` y `http://localhost:5500`.

### Opción B - Python

Desde la carpeta `frontend`:

```powershell
python -m http.server 5500
```

Luego abre:

`http://localhost:5500`

## CORS

El frontend y el backend se ejecutan en orígenes distintos porque usan puertos diferentes. El navegador aplica la política Same-Origin y puede bloquear la solicitud si el backend no autoriza explícitamente el origen del frontend.

Para desarrollo se agregó `CorsConfig.java`, que permite solicitudes GET a `/api/**` desde los puertos habituales del frontend.

En producción conviene restringir `allowedOrigins` al dominio real del frontend.
