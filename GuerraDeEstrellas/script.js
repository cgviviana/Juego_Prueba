// 🔥 Configuración de Firebase
const firebaseConfig = {
    apiKey: "TU_API_KEY",
    authDomain: "TU_AUTH_DOMAIN",
    databaseURL: "TU_DATABASE_URL",
    projectId: "TU_PROJECT_ID",
    storageBucket: "TU_STORAGE_BUCKET",
    messagingSenderId: "TU_MESSAGING_SENDER_ID",
    appId: "TU_APP_ID"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// 🏆 Generar preguntas del 1 al 25
function generateQuestion() {
    const randomNumber = Math.floor(Math.random() * 25) + 1;
    const questionText = `Pregunta para el número ${randomNumber}`;

    db.ref("game/currentQuestion").set({
        number: randomNumber,
        text: questionText
    });
}

// 🎯 Mostrar la pregunta en `index.html`
db.ref("game/currentQuestion").on("value", (snapshot) => {
    if (snapshot.exists()) {
        const data = snapshot.val();
        document.getElementById("question").innerText = data.text;
    }
});

// 🏅 Responder preguntas y actualizar puntajes
db.ref("game/responses").on("child_added", (snapshot) => {
    const group = snapshot.key.replace("grupo", "");
    const response = snapshot.val();
    const correctAnswer = `RESPUESTA ${group}`;
    const cell = document.querySelector(`.grid-item:nth-child(${group})`);

    if (response === correctAnswer) {
        cell.classList.add("correct"); // ✅ Respuesta correcta (Verde pastel)
        db.ref(`game/scores/grupo${group}`).transaction(score => (score || 0) + 1);
    } else {
        cell.classList.add("incorrect"); // ❌ Respuesta incorrecta (Rosa pastel)
    }
});

// 🔄 Actualizar la tabla de resultados en tiempo real
db.ref("game/scores").on("value", (snapshot) => {
    if (snapshot.exists()) {
        const data = snapshot.val();
        for (let i = 1; i <= 6; i++) {
            document.getElementById(`score${i}`).innerText = data[`grupo${i}`] || 0;
        }
    }
});
