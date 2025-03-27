let players = [];

function addPlayer() {
    let nameInput = document.getElementById("playerName");
    let name = nameInput.value.trim();

    if (name !== "" && !players.includes(name)) {
        players.push(name);
        updatePlayerList();
        nameInput.value = "";
    } else {
        alert("Enter a unique name!");
    }
}

function updatePlayerList() {
    let playerList = document.getElementById("players");
    playerList.innerHTML = "";

    players.forEach((player, index) => {
        let listItem = document.createElement("li");
        listItem.textContent = player;

        let deleteBtn = document.createElement("button");
        deleteBtn.textContent = "X";
        deleteBtn.onclick = () => removePlayer(index);

        listItem.appendChild(deleteBtn);
        playerList.appendChild(listItem);
    });
}

function removePlayer(index) {
    players.splice(index, 1);
    updatePlayerList();
}

function clearPlayers() {
    players = [];
    updatePlayerList();
    document.getElementById("tournamentBracket").innerHTML = "";
}

function startCountdown() {
    if (players.length < 2) {
        alert("You need at least 2 players!");
        return;
    }

    let countdown = document.getElementById("countdown");
    let tournamentContainer = document.getElementById("tournamentContainer");

    tournamentContainer.classList.add("hidden");
    countdown.style.display = "block";

    let countdownNumbers = ["3", "2", "1", "SUI TIME!"];
    let countIndex = 0;

    countdown.innerHTML = countdownNumbers[countIndex];
    countdown.style.animation = "zoomFade 1s ease-in-out";

    let countdownInterval = setInterval(() => {
        countIndex++;
        if (countIndex < countdownNumbers.length) {
            countdown.innerHTML = countdownNumbers[countIndex];
            countdown.style.animation = "zoomFade 1s ease-in-out";
        } else {
            clearInterval(countdownInterval);
            countdown.style.display = "none";
            generateBracket();
            startConfetti();
        }
    }, 1000);
}

function generateBracket() {
    let shuffledPlayers = [...players].sort(() => Math.random() - 0.5);
    let bracketHTML = `<h2 class="neon-glow">Tournament Bracket</h2><div class="bracket-container">`;

    for (let i = 0; i < shuffledPlayers.length; i += 2) {
        let player1 = shuffledPlayers[i];
        let player2 = shuffledPlayers[i + 1] ? shuffledPlayers[i + 1] : "(Pick Your Partner)";

        bracketHTML += `<div class="match">${player1} 🆚 ${player2}</div>`;
    }

    bracketHTML += `</div>`;
    bracketHTML += `
        <div id="resultButtons">
            <button onclick="restartTournament()" class="button neon-button">Restart</button>
            <button onclick="addMorePlayers()" class="button neon-button">Add More Players</button>
            <a href="index.html" class="button neon-button">Back to Home</a>
        </div>`;
    
    document.getElementById("tournamentBracket").innerHTML = bracketHTML;
    document.getElementById("tournamentBracket").classList.add("bracket-show");
}

function startConfetti() {
    confetti({
        particleCount: 300,
        spread: 360,
        origin: { y: 0.5 },
        colors: ['#ff00cc', '#00ffcc', '#ffcc00'],
        scalar: 1.2
    });
}

function restartTournament() {
    document.getElementById("tournamentBracket").innerHTML = "";
    document.getElementById("tournamentContainer").classList.remove("hidden");
}

function addMorePlayers() {
    document.getElementById("tournamentBracket").innerHTML = "";
    document.getElementById("tournamentContainer").classList.remove("hidden");
}