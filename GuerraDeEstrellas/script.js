const firebaseConfig = {
    apiKey: "TU_API_KEY",
    authDomain: "TU_AUTH_DOMAIN",
    databaseURL: "TU_DATABASE_URL",
    projectId: "TU_PROJECT_ID",
    storageBucket: "TU_STORAGE_BUCKET",
    messagingSenderId: "TU_MESSAGING_SENDER_ID",
    appId: "TU_APP_ID"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

function generateQuestion() {
    const questions = Array.from({ length: 25 }, (_, i) => ({ id: i + 1, question: `Pregunta ${i + 1}`, answer: `RESPUESTA ${i + 1}` }));
    db.ref("game/questions").set(questions);
}

function sendAnswer() {
    const group = document.getElementById("group").value;
    const answer = document.getElementById("answer").value.toUpperCase();
    db.ref(`game/responses/grupo${group}`).set(answer);
}

db.ref("game/questions").on("value", (snapshot) => {
    if (snapshot.exists()) {
        const data = snapshot.val();
        const board = document.getElementById("questionBoard");
        board.innerHTML = "";
        data.forEach(q => {
            const div = document.createElement("div");
            div.classList.add("grid-item");
            div.textContent = q.id;
            div.dataset.id = q.id;
            board.appendChild(div);
        });
    }
});

db.ref("game/responses").on("value", (snapshot) => {
    if (snapshot.exists()) {
        const data = snapshot.val();
        for (let i = 1; i <= 6; i++) {
            document.getElementById(`resp${i}`).textContent = data[`grupo${i}`] || "-";
        }
    }
});

db.ref("game/responses").on("child_added", (snapshot) => {
    const response = snapshot.val();
    const group = snapshot.key.replace("grupo", "");
    const correctAnswer = `RESPUESTA ${group}`;
    const box = document.querySelector(`.grid-item[data-id='${group}']`);

    if (response === correctAnswer) {
        box.classList.add("correct");
        db.ref(`game/scores/grupo${group}`).transaction(score => (score || 0) + 1);
    } else {
        box.classList.add("incorrect");
    }
});

