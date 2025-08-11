let gameState = {
  money: 0,
  moneyGained: 0,
  upgradeLevel: 0,
  rawScams: 0,
  upgradeCost: 50,
  upgrade2Cost: 250,
  upgrade3Cost: 1250,
  upgrade4Cost: 5000,
  upgrade5Cost: 25000,
  clickspersec: 0,
  scamsPerSecond: 0,
  currentTargetIndex: 0,
  minMoney: 1,
  maxMoney: 5,
  targetProgress: 0,
  upgMinMoney: 0,
  upgMaxMoney: 0,
  scamsUntilPrestige: 2500,
  prestigeMultiplier: 1,
  prestiges: 0,
  scamsPerScam: 1,
};

let autoSaveInterval = setInterval(saveGame, 10000);

// Load saved state if it exists
const savedState = localStorage.getItem('scamGame');
if (savedState) {
  const loaded = JSON.parse(savedState);
  Object.assign(gameState, loaded);
  gameState.upgMinMoney ??= 0;
  gameState.upgMaxMoney ??= 0;
}

// Save function
function saveGame() {
  if (isResetting) return; // skip saving during reset
  localStorage.setItem('scamGame', JSON.stringify(gameState));
}

let isResetting = false;

function resetGame() {
  if (confirm("Are you sure you want to reset your scam empire?")) {
    isResetting = true;
    clearInterval(autoScamInterval); // stop auto-clicks
    clearInterval(autoSaveInterval);
    localStorage.clear();

    setTimeout(() => {
      location.reload();
    }, 200); // short delay to prevent re-saving
  }
}

// Example: when button is clicked
  gameState.money += gameState.moneyGained;
  gameState.rawScams += 1;
  saveGame();
  updateUI();

// Optional: auto-save every 10 seconds
setInterval(saveGame, 10000);