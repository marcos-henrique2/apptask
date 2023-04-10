import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import{getAuth} from 'firebase/auth'


const firebaseConfig = {
    apiKey: "AIzaSyAdJc1wtVDXCy99QVP5lStEc08p9qdflkE",
    authDomain: "apptask-9c66e.firebaseapp.com",
    projectId: "apptask-9c66e",
    storageBucket: "apptask-9c66e.appspot.com",
    messagingSenderId: "909270762629",
    appId: "1:909270762629:web:d9e3d0ebb4e37b15acd5ec",
    measurementId: "G-V01QS5HRTS"
  };

  const firebaseApp = initializeApp(firebaseConfig);

  const db = getFirestore(firebaseApp);
  const auth = getAuth(firebaseApp);

  export { db, auth };