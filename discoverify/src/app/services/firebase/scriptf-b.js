const admin = require('firebase-admin');

// Inicializar Firebase Admin SDK
const serviceAccount = require('./discoverify-app-firebase-adminsdk-2viwm-b079b76681.json'); // Asegúrate de tener este archivo

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

async function deleteAllFirestoreUsers() {
  try {
    const db = admin.firestore();
    const batch = db.batch();
    const usuariosRef = db.collection('usuarios');

    const snapshot = await usuariosRef.get();
    
    if (snapshot.empty) {
      console.log('No hay documentos en la colección usuarios');
      return;
    }

    console.log(`Eliminando ${snapshot.size} documentos...`);

    snapshot.forEach(doc => {
      console.log(`Preparando eliminación de documento: ${doc.id}`);
      batch.delete(doc.ref);
    });

    await batch.commit();
    console.log('Todos los documentos han sido eliminados exitosamente');

  } catch (error) {
    console.error('Error al eliminar documentos:', error);
  }
}

deleteAllFirestoreUsers();




// USUARIOS EN AUTH DELETE.

const admin = require('firebase-admin');

// Inicializar Firebase Admin SDK (asegúrate de tener tu archivo de credenciales)
const serviceAccount = require('./ruta-a-tu-archivo-serviceAccount.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

async function deleteAllUsers() {
  try {
    const auth = admin.auth();
    let users = [];
    let nextPageToken;

    // Obtener todos los usuarios en lotes
    do {
      const listUsersResult = await auth.listUsers(1000, nextPageToken);
      users = users.concat(listUsersResult.users.map(user => user.uid));
      nextPageToken = listUsersResult.pageToken;
    } while (nextPageToken);

    // Eliminar usuarios
    console.log(`Eliminando ${users.length} usuarios...`);
    
    for (const uid of users) {
      await auth.deleteUser(uid);
      console.log(`Usuario eliminado: ${uid}`);
    }

    console.log('Todos los usuarios han sido eliminados exitosamente');
  } catch (error) {
    console.error('Error al eliminar usuarios:', error);
  }
}

// Ejecutar la función
deleteAllUsers();