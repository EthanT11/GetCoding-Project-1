// Show dropdown menu
function dropDown() {
    document.getElementById("myDropdown").classList.toggle("show");
  }
  
  // Close dropdown menu
  window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
      var dropdowns = document.getElementsByClassName("dropdown-content");
      var i;
      for (i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
        }
      }
    }
  }


  function updateCharacters(paction, eaction) {
    player.update(paction)
    enemy.update(eaction)
  }

  
  
class Enemy {
    constructor(hp, damage, dice, name) {
        this.hp = hp;
        this.damage = damage;
        this.dice = dice;
        this.name = name;
    }
    // Update HP and Action on UI
    update(enemyAction = "Action") {
        var getEnemyAction = document.getElementById("enemy-action");
        var getEnemyHp = document.getElementById("enemy-hp");
        var getEnemyName = document.getElementById("enemy-name");

        getEnemyAction.innerHTML = enemyAction;
        getEnemyHp.innerHTML = this.hp;
        getEnemyName.innerHTML = this.name;
    }
    attack(playerHp){
        return playerHp -= this.damage;
    }
}
class Player {
    constructor(hp, damage, block, dice, name) {
        this.hp = hp;
        this.damage = damage;
        this.dice = dice;
        this.name = name;
        this.block = block;
    }
    // Update HP and Action on UI
    update(playerAction = "Action") {
        var getPlayerAction = document.getElementById("player-action");
        var getPlayerHp = document.getElementById("player-hp");
        var getPlayerName = document.getElementById("player-name");

        getPlayerAction.innerHTML = playerAction;
        getPlayerHp.innerHTML = this.hp;
        getPlayerName.innerHTML = this.name;
    }
    attack(enemyHp) {
        return enemyHp -= this.damage;
    }
}

// TODO: Use classes for gameStart = true
// Add randomization to starting stats?
function setClass(clicked_id) {
    if (clicked_id == "fight-button") {
        var player = new Player(12, 2, 4, 9, "Fighter"); // Player(HP, Damage, Block, Dice, Name)
        player.update("Ready")
        console.log(player);
    }
    if (clicked_id == "range-button") {
        var player = new Player(10, 3, 11, "Ranger"); // Player(HP, Damage, Block, Dice, Name)
        player.update("Ready")
        console.log(player);
    }
    if (clicked_id == "mage-button") {
        var player = new Player(8, 4, 13, "Mage"); // Player(HP, Damage, Block, Dice, Name)
        player.update("Ready")
        console.log(player);
    }
}

var enemy = new Enemy(10, 5, 9, "Goblin"); // Enemy(HP, Damage, Dice, Name)
enemy.update("Ready")

function fight() {
    enemy.hp = player.attack(enemy.hp)
    updateCharacters("Slashing", "Grunts")
    if (enemy.hp <= 0) {
        console.log("You win!")
    } else 
    {
        player.hp = enemy.attack(player.hp)
        updateCharacters("Stumbles", "Bites")
        if (player.hp <= 0) {
            console.log("You died!")
        }
    }
}

function block () {
    updateCharacters("Blocking", "Biting")
    var blocked = player.block - enemy.damage
    if(blocked >= 0) {
        console.log("Fully Blocked\n Damage Blocked: " + enemy.damage)
    }
    if(blocked < 0 && player.hp > 0) {
        console.log("Partially Blocked\n Damage Taken: " + blocked)
        player.hp = enemy.attack(player.hp + player.block)
    } else
    {
        console.log("You're dead")
    }

}

function stun () {
    console.log("Stunned ya!")
}

function dice(max) {
    return Math.floor(Math.random() * max + 1);
}

// main loop
// async function gameStart() {
//     var gameStart = true;

//     function sleep(ms) {
//         return new Promise(resolve => setTimeout(resolve, ms));
//     }






    // while (gameStart == true) {
    //     // time in ms
    //     const waitTime = 500;
    
    //     player.update("Ready");
    //     enemy.update("Ready");
    //     gameStart = false;
        // if (player.hp > 0) {
        //     if (enemy.hp > 0) {
        //         player.update();
        //         enemy.update();
        //         playerDice = dice(player.dice);
        //         enemyDice = dice(enemy.dice);

        //         if (playerDice > enemyDice) {
        //             player.update("Attacking");
        //             enemy.update("Defending");
        //             enemy.hp = player.attack(enemy.hp);
        //             await sleep(waitTime);
                    
        //         }
        //         if (playerDice < enemyDice) {
        //             player.update("Defending");
        //             enemy.update("Attacking");
        //             player.hp = enemy.attack(player.hp);
        //             await sleep(waitTime);
        //         } 
        //         if (playerDice == enemyDice) {
        //             player.update("Missing");
        //             enemy.update("Missing");
        //             await sleep(waitTime);
        //         }
        //     } else 
        //     {
        //         player.update("Victorious");
        //         enemy.update("Dead");
        //         sleep(1500);
        //         return gameOver = true;
        //     }
        // } else 
        // {
        //     player.update("Dead");
        //     enemy.update("Victorious");
        //     sleep(1500);
        //     return gameOver = true;
        // }
    // }
// }
