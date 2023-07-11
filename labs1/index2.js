// Obtener referencia al formulario
let formulario = document.getElementById("formulario");
// Crear un array vacío para almacenar los datos
let array = [];

// Función para validar el texto ingresado en un campo de entrada
function validarTexto(input) {
    const regex = /^[A-Za-z\s]+$/;
    if (!regex.test(input.value.trim())) {
        input.classList.add("border-input-error");

        // Mostrar mensaje de error al lado del botón
        let mensajeError = document.createElement('span');
        mensajeError.textContent = "Debes rellenar este campo";
        mensajeError.className = "text-danger mensaje-error";
        input.parentNode.insertBefore(mensajeError, input.nextSibling);

        return false;
    } else {
        input.classList.remove("border-input-error");

        // Eliminar mensaje de error si existe
        let mensajeError = input.parentNode.querySelector('.mensaje-error');
        if (mensajeError) {
            mensajeError.parentNode.removeChild(mensajeError);
        }

        return true;
    }
}

// Obtener datos de una API
function getApi() {
    const url = "https://restcountries.com/v3.1/lang/spanish";
    fetch(url)
        .then(response => response.json())
        .then(data => {
            // Mapear los datos obtenidos y guardarlos en el array
            array = data.map(ob => ({
                pais: ob.name.common,
                capital: ob.capital[0],
                region: ob.region,
                idioma: ob.languages.spa
            }));
            // Actualizar la tabla HTML con los datos
            actualizarTablaHtml();
            console.table(array);
        })
        .catch(error => {
            console.log(error);
        });
}

// Agregar datos del formulario
function agregarDatos(event) {
    event.preventDefault();

    let pais = document.getElementById("pais");
    let capital = document.getElementById("capital");
    let region = document.getElementById("region");
    let idioma = document.getElementById("idioma");

    // Validar que todos los campos no estén vacíos
    let isValid = validarTexto(pais) && validarTexto(capital) && validarTexto(region) && validarTexto(idioma);
    if (!isValid) {
        return;
    }

    let objeto = {
        pais: pais.value,
        capital: capital.value,
        region: region.value,
        idioma: idioma.value,
        fecha: new Date(),
        estado: false
    };
    // Agregar el objeto al array
    array.push(objeto);
    console.table(array);
    // Actualizar la tabla HTML con los datos actualizados
    actualizarTablaHtml();

    formulario.reset();
}

// Actualizar la tabla HTML con los datos del array
function actualizarTablaHtml() {
    let datosBody = document.getElementById('datosBody');
    datosBody.innerHTML = "";

    // Recorrer el array y crear las filas de la tabla
    array.forEach((item, i) => {
        let fila = document.createElement('tr');
        let columnaPais = document.createElement('td');
        columnaPais.textContent = item.pais;
        fila.appendChild(columnaPais);

        let columnaCapital = document.createElement('td');
        columnaCapital.textContent = item.capital;
        fila.appendChild(columnaCapital);

        let columnaRegion = document.createElement('td');
        columnaRegion.textContent = item.region;
        fila.appendChild(columnaRegion);

        let columnaIdioma = document.createElement('td');
        columnaIdioma.textContent = item.idioma;
        fila.appendChild(columnaIdioma);

        let columnaOpciones = document.createElement('td');
        let btnEliminar = document.createElement('button');
        btnEliminar.textContent = "Eliminar";
        btnEliminar.className = "btn btn-danger me-2";
        btnEliminar.addEventListener('click', () => {
            eliminar(i);
        });
        columnaOpciones.appendChild(btnEliminar);
        fila.appendChild(columnaOpciones);

        if (item.estado) {
            fila.className = "marcar-ok";
        }

        datosBody.appendChild(fila);
    });
}

// Eliminar un elemento del array
function eliminar(i) {
    array.splice(i, 1);
    // Actualizar la tabla HTML con los datos actualizados
    actualizarTablaHtml();
}

// Agregar un evento de escucha al formulario para capturar el envío de datos
formulario.addEventListener("submit", agregarDatos);

// Obtener datos de la API al cargar la página
getApi();
