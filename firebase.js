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

window.esAdmin = function () {
  return typeof isAdmin === "function" && isAdmin();
};

/* ===== GUARDAR PACIENTE ===== */
window.guardarPacienteFirebase = async function (paciente) {
  const nuevoRef = await push(ref(db, "pacientes"), {
    nombre: paciente.nombre || "",
    dni: paciente.dni || "",
    nacimiento: paciente.nacimiento || "",
    genero: paciente.genero || "",
    telefono: paciente.telefono || "",
    email: paciente.email || "",
    alergias: paciente.alergias || "Ninguna",
    fecha: paciente.fecha || new Date().toLocaleString()
  });

  return nuevoRef.key;
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

/* ===== ELIMINAR PACIENTE SOLO ADMIN ===== */
window.eliminarPacienteFirebase = async function (firebaseId) {
  if (!window.esAdmin()) {
    alert("Solo el administrador puede eliminar pacientes");
    return;
  }

  if (!firebaseId) {
    alert("Error: paciente sin ID de Firebase");
    return;
  }

  await remove(ref(db, "pacientes/" + firebaseId));
  console.log("Paciente eliminado:", firebaseId);
};

/* ===== ELIMINAR HISTORIAL SOLO ADMIN ===== */
window.eliminarHistorialFirebase = async function (firebaseId) {
  if (!window.esAdmin()) {
    alert("Solo el administrador puede eliminar historial");
    return;
  }

  if (!firebaseId) {
    alert("Error: historial sin ID de Firebase");
    return;
  }

  await remove(ref(db, "historial/" + firebaseId));
  console.log("Historial eliminado:", firebaseId);
};

/* ===== CARGA AUTOMÁTICA ===== */
window.cargarPacientesFirebase();