import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getDatabase,
  ref,
  push,
  onValue,
  remove
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
  });
};

/* ===== CARGAR PACIENTES ===== */
window.cargarPacientesFirebase = function () {
  const pacientesRef = ref(db, "pacientes");

  onValue(pacientesRef, (snapshot) => {
    const data = snapshot.val();

    const lista = data
      ? Object.entries(data).map(([firebaseId, p], index) => ({
          id: index + 1,
          firebaseId,
          nombre: p.nombre || "",
          dni: p.dni || "",
          nacimiento: p.nacimiento || "",
          genero: p.genero || "",
          telefono: p.telefono || "",
          email: p.email || "",
          alergias: p.alergias || "Ninguna",
          fecha: p.fecha || ""
        }))
      : [];

    if (typeof window.aplicarPacientesFirebase === "function") {
      window.aplicarPacientesFirebase(lista);
    }

    console.log("Pacientes cargados:", lista);
  });
};

/* ===== ELIMINAR PACIENTE ===== */
window.eliminarPacienteFirebase = function (firebaseId) {
  if (!firebaseId) {
    alert("Error: paciente sin ID de Firebase");
    return;
  }

  return remove(ref(db, "pacientes/" + firebaseId))
    .then(() => {
      console.log("Paciente eliminado:", firebaseId);
    })
    .catch((error) => {
      console.error("Error eliminando paciente:", error);
      alert("No se pudo eliminar el paciente");
    });
};

/* ===== ELIMINAR HISTORIAL ===== */
window.eliminarHistorialFirebase = function (firebaseId) {
  if (!firebaseId) {
    alert("Error: historial sin ID de Firebase");
    return;
  }

  return remove(ref(db, "historial/" + firebaseId))
    .then(() => {
      console.log("Historial eliminado:", firebaseId);
    })
    .catch((error) => {
      console.error("Error eliminando historial:", error);
      alert("No se pudo eliminar el historial");
    });
};

/* ===== CARGA AUTOMÁTICA ===== */
window.cargarPacientesFirebase();