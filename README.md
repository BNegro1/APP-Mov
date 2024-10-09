# _Proyecto: Discoverify_

### Plataforma para descubrir, reseñar y calificar álbumes de música.
### *Aplicación desarrollada para asignatura Prog. App. Móviles - 2024-02*
---

## _Índice_

1. [Descripción](#descripción)
2. [Tecnologías Utilizadas](#tecnologías-utilizadas)
3. [Instalación](#instalación)
4. [Funcionalidades Principales](#funcionalidades-principales)
5. [Plugins Nativos Utilizados](#plugins-nativos-utilizados)
6. [Contribuciones](#contribuciones)
7. [Licencia](#licencia)
8. [Notas Adicionales](#notas-adicionales)

---

## _Descripción_

**Discoverify** es una aplicación construida con **Angular** que permite a los usuarios explorar una vasta colección de álbumes musicales a través de un *infinite scroll*. Además, los usuarios pueden contribuir subiendo nuevos álbumes, reseñar sus favoritos y calificarlos.

---

## _Tecnologías Utilizadas_

- **Angular**: Framework para desarrollar aplicaciones web dinámicas.
- **Capacitor**: Integra funcionalidades nativas para mejorar la experiencia móvil.
- **TypeScript**, **HTML**, **SCSS**, **JavaScript**: Tecnologías empleadas para el desarrollo frontend.

---

## _Instalación_

Para configurar y ejecutar:

1. **Clonar el repositorio**:
   ```bash
   git clone [https://github.com/BN/Discoverify.git](https://github.com/BNegro1/APP-Mov.git)
   ```

2. **Cambiar a la rama de desarrollo**:
   ```bash
   git checkout Dev-Discoverify
   ```

3. **Instalar dependencias**:
   ```bash
   cd discoverify/src
   npm install
   ```

4. **Verificar dependencias instaladas**:
   ```bash
   npm list --depth=0
   ```

5. **Iniciar la aplicación en modo desarrollo**:
   ```bash
   ng serve
   ```
   Accede a `http://localhost:4200/` para ver la aplicación en funcionamiento.

---

## Funcionalidades Principales

1. **Explorar Álbumes**  
   Los álbumes se cargan automáticamente con *infinite scroll*. Cada tarjeta de álbum muestra:
   - Portada
   - Título del álbum y nombre del artista
   - Fecha de lanzamiento
   - Género musical

2. **Aportes de Usuarios**  
   Los usuarios pueden subir álbumes mediante un formulario, proporcionando:
   - Nombre del álbum, artista, fecha de lanzamiento y género
   - Subir una imagen del álbum desde la cámara o la galería del dispositivo

---

## 🔌 Plugins Nativos Utilizados

1. **Capacitor Storage**  
   Almacena los álbumes favoritos y reseñas localmente, permitiendo acceso sin conexión.

2. **Capacitor Camera**  
   Permite tomar fotos o seleccionar imágenes de la galería para los aportes de álbumes.

---

## Notas Adicionales

1. **Recordar siempre verificar e instalar dependencias dentro de**: `discoverify/src`
2. **Recomendado**: Usar [Angular Snippets](https://marketplace.visualstudio.com/items?itemName=johnpapa.Angular2) de Visual Studio Code.
3. **Utilizar la rama** `Dev-Discoverify` para desarrollo (_Solo para cambios masivos_).
4. **Ver dependencias**:
   ```bash
   npm list --depth=0
   ```
5. **Explorar posibles implementaciones**:
   - Investigar `npm i angular-spotify` para integración con Spotify.
   - Buscar API de **Last.fm** para obtener información de álbumes.
