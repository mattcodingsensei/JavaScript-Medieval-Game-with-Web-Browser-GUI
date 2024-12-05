class Game {
    constructor() {
      this.playerHP = 15;
      this.playerGold = 1000;
      this.silverRing = 0;
      this.monsterHP = 15;
      this.playerWeapon = "Knife";
      this.playerName = "";
      this.playerPotions = ["Red Potion", "Green Potion"];
      this.init();
    }
  
    // Initialize the game and show the starting screen
    init() {
      this.updateStats();
      this.showMessage("Welcome to the Adventure Game! What's your name?");
      this.showChoices([{ text: "Enter your name", action: () => this.setPlayerName() }]);
    }
  
    // Update player stats and monster stats in the GUI
    updateStats() {
      document.getElementById("player-health").textContent = this.playerHP;
      document.getElementById("player-gold").textContent = this.playerGold;
      document.getElementById("player-weapon").textContent = this.playerWeapon;
      document.getElementById("player-potions").textContent = this.playerPotions.join(", ");
      document.getElementById("monster-health").textContent = this.monsterHP;
    }
  
    // Display a message in the game output
    showMessage(message) {
      document.getElementById("game-output").innerHTML = `<p>${message}</p>`;
    }
  
    // Display action buttons dynamically
    showChoices(choices) {
      const choiceContainer = document.getElementById("game-choices");
      choiceContainer.innerHTML = ""; // Clear previous choices
  
      choices.forEach((choice) => {
        const button = document.createElement("button");
        button.textContent = choice.text;
        button.addEventListener("click", choice.action);
        choiceContainer.appendChild(button);
      });
    }
  
    // Set player's name
    setPlayerName() {
      const name = prompt("Enter your name:");
      if (!name || name.trim().length === 0) {
        this.showMessage("Please enter a valid name.");
        return;
      }
      this.playerName = name;
      this.showMessage(`Welcome, ${this.playerName}!`);
      this.townGate();
    }
  
    // Town Gate logic
    townGate() {
      this.showMessage(
        "You arrive at the town gate. A guard is standing in your way. What do you want to do?"
      );
      this.showChoices([
        { text: "Talk to the guard", action: () => this.talkToGuard() },
        { text: "Attack the guard", action: () => this.attackGuard() },
        { text: "Leave", action: () => this.crossRoads() },
      ]);
    }
  
    talkToGuard() {
      if (this.silverRing) {
        this.showMessage(
          "The guard recognizes the silver ring. You are allowed into the town. You win!"
        );
        this.showChoices([]);
      } else {
        this.showMessage(
          "Guard: Sorry, you cannot enter without defeating the dragon and retrieving the cursed ring."
        );
        this.showChoices([{ text: "Back to the gate", action: () => this.townGate() }]);
      }
    }
  
    attackGuard() {
      this.playerHP -= 1;
      this.updateStats();
      if (this.playerHP <= 0) {
        this.showMessage("The guard has defeated you. GAME OVER.");
        this.showChoices([]);
      } else {
        this.showMessage("The guard hits you back, reducing your health.");
        this.showChoices([{ text: "Back to the gate", action: () => this.townGate() }]);
      }
    }
  
    crossRoads() {
      this.showMessage(
        "You stand at a crossroads. Where would you like to go?"
      );
      this.showChoices([
        { text: "Go South", action: () => this.south() },
        { text: "Go North", action: () => this.townGate() },
        { text: "Go East", action: () => this.east() },
        { text: "Go West", action: () => this.west() },
      ]);
    }
  
    south() {
      this.showMessage(
        "You encounter a monster! What do you want to do?"
      );
      this.monsterHP = 15; // Reset monster HP for each encounter
      this.updateStats();
      this.showChoices([
        { text: "Fight the monster", action: () => this.fight() },
        { text: "Use a potion", action: () => this.usePotion() },
        { text: "Run away", action: () => this.crossRoads() },
      ]);
    }
  
    fight() {
      const playerDamage =
        this.playerWeapon === "Knife"
          ? 1 + Math.floor(Math.random() * 5)
          : 1 + Math.floor(Math.random() * 12);
      this.monsterHP -= playerDamage;
      this.showMessage(
        `You attacked the monster and dealt ${playerDamage} damage!`
      );
  
      if (this.monsterHP <= 0) {
        this.silverRing = 1;
        this.showMessage(
          "You have defeated the monster and gained the cursed ring!"
        );
        this.updateStats();
        this.showChoices([{ text: "Back to the crossroads", action: () => this.crossRoads() }]);
      } else {
        this.monsterAttacks();
      }
    }
  
    monsterAttacks() {
      const monsterDamage = 1 + Math.floor(Math.random() * 5);
      this.playerHP -= monsterDamage;
      this.updateStats();
      if (this.playerHP <= 0) {
        this.showMessage("The monster has defeated you. GAME OVER.");
        this.showChoices([]);
      } else {
        this.showMessage(
          `The monster attacked you for ${monsterDamage} damage.`
        );
        this.showChoices([
          { text: "Attack again", action: () => this.fight() },
          { text: "Use a potion", action: () => this.usePotion() },
          { text: "Run away", action: () => this.crossRoads() },
        ]);
      }
    }
  
    usePotion() {
      if (this.playerPotions.length === 0) {
        this.showMessage("You have no potions left!");
        this.showChoices([
          { text: "Attack", action: () => this.fight() },
          { text: "Run away", action: () => this.crossRoads() },
        ]);
        return;
      }
  
      const potion = prompt(`Which potion do you want to use? ${this.playerPotions.join(", ")}`);
      if (potion === "Red Potion") {
        this.playerHP += 5;
        this.playerPotions = this.playerPotions.filter((p) => p !== "Red Potion");
      } else if (potion === "Green Potion") {
        this.playerHP += 15;
        this.playerPotions = this.playerPotions.filter((p) => p !== "Green Potion");
      } else {
        this.showMessage("Invalid potion choice.");
        return this.usePotion();
      }
  
      this.updateStats();
      this.showMessage(`You used a ${potion} and restored health!`);
      this.showChoices([
        { text: "Attack", action: () => this.fight() },
        { text: "Run away", action: () => this.crossRoads() },
      ]);
    }
  
    east() {
      this.showMessage(
        "You find a peaceful spot. There's a green potion here. What do you want to do?"
      );
      this.showChoices([
        { text: "Take the potion", action: () => this.takePotion() },
        { text: "Go back", action: () => this.crossRoads() },
      ]);
    }
  
    takePotion() {
      if (!this.playerPotions.includes("Green Potion")) {
        this.playerPotions.push("Green Potion");
        this.updateStats();
      }
      this.showMessage("You take the green potion and feel stronger.");
      this.showChoices([{ text: "Go back", action: () => this.crossRoads() }]);
    }
  
    west() {
      this.showMessage(
        "You find a shop. You can buy a sword for 1000 gold. What do you do?"
      );
      this.showChoices([
        { text: "Buy the sword", action: () => this.buySword() },
        { text: "Leave", action: () => this.crossRoads() },
      ]);
    }
  
    buySword() {
      if (this.playerGold >= 1000) {
        this.playerGold -= 1000;
        this.playerWeapon = "Sword";
        this.updateStats();
        this.showMessage("You buy a sword!");
      } else {
        this.showMessage("You don't have enough gold!");
      }
      this.showChoices([{ text: "Back to the crossroads", action: () => this.crossRoads() }]);
    }
  }
  
  // Start the game
  new Game();
  