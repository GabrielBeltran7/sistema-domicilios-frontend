
**Buenos días,**

Adjunto el repositorio del **Sistema de Domicilios - Frontend**.

El sistema puede ser utilizado directamente desde la web, ya que el frontend está desplegado en Vercel y el backend en Render.  
Sin embargo, si prefieren ejecutarlo de forma local, a continuación se detallan los pasos:


🔗 **Despliegue en Vercel:**  
https://sistema-domicilios-frontend.vercel.app/

📦 **Repositorio en GitHub:**  
https://github.com/GabrielBeltran7/sistema-domicilios-frontend

### 🛠 Tecnologías utilizadas:
- React  
- TypeScript  
- Redux  
- CSS  
- Firebase (Firestore Database)  
- Google Maps (API)  
- Firestore `onSnapshot` para escuchar actualizaciones en tiempo real

---

### ▶️ Pasos para ejecutar el proyecto localmente:

1. Clonar o descargar el repositorio desde GitHub.
2. Instalar las dependencias con `npm i` o `npm install`.
3. Si deseas ejecutarlo de forma local, debes modificar los endpoints en los archivos de acciones dentro de la carpeta `redux/actions`, apuntando al servidor local, por ejemplo:  
   `http://localhost:3000` (o el puerto correspondiente donde se esté ejecutando el backend).
4. Es importante tener el backend ejecutándose en paralelo para que el sistema funcione correctamente.

Dato adicional..
 Deje todos los 3 componentes en el home. para ver el ciclo de la pagina en tiempo real....
---


 




