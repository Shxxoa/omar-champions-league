let players = [];
let previousMatches = new Set(); // To store previous match combinations

function addPlayerFromDropdown() {
    let dropdown = document.getElementById("playerDropdown");
    let name = dropdown.value;

    if (name && name !== "Select Player" && !players.includes(name)) {
        players.push(name);
        updatePlayerList();
        dropdown.value = ""; // Reset dropdown to default
    } else if (name !== "" && players.includes(name)) {
        alert("This player is already added!");
        dropdown.value = "";
    }
}

function addPlayerFromInput() {
    let nameInput = document.getElementById("playerName");
    let name = nameInput.value.trim();

    if (name && !players.includes(name)) {
        players.push(name);
        updatePlayerList();
        nameInput.value = "";
    } else if (name !== "" && players.includes(name)) {
        alert("This team is already added!");
        nameInput.value = "";
    } else {
        alert("Please enter a team name!");
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
    previousMatches.clear(); // Clear previous matches when clearing players
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

    let countdownNumbers = ["3", "2", "1", "KICK OFF!"];
    let countIndex = 0;

    countdown.innerHTML = countdownNumbers[countIndex];
    countdown.style.animation = "zoomFade 1s ease-in-out, soccerSpin 1s ease-in-out";

    let countdownInterval = setInterval(() => {
        countIndex++;
        if (countIndex < countdownNumbers.length) {
            countdown.innerHTML = countdownNumbers[countIndex];
            countdown.style.animation = "zoomFade 1s ease-in-out, soccerSpin 1s ease-in-out";
        } else {
            clearInterval(countdownInterval);
            countdown.style.display = "none";
            generateBracket();
            startConfetti();
        }
    }, 1000);
}

function generateBracket() {
    // Define preferred matchings
    const preferredMatchings = {
        "OMAR": ["ABUD", "TAHA", "OSAMA", "HASAN", "YOUSF"],
        "ABUD": ["TAHA", "OSAMA", "YOUSF", "OMAR"],
        "AHMED": ["CAPTAIN", "MUSTAFA ASSI", "MUSTAFA", "ALI"],
        "MUSTAFA": ["AHMED", "CAPTAIN", "MUSTAFA ASSI", "ALI"],
        "MUSTAFA ASSI": ["MUSTAFA", "AHMED", "ALI", "CAPTAIN"],
        "ALI": ["MUSTAFA ASSI", "MUSTAFA", "AHMED", "CAPTAIN"],
        "HASAN": ["TAHA", "OSAMA", "YOUSF"],
        "TAHA": ["HASAN", "MUSTAFA ASSI", "CAPTAIN", "MUSTAFA","AHMED"]
    };

    let availablePlayers = [...players];
    let matches = [];
    const biasProbability = 0.8; // 80% chance for preferred matching
    const maxAttempts = 50; // Prevent infinite loops
    let attempts = 0;

    while (availablePlayers.length >= 2 && attempts < maxAttempts) {
        let player1 = availablePlayers[0];
        let player2 = null;
        let matchKey = null;

        // Try to find a new matchup
        if (Math.random() < biasProbability && preferredMatchings[player1]) {
            // Filter preferred opponents that are available and haven't been matched with player1
            const preferredOpponents = preferredMatchings[player1].filter(p => 
                availablePlayers.includes(p) && 
                p !== player1 && 
                !previousMatches.has(`${player1}-${p}`) && 
                !previousMatches.has(`${p}-${player1}`)
            );

            if (preferredOpponents.length > 0) {
                player2 = preferredOpponents[Math.floor(Math.random() * preferredOpponents.length)];
                matchKey = `${player1}-${player2}`;
            }
        }

        // If no preferred match or random chance triggered, pick random non-repeated match
        if (!player2) {
            const possibleOpponents = availablePlayers.filter(p => 
                p !== player1 && 
                !previousMatches.has(`${player1}-${p}`) && 
                !previousMatches.has(`${p}-${player1}`)
            );

            if (possibleOpponents.length > 0) {
                player2 = possibleOpponents[Math.floor(Math.random() * possibleOpponents.length)];
                matchKey = `${player1}-${player2}`;
            }
        }

        if (player2) {
            matches.push([player1, player2]);
            previousMatches.add(matchKey);
            availablePlayers = availablePlayers.filter(p => p !== player1 && p !== player2);
            attempts = 0; // Reset attempts on successful match
        } else {
            // If no new match possible, shuffle and try again
            availablePlayers.shift();
            availablePlayers.sort(() => Math.random() - 0.5);
            attempts++;
        }
    }

    // Handle odd number of players
    if (availablePlayers.length === 1) {
        matches.push([availablePlayers[0], "(Pick Your Partner)"]);
    }

    // If we couldn't find unique matches, clear previous matches and try again
    if (matches.length === 0 && attempts >= maxAttempts) {
        previousMatches.clear();
        generateBracket();
        return;
    }

    // Generate HTML
    let bracketHTML = `<h2 class="neon-glow">Tournament Bracket</h2><div class="bracket-container">`;
    matches.forEach(match => {
        bracketHTML += `<div class="match">${match[0]} with ${match[1]}</div>`;
    });

    bracketHTML += `</div>`;
    bracketHTML += `
        <div id="resultButtons">
            <button onclick="restartTournament()" class="button neon-button slide-in-left">Restart</button>
            <button onclick="addMorePlayers()" class="button neon-button slide-in-right">Add More Players</button>
            <a href="index.html" class="button neon-button slide-in-left">Back to Home</a>
        </div>`;
    
    document.getElementById("tournamentBracket").innerHTML = bracketHTML;
    document.getElementById("tournamentBracket").classList.add("bracket-show");
}

function startConfetti() {
    confetti({
        particleCount: 300,
        spread: 360,
        origin: { y: 0.5 },
        colors: ['#ffd700', '#00b7eb', '#ffffff'],
        scalar: 1.2
    });
}

function restartTournament() {
    document.getElementById("tournamentBracket").innerHTML = "";
    document.getElementById("tournamentContainer").classList.remove("hidden");
    // Don't clear previousMatches here - we want to keep track across restarts
}

function addMorePlayers() {
    document.getElementById("tournamentBracket").innerHTML = "";
    document.getElementById("tournamentContainer").classList.remove("hidden");
}