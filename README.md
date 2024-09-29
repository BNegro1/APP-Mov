# Proyecto: **Discoverify**

## 📋 Descripción

**Discoverify** permite a los usuarios descubrir álbumes musicales a través de un *infinite scroll*, además de aportar, reseñar, y calificar álbumes.

---

## 📦 Funcionalidades del Proyecto

### 1. **Infinite Scroll de Álbumes**
El fin es explorar álbumes que se cargan automáticamente mientras hacen *scroll* hacia abajo.Cada álbum se muestra en una card que incluye:

- Portada del álbum
- Nombre del artista y álbum
- Fecha de lanzamiento
- Género musical
 
*Nota: Se podrías modificar y agregar algunas características a futuro.*

### 2. **Aportes de Usuarios**
Los usuarios pueden aportar nuevos álbumes utilizando un formulario. La app les permite:
- Ingresar el nombre del álbum, artista, fecha de lanzamiento y género.
- Subir una imagen del álbum utilizando la cámara del dispositivo o seleccionando desde la galería.

---

## 🔧 Plugins Nativos
Los plugins nativos estarán ajustados respecto a las necesidades del producto con el usuario:

1. Capacitor Storage
Lo ideal es utilizarlo para guardar datos locales, como álbumes favoritos y reseñas sin conexión. Esto permite a los usuarios acceder a su contenido sin depender de una conexión a Internet. Sin embargo, estará en evaluación para investigar alguna otra alternativa.

2. Capacitor Camera
Esto permitirá que usuario pueda tomar fotos o seleccionar imágenes desde la galería para agregar a sus aportes de álbumes, mejorando la interacción y el contenido visual en la app.

## 🧩 Lógica de la Solución

1. El usuario abre la aplicación y ve un *infinite scroll* de álbumes.
2. Los álbumes se cargan a medida que el usuario navega por la página.
3. Desde el menú, el usuario puede acceder a un formulario para subir álbumes.
4. El usuario puede tomar una foto del álbum usando la cámara del dispositivo.
5. Los álbumes favoritos se almacenan localmente usando **Capacitor Storage**.
6. Los usuarios pueden compartir álbumes o reseñas en redes sociales (futuro desarrollo).

---
## ❗❗❗ Utilizar branch *Dev-Discoverify* ❗❗❗
