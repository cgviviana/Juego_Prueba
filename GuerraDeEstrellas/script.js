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

db.ref("game/responses").on("child_added", (snapshot) => {
    const group = snapshot.key.replace("grupo", "");
    const response = snapshot.val();
    
    db.ref("game/currentQuestion").once("value", (questionSnapshot) => {
        if (questionSnapshot.exists()) {
            const questionNumber = questionSnapshot.val().number;
            const correctAnswer = `RESPUESTA ${questionNumber}`;
            const cell = document.querySelector(`.grid-item[data-number='${questionNumber}']`);

            if (cell) {
                if (response === correctAnswer) {
                    cell.classList.add("correct");
                    db.ref(`game/scores/grupo${group}`).transaction(score => (score || 0) + 1);
                } else {
                    cell.classList.add("incorrect");
                }
            }
        }
    });
});

db.ref("game/scores").on("value", (snapshot) => {
    if (snapshot.exists()) {
        const data = snapshot.val();
        for (let i = 1; i <= 6; i++) {
            document.getElementById(`score${i}`).innerText = data[`grupo${i}`] || 0;
        }
    }
});
