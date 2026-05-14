import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getDatabase,
  ref,
  push,
  onValue
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyDJ5u-eNDrun9-XfLS-A8MFjn3e69E_Jhs",
  authDomain: "odontos-f856c.firebaseapp.com",
  databaseURL: "https://odontos-f856c-default-rtdb.firebaseio.com",
  projectId: "odontos-f856c",
  storageBucket: "odontos-f856c.firebasestorage.app",
  messagingSenderId: "941253430623",
  appId: "1:941253430623:web:ff9741c350073a77103aea"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

/* ===== GUARDAR PACIENTE ===== */
window.guardarPacienteFirebase = function (paciente) {

  return push(ref(db, "pacientes"), {

    nombre: paciente.nombre || "",
    dni: paciente.dni || "",
    nacimiento: paciente.nacimiento || "",
    genero: paciente.genero || "",
    telefono: paciente.telefono || "",
    email: paciente.email || "",
    alergias: paciente.alergias || "Ninguna",
    fecha: paciente.fecha || new Date().toLocaleString()

  })

  .then(() => {

    console.log("Paciente guardado en Firebase");

  })

  .catch((error) => {

    console.error("Error guardando paciente:", error);

  });

};

/* ===== CARGAR PACIENTES ===== */
window.cargarPacientesFirebase = function () {

  const pacientesRef = ref(db, "pacientes");

  onValue(pacientesRef, (snapshot) => {

    const data = snapshot.val();

    if (!data) {

      console.log("No hay pacientes");
      return;

    }

    const lista = Object.entries(data).map(([firebaseId, p], index) => ({

      id: index + 1,
      firebaseId: firebaseId,

      nombre: p.nombre || "",
      dni: p.dni || "",
      nacimiento: p.nacimiento || "",
      genero: p.genero || "",
      telefono: p.telefono || "",
      email: p.email || "",
      alergias: p.alergias || "Ninguna",
      fecha: p.fecha || ""

    }));

    /* ===== ACTUALIZAR PANEL ADMIN ===== */
    if (typeof window.aplicarPacientesFirebase === "function") {

      window.aplicarPacientesFirebase(lista);

    }

    console.log("Pacientes cargados:", lista);

  });

};

/* ===== CARGA AUTOMÁTICA ===== */
window.cargarPacientesFirebase();