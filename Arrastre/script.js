document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("btnIniciar").addEventListener("click", iniciarJuego);
    document.getElementById("siguiente").addEventListener("click", () => cambiarPagina(1));
    document.getElementById("anterior").addEventListener("click", () => cambiarPagina(-1));
    document.getElementById("finalizar").addEventListener("click", finalizarJuego);
});

const preguntas = [
    { pregunta: "¿Cuál es el planeta más grande del sistema solar?", opciones: ["Tierra", "Marte", "Júpiter", "Venus"], respuesta: 2 },
    { pregunta: "¿Quién escribió 'Cien años de soledad'?", opciones: ["Pablo Neruda", "Gabriel García Márquez", "Mario Vargas Llosa", "Isabel Allende"], respuesta: 1 },
    { pregunta: "¿Cuánto es 8 x 7?", opciones: ["49", "56", "64", "42"], respuesta: 1 },
    { pregunta: "¿Cuál es el río más largo del mundo?", opciones: ["Amazonas", "Nilo", "Misisipi", "Yangtsé"], respuesta: 0 },
    { pregunta: "¿En qué año llegó el hombre a la luna?", opciones: ["1965", "1969", "1972", "1980"], respuesta: 1 },
    { pregunta: "¿Qué idioma se habla en Brasil?", opciones: ["Portugués", "Español", "Inglés", "Francés"], respuesta: 0 },
    { pregunta: "¿Cuál es la capital de Francia?", opciones: ["Londres", "Madrid", "París", "Roma"], respuesta: 2 },
    { pregunta: "¿Cuántos huesos tiene el cuerpo humano?", opciones: ["206", "210", "180", "250"], respuesta: 0 },
    { pregunta: "¿Cuál es el metal más usado en la industria?", opciones: ["Hierro", "Oro", "Aluminio", "Cobre"], respuesta: 0 },
    { pregunta: "¿Cuántos continentes hay en el mundo?", opciones: ["5", "6", "7", "8"], respuesta: 2 },
    { pregunta: "¿Quién pintó la Mona Lisa?", opciones: ["Miguel Ángel", "Leonardo da Vinci", "Van Gogh", "Picasso"], respuesta: 1 }
];

let respuestas = new Array(preguntas.length).fill(null);
let paginaActual = 0;
let preguntasPorPagina = 5;

function iniciarJuego() {
    let nombre = document.getElementById("nombre").value.trim();
    if (nombre === "") {
        alert("Por favor, ingresa tu nombre.");
        return;
    }

    console.log("✔ Juego iniciado con el nombre:", nombre);

    let contenedor = document.getElementById("contenedor");
    let inicio = document.getElementById("inicio");

    if (!contenedor || !inicio) {
        console.error("⚠ ERROR: No se encontraron los elementos necesarios.");
        alert("Error: No se encontró el contenedor de preguntas. Verifica el HTML.");
        return;
    }

    contenedor.classList.remove("oculto");
    inicio.classList.add("oculto");

    mostrarPreguntas();
}

function mostrarPreguntas() {
    let contenedorPreguntas = document.getElementById("preguntas");
    if (!contenedorPreguntas) {
        console.error("⚠ ERROR: No se encontró el div con id='preguntas'");
        return;
    }

    contenedorPreguntas.innerHTML = "";

    let inicio = paginaActual * preguntasPorPagina;
    let fin = Math.min(inicio + preguntasPorPagina, preguntas.length);

    preguntas.slice(inicio, fin).forEach((preg, index) => {
        let preguntaIndex = inicio + index;
        let preguntaHTML = `
            <div class="pregunta">
                <p><strong>${preguntaIndex + 1}.</strong> ${preg.pregunta}</p>
                ${preg.opciones.map((opc, i) =>
            `<label>
                <input type="radio" name="pregunta${preguntaIndex}" value="${i}" 
                ${respuestas[preguntaIndex] === i ? "checked" : ""} 
                onchange="guardarRespuesta(${preguntaIndex}, ${i})">
                ${opc}
            </label><br>`).join("")}
            </div>
        `;
        contenedorPreguntas.innerHTML += preguntaHTML;
    });

    actualizarBotones();
}

function actualizarBotones() {
    document.getElementById("anterior").disabled = paginaActual === 0;
    document.getElementById("siguiente").classList.toggle("oculto", paginaActual >= Math.floor(preguntas.length / preguntasPorPagina));
    document.getElementById("finalizar").classList.toggle("oculto", paginaActual < Math.floor(preguntas.length / preguntasPorPagina));
}

function guardarRespuesta(index, respuesta) {
    respuestas[index] = respuesta;
}

function cambiarPagina(direccion) {
    let inicio = paginaActual * preguntasPorPagina;
    let fin = Math.min(inicio + preguntasPorPagina, preguntas.length);

    for (let i = inicio; i < fin; i++) {
        if (respuestas[i] === null) {
            alert("Debes responder todas las preguntas antes de avanzar.");
            return;
        }
    }

    paginaActual += direccion;
    mostrarPreguntas();
}

function finalizarJuego() {
    let correctas = respuestas.filter((resp, i) => resp === preguntas[i].respuesta).length;
    let calificacion = (correctas / preguntas.length) * 5;
    let mensaje = calificacion < 3 ? "Vuelve a intentarlo" : calificacion < 4.5 ? "Vas bien" : "¡Excelente!";
    let nombre = document.getElementById("nombre").value;

    document.getElementById("resultado").innerHTML = `<div class="mensaje-resultado">${nombre}, tu puntaje es ${correctas}/15. <br> Calificación: ${calificacion.toFixed(1)}/5. <br> ${mensaje}</div>`;
    document.getElementById("contenedor").classList.add("oculto");
    document.getElementById("resultado").classList.remove("oculto");
}
