// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyBgcdIS8KG6NGlj6G5oZCMuP1B6KnUtmCk",
    authDomain: "expense-app-63d5b.firebaseapp.com",
    databaseURL: "https://expense-app-63d5b.firebaseio.com",
    projectId: "expense-app-63d5b",
    storageBucket: "expense-app-63d5b.appspot.com",
    messagingSenderId: "173869928596"
  } 
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
