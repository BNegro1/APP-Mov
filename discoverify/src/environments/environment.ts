// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

// OJO: Está hardcodeado el 'environment.firebaseConfig' en 'app.module.ts' y 'environment' en 'app.component.ts' y 'auth-guard.ts'
// TENER PRECAUCIÓN POR LOS DATOS SENSIBLES QUE SE PUEDEN ENCONTRAR EN ESTE ARCHIVO!!!
// environment.ts
// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyB7LukVZgX952mGbLUN0ecnXoM0j08DMDs",
    authDomain: "discoverify-app.firebaseapp.com",
    databaseURL: "https://discoverify-app-default-rtdb.firebaseio.com",
    projectId: "discoverify-app",
    storageBucket: "discoverify-app.firebasestorage.app",
    messagingSenderId: "233031717062",
    appId: "1:233031717062:web:ed79817d3ee54dc35987c7"
  }
};