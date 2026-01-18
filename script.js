// Puerto JS
// PORT = 3000
// Puerto Java
// PORT = 8081
// Puerto C#
// PORT = 5258

// URL API Backend
PORT = 5258;
const API = `https://api.jsantos.site/alumnos`;

// Declaramos variables para no depender de variables globales creadas por el navegador
const btnActualizar = document.getElementById("btnActualizar");
const btnCancelar = document.getElementById("btnCancelar");
const btnGuardar = document.getElementById("btnGuardar");
const formAlumno = document.getElementById("formAlumno");
const tablaBody = document.getElementById("tablaBody");
const alertPlaceHolder = document.getElementById("alertPlaceHolder");

// cargar alumnos
async function cargarAlumnos() {
  try {
    const res = await fetch(API);
    const alumnos = await res.json();

    let html = "";
    alumnos.forEach((a) => {
      html += `
      <tr>
          <td>${a.id}</td>
          <td>${a.nombre}</td>
          <td>${a.apellido}</td>
          <td>${a.telefono}</td>
          <td>${a.direccion}</td>
          <td>
              <button 
              class="btn btn-outline-warning btn-sm btn-editar"
              data-id="${a.id}"
              data-nombre="${a.nombre}"
              data-apellido="${a.apellido}"
              data-telefono="${a.telefono}"
              data-direccion="${a.direccion}"
              >
              Editar
              </button>
              <button class="btn btn-danger btn-sm btn-eliminar"
              data-id="${a.id}"
              >
              Eliminar
              </button>
          </td>
      </tr>
      `;
    });

    tablaBody.innerHTML = html;
  } catch (error) {
    console.error("Error cargando alumnos:", error);
  }
}
cargarAlumnos();

// guardar alumno
formAlumno.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Utilize FormData para obtener los valorse del formulario y los conevertimos en un objeto
  // Asi evitamos tener que depender de variables globales creadas por el navegador
  const data = Object.fromEntries(new FormData(formAlumno));

  const res = await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    mostrarAlerta(error.message, "danger");
    // alert(error.message);
    return;
  }

  mostrarAlerta("Guardado correctamente", "success");

  cargarAlumnos();
  e.target.reset();
});

formAlumno.telefono.addEventListener("input", (e) => {
  e.target.value = e.target.value.replace(/\D/g, "").slice(0, 8);
});

tablaBody.addEventListener("click", (e) => {
  const btnEditar = e.target.closest(".btn-editar");
  const btnEliminar = e.target.closest(".btn-eliminar");

  if (btnEditar) {
    editar(btnEditar);
  }

  if (btnEliminar) {
    eliminarAlumno(btnEliminar.dataset.id);
  }
});

// actualizar alumno
btnActualizar.addEventListener("click", async () => {
  const data = Object.fromEntries(new FormData(formAlumno));
  const id = formAlumno.idAlumno.value;
  // const id = idAlumno.value;
  //
  const res = await fetch(`${API}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json();
    mostrarAlerta(error.message, "danger");
    // alert(error.message);
    return;
  }

  cargarAlumnos();
  formAlumno.reset();
  desactivarEdicion();
});

// cancelar edicion
btnCancelar.addEventListener("click", () => {
  formAlumno.reset();

  desactivarEdicion();
});

// eliminar alumno
async function eliminarAlumno(id) {
  // await fetch("http://localhost:3000/alumnos/1")
  const res = await fetch(`${API}/${id}`, { method: "DELETE" });

  if (!res.ok) {
    const error = await res.json();
    mostrarAlerta(error.message, "danger");
  }
  mostrarAlerta("Eliminado correctamente", "success");
  cargarAlumnos();
}

// Editar datos
function editar(btn) {
  const { id, nombre, apellido, telefono, direccion } = btn.dataset;
  formAlumno.idAlumno.value = id;
  formAlumno.nombre.value = nombre;
  formAlumno.apellido.value = apellido;
  formAlumno.telefono.value = telefono;
  formAlumno.direccion.value = direccion;

  activarEdicion();
}

function activarEdicion() {
  btnGuardar.classList.add("d-none");
  btnActualizar.classList.remove("d-none");
  btnCancelar.classList.remove("d-none");
}

function desactivarEdicion() {
  btnGuardar.classList.remove("d-none");
  btnActualizar.classList.add("d-none");
  btnCancelar.classList.add("d-none");
}

function mostrarAlerta(message, type) {
  alertPlaceHolder.innerHTML = `
    <div class="alert alert-${type} alert-dismissible fade" role="alert">
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>
`;
  const alert = document.querySelector(".alert");

  setTimeout(() => {
    alert.classList.add("show");
  }, 10);

  setTimeout(() => {
    alert.classList.remove("show");

    setTimeout(() => alert.remove(), 200);
  }, 2400);
}
