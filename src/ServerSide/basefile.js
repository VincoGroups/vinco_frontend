import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/storage';
import config from './Service/config';

var firebaseConfig = {
    apiKey: config.apiKey,
    authDomain: config.authDomain,
    databaseURL: config.databaseURL,
    projectId: config.projectId,
    storageBucket: config.storageBucket,
    messagingSenderId: config.messagingSenderId,
    appId: config.appId
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  export default !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();