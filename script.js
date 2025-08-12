let popupsEnabled = true;

const scamTargets = [
  {
    name: "Grandma",
    moneyPool: [1, 5],
    description: "She just wanted to forward a chain email. Now she's funding your empire.",
    scamsRequired: 0
  },
  {
    name: "Influencer",
    moneyPool: [5, 15],
    description: "Too busy promoting detox tea to notice the scam in her DMs.",
    scamsRequired: 500
  },
  {
    name: "Startup Bro",
    moneyPool: [25, 75],
    description: "He clicked your link thinking it was a pitch deck. Oops.",
    scamsRequired: 1000
  },
  {
    name: "CEO",
    moneyPool: [100, 200],
    description: "He outsourced his cybersecurity to interns. You outsourced his wallet to yourself.",
    scamsRequired: 2500
  },
  {
    name: "Politician",
    moneyPool: [450, 1000],
    description: "Campaign funds mysteriously rerouted to your offshore account. Democracy!",
    scamsRequired: 5000
  },
  {
    name: "The Government",
    moneyPool: [1000, 2000],
    description: "They thought it was a tax refund. Now you're funding your own surveillance state",
    scamsRequired: 10000
  },
  {
    name: "The President",
    moneyPool: [2500, 5000],
    description: "He thought it was a diplomatic email. Now you're the one with the nuclear codes.",
    scamsRequired: 25000
  },
  {
    name: "Elon Musk",
    moneyPool: [10000, 100000],
    description: "He thought it was a SpaceX recommendation. Now you're the one with a billion-dollar Rocket Ship.",
    scamsRequired: 100000
  }
];

document.getElementById("togglePopups").addEventListener("click", () => {
  popupsEnabled = !popupsEnabled;
  const btn = document.getElementById("togglePopups");
  btn.textContent = popupsEnabled ? "💬 Disable Popups" : "💬 Enable Popups";
});

function updateTargetDisplay() {
  const currentTarget = scamTargets[gameState.currentTargetIndex];

  document.getElementById("targetDisplay").innerHTML = `
    <div class="target-box">
      <h3>🎯 Target: ${currentTarget.name}</h3>
      <p>${currentTarget.description}</p>
      <p>💰 Base Money: $${currentTarget.moneyPool[0]} - $${currentTarget.moneyPool[1]}</p>
      <div id="progressContainer">
        <div id="progressBar"></div>
      </div>
      <p id="scamProgressText">Scams until next target: ${1000 - (gameState.rawScams % 1000)}</p>
    </div>`;
}

document.getElementById("prestigeButton").addEventListener("click", prestige);

function updatePrestigeStats() {
  document.getElementById("prestigeStats").innerHTML = `
    <p>Current Scams: ${gameState.rawScams}</p>
    <p>Scams required for next prestige: ${gameState.scamsUntilPrestige}</p>
    <p>Current Prestige Multiplier: ${gameState.prestigeMultiplier}x</p>
  `;
}

function prestige() {
    console.log("Prestige button clicked!")
  if (gameState.rawScams >= gameState.scamsUntilPrestige) {
    console.log("Prestiging!");
    gameState.money = 0;
    gameState.moneyGained = 0;
    gameState.upgradeLevel = 0;
    gameState.rawScams = 0;
    gameState.upgradeCost = 50;
    gameState.upgrade2Cost = 250;
    gameState.upgrade3Cost = 1250;
    gameState.upgrade4Cost = 5000;
    gameState.upgrade5Cost = 25000;
    gameState.scamsPerScam = 1
    gameState.clickspersec = 0;
    gameState.scamsPerSecond = 0;
    gameState.currentTargetIndex = 0;
    gameState.minMoney = 1;
    gameState.maxMoney = 5;
    gameState.targetProgress = 0;
    gameState.upgMinMoney = 0;
    gameState.upgMaxMoney = 0;

      // Increase prestige multiplier
    gameState.prestigeMultiplier += 0.5; // 0.5 increase
    gameState.scamsUntilPrestige *= 2; // Double the requirement for next prestige

    gameState.prestiges += 1; // Increment prestige count

    saveGame();
    updateUI();
    updateTargetDisplay();
    updateScamProgressText();
    updatePrestigeStats();
    updateAutoScamLoop();
    updateUpgText();
    updateProgressBar();
  }
}

function scamClick() {
  const currentTarget = scamTargets[gameState.currentTargetIndex];
  let bonusminmoney = gameState.upgMinMoney
  let bonusmaxmoney = gameState.upgMaxMoney;
  gameState.minMoney = currentTarget.moneyPool[0] + bonusminmoney;
  gameState.maxMoney = currentTarget.moneyPool[1] + bonusmaxmoney;
  const baseGain = getRandomInt(gameState.minMoney, gameState.maxMoney);
  gameState.moneyGained = baseGain * gameState.prestigeMultiplier * gameState.scamsPerScam;
  gameState.money += baseGain * gameState.prestigeMultiplier * gameState.scamsPerScam;
  gameState.rawScams += gameState.scamsPerScam;

  updateProgressBar();
  updateScamProgressText();
  updatePrestigeStats();
  updateStatsDisplay();

  const nextIndex = gameState.currentTargetIndex + 1;
  if (
    nextIndex < scamTargets.length &&
    gameState.rawScams >= scamTargets[nextIndex].scamsRequired
  ) {
    gameState.currentTargetIndex = nextIndex;
    updateTargetDisplay();
  }

  document.querySelector("#money").innerHTML = `you have scammed ${gameState.rawScams} people and have $${formatMoney(gameState.money)}`;

  // Random position within the viewport
if (popupsEnabled) {
  const gainTemplate = document.querySelector("#gainTemplate");
  const gainClone = gainTemplate.cloneNode(true);
  gainClone.style.display = "block";
  gainClone.textContent = "+ $" + formatMoney(gameState.moneyGained);

  const x = Math.random() * window.innerWidth * 0.8;
  const y = Math.random() * window.innerHeight * 0.6;
  gainClone.style.left = `${x}px`;
  gainClone.style.top = `${y}px`;

  document.body.appendChild(gainClone);

  setTimeout(() => {
    gainClone.remove();
  }, 1000);
}
  saveGame();
  updateUI();
}

function buyUpgrade() {
  if (gameState.money >= gameState.upgradeCost) {
    gameState.money -= gameState.upgradeCost;
    gameState.upgMinMoney += 1;
    gameState.upgMaxMoney += 2;
    gameState.upgradeCost = Math.floor(gameState.upgradeCost * 1.45);

    document.querySelector("#upg1").innerHTML = `📚 Scamming School ($${formatMoney(gameState.upgradeCost)})`;
    document.querySelector("#money").innerHTML = `you have scammed ${gameState.rawScams} people and have $${gameState.money}`;

    saveGame();
    updateUI();
  }
}

function buyUpgrade2() {
  if (gameState.money >= gameState.upgrade2Cost) {
    gameState.money -= gameState.upgrade2Cost;
    gameState.scamsPerSecond++;
    gameState.upgrade2Cost = Math.floor(gameState.upgrade2Cost * 1.45);

    updateAutoScamLoop();
    document.querySelector("#upg2").innerHTML = `🧑‍🎓 Hire Apprentice ($${formatMoney(gameState.upgrade2Cost)})`;
    document.querySelector("#money").innerHTML = `you have scammed ${gameState.rawScams} people and have $${gameState.money}`;

    saveGame();
    updateUI();
  }
}

function buyUpgrade3() {
  if (gameState.money >= gameState.upgrade3Cost) {
    gameState.money -= gameState.upgrade3Cost;
    gameState.upgMinMoney = Math.floor(gameState.upgMinMoney * 1.5);
    gameState.upgMaxMoney = Math.floor(gameState.upgMaxMoney * 1.5);
    gameState.scamsPerSecond += 5;
    gameState.upgrade3Cost = Math.floor(gameState.upgrade3Cost * 2.5);

    updateAutoScamLoop();
    document.querySelector("#upg3").innerHTML = `🏢 Scamming Offices ($${formatMoney(gameState.upgrade3Cost)})`;
    document.querySelector("#money").innerHTML = `you have scammed ${gameState.rawScams} people and have $${formatMoney(gameState.money)}`;

    saveGame();
    updateUI();
  }
}

function buyUpgrade4() {
  if (gameState.money >= gameState.upgrade4Cost) {
    gameState.money -= gameState.upgrade4Cost;
    gameState.upgMinMoney = Math.floor(gameState.upgMinMoney * 2);
    gameState.upgMaxMoney = Math.floor(gameState.upgMaxMoney * 2);
    gameState.scamsPerSecond += 5;
    gameState.upgrade4Cost = Math.floor(gameState.upgrade4Cost * 2.95);

    updateAutoScamLoop();
    document.querySelector("#upg4").innerHTML = `🏦 Scamming Corporation ($${formatMoney(gameState.upgrade4Cost)})`;
    document.querySelector("#money").innerHTML = `you have scammed ${gameState.rawScams} people and have $${formatMoney(gameState.money)}`;

    saveGame();
    updateUI();
  }
}

function buyUpgrade5() {
  if (gameState.money >= gameState.upgrade5Cost) {
    gameState.money -= gameState.upgrade5Cost;

    gameState.scamsPerScam++;
    gameState.upgrade5Cost = Math.floor(gameState.upgrade5Cost * 3.15);

    updateAutoScamLoop();
    document.querySelector("#upg5").innerHTML = `💰 Multitasking Employees ($${formatMoney(gameState.upgrade5Cost)})`;
    document.querySelector("#money").innerHTML = `you have scammed ${gameState.rawScams} people and have $${formatMoney(gameState.money)}`;

    saveGame();
    updateUI();
  }
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

let autoScamInterval;
let clearGainTimeout;

function updateAutoScamLoop() {
  if (autoScamInterval) clearInterval(autoScamInterval);

  if (gameState.scamsPerSecond > 0) {
    autoScamInterval = setInterval(() => {
      scamClick();
    }, 1000 / gameState.scamsPerSecond);
  }
}

function updateProgressBar() {
  const maxTier = scamTargets.length - 1;
  if (gameState.currentTargetIndex >= maxTier) {
    document.getElementById("progressBar").style.width = "100%";
    return;
  }

  const nextTarget = scamTargets[gameState.currentTargetIndex + 1];
  const currentThreshold = scamTargets[gameState.currentTargetIndex].scamsRequired;
  const progressPercent = ((gameState.rawScams - currentThreshold) / (nextTarget.scamsRequired - currentThreshold)) * 100;
  document.getElementById("progressBar").style.width = Math.min(progressPercent, 100) + "%";
}

function updateScamProgressText() {
  const maxTier = scamTargets.length - 1;
  if (gameState.currentTargetIndex >= maxTier) {
    document.getElementById("scamProgressText").textContent = "Final target reached!";
    return;
  }

  const nextTarget = scamTargets[gameState.currentTargetIndex + 1];
  const scamsLeft = nextTarget.scamsRequired - gameState.rawScams;
  document.getElementById("scamProgressText").textContent = `Scams until next target: ${scamsLeft}`;
  gameState.targetProgress = scamsLeft;
  saveGame();
}

function updateStatsDisplay() {
    document.getElementById("scamsPerSecondStat").textContent = `Scams per second: ${gameState.scamsPerSecond}`;
    document.getElementById("scamsPerScamStat").textContent = `Scams per scam: ${gameState.scamsPerScam}`;
    document.getElementById("prestigeAmountStat").textContent = `Prestiges: ${gameState.prestiges}`;
}

function updateUpgText() {
    document.querySelector("#upg1").innerHTML = `📚 Scamming School ($${formatMoney(gameState.upgradeCost)})`;
    document.querySelector("#upg2").innerHTML = `🧑‍🎓 Hire Apprentice ($${formatMoney(gameState.upgrade2Cost)})`;
    document.querySelector("#upg3").innerHTML = `🏢 Scamming Offices ($${formatMoney(gameState.upgrade3Cost)})`;
    document.querySelector("#upg4").innerHTML = `🏦 Scamming Corporation ($${formatMoney(gameState.upgrade4Cost)})`;
    document.querySelector("#upg5").innerHTML = `💰 Multitasking Employees ($${formatMoney(gameState.upgrade5Cost)})`;
}

function formatMoney(value) {
  if (value >= 1_000_000_000_000_000_000_000_000_000_000_000) return (value / 1_000_000_000_000_000_000_000_000_000_000_000).toFixed(2) + "Dec";
  if (value >= 1_000_000_000_000_000_000_000_000_000_000) return (value / 1_000_000_000_000_000_000_000_000_000_000).toFixed(2) + "Non";
  if (value >= 1_000_000_000_000_000_000_000_000_000) return (value / 1_000_000_000_000_000_000_000_000_000).toFixed(2) + "Oct";
  if (value >= 1_000_000_000_000_000_000_000_000) return (value / 1_000_000_000_000_000_000_000_000).toFixed(2) + "Sp";
  if (value >= 1_000_000_000_000_000_000_000) return (value / 1_000_000_000_000_000_000_000).toFixed(2) + "Sx";
  if (value >= 1_000_000_000_000_000_000) return (value / 1_000_000_000_000_000_000).toFixed(2) + "Qi";
  if (value >= 1_000_000_000_000_000) return (value / 1_000_000_000_000_000).toFixed(2) + "Qd";
  if (value >= 1_000_000_000_000) return (value / 1_000_000_000_000).toFixed(2) + "T";
  if (value >= 1_000_000_000) return (value / 1_000_000_000).toFixed(2) + "B";
  if (value >= 1_000_000) return (value / 1_000_000).toFixed(2) + "M";
  if (value >= 1_000) return (value / 1_000).toFixed(1) + "k";
  return value.toString();
}

function updateUI() {
  const formattedMoney = formatMoney(gameState.money);
  document.getElementById('money').textContent = `you have scammed ${gameState.rawScams} people and have $${formattedMoney}`;
}

window.onload = () => {
  updateStatsDisplay();
  updateTargetDisplay();
  updateScamProgressText();
  updateUI();
  updateAutoScamLoop();
  updateProgressBar();
  updateUpgText();
  updatePrestigeStats();
};
