let players = [];

// Function to add a player
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

// Function to update the list
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

// Function to remove a player
function removePlayer(index) {
    players.splice(index, 1);
    updatePlayerList();
}

// Function to clear all players
function clearPlayers() {
    players = [];
    updatePlayerList();
    document.getElementById("tournamentBracket").innerHTML = "";
}

// Function to start fancier countdown before generating the bracket
function startCountdown() {
    if (players.length < 2) {
        alert("You need at least 2 players!");
        return;
    }

    let countdown = document.getElementById("countdown");
    let tournamentContainer = document.getElementById("tournamentContainer");
    let resultButtons = document.getElementById("resultButtons");

    tournamentContainer.classList.add("hidden"); // Hide everything except countdown
    countdown.style.display = "block";

    let countdownNumbers = ["3", "2", "READY TO SUI?"];
    let countIndex = 0;

    countdown.innerHTML = countdownNumbers[countIndex];
    countdown.style.animation = "fadeInOut 1s ease-in-out";

    let countdownInterval = setInterval(() => {
        countIndex++;
        if (countIndex < countdownNumbers.length) {
            countdown.innerHTML = countdownNumbers[countIndex];
            countdown.style.animation = "fadeInOut 1s ease-in-out";
        } else {
            clearInterval(countdownInterval);
            countdown.style.display = "none";
            generateBracket();
            startConfetti();
        }
    }, 1000);
}

// Function to generate the bracket with "Pick Your Partner" for odd players
function generateBracket() {
    let shuffledPlayers = [...players].sort(() => Math.random() - 0.5);
    let bracketHTML = `<h2>Tournament Bracket</h2><div class="bracket-container">`;

    for (let i = 0; i < shuffledPlayers.length; i += 2) {
        let player1 = shuffledPlayers[i];
        let player2 = shuffledPlayers[i + 1] ? shuffledPlayers[i + 1] : "(Pick Your Partner)";

        bracketHTML += `<div class="match">${player1} 🆚 ${player2}</div>`;
    }

    bracketHTML += `</div>`;
    document.getElementById("tournamentBracket").innerHTML = bracketHTML;
    document.getElementById("tournamentBracket").classList.add("bracket-show");

    setTimeout(() => {
        document.getElementById("resultButtons").style.display = "block";
    }, 500);
}

// Function to start confetti effect
function startConfetti() {
    confetti({
        particleCount: 200,
        spread: 180,
        origin: { y: 0.6 }
    });
}

// Function to restart the tournament
function restartTournament() {
    location.reload(); // Refreshes the page to reset everything
}
