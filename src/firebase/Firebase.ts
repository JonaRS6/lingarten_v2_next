// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { Firestore, collection, getDocs, getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import Client, { ClientTable } from "../../types/Client";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: "AIzaSyAQ4oiMZQfZxL_9rRXxcOUUobS_UQhMuUE",
	authDomain: "lingarten-efc0b.firebaseapp.com",
	databaseURL: "https://lingarten-efc0b.firebaseio.com",
	projectId: "lingarten-efc0b",
	storageBucket: "lingarten-efc0b.appspot.com",
	messagingSenderId: "958287279182",
	appId: "1:958287279182:web:ce172864abfa966f9b7f1f",
	measurementId: "G-N7D8LLYJ43",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Desactivar esta linea para usar la base de datos en la nube
connectFirestoreEmulator(db, '127.0.0.1', 8080)

async function getClients(db: Firestore) {
	const clientsCol = collection(db, "clients");
	const clientSnapshot = await getDocs(clientsCol);
	const clientList = clientSnapshot.docs.map((doc) => doc.data());
	return clientList as Client[];
}

async function getClientsTable(){
	const clients = await getClients(db);
	const clientsTable = clients.map((client) => ({
		...client,
		clientName: `${client.name} ${client.lastname}`,
		phone: client.tel1.toString()==="0" ? null : client.tel1.toString(),
		fullAddress: `${client.address.street} ${client.address.no}, ${client.address.colony}`,
		status: client.status,
	}))
	return clientsTable as ClientTable[];
}


export { getClientsTable };