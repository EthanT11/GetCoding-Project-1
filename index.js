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

class Player {
    constructor(hp, damage) {
        this.hp = hp;
        this.damage = damage;
    }
}


class Enemy {
    constructor(hp, damage) {
        this.hp = hp;
        this.damage = damage;
    }
}

async function gameStart(bool) {
    var gameStart = bool;
    var enemy = new Enemy(10, 1);
    var player = new Player(10, 1);
    var playerHp = player.hp;
    var enemyHp = enemy.hp;

    function updateAction(player, enemy) {
        var getPlayerAction = document.getElementById("player-action")
        var getEnemyAction = document.getElementById("enemy-action")

        getPlayerAction.innerHTML = player
        getEnemyAction.innerHTML = enemy
    }

    function update() {
        var getPlayerHp = document.getElementById("player-hp");
        var getEnemyHp = document.getElementById("enemy-hp");

        getPlayerHp.innerHTML = playerHp;
        getEnemyHp.innerHTML = enemyHp;
    }

    function playerAttack() {
        enemyHp -= player.damage;
    }

    function enemyAttack() {
        playerHp -= enemy.damage;
    }

    function dice(max) {
        return Math.floor(Math.random() * max);
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    while (gameStart == true) {
        if (playerHp > 0) {
            if (enemyHp > 0) {
                update();
                playerDice = dice(10);
                enemyDice = dice(10);
                if (playerDice > enemyDice) {
                    var pStatus = "Attacking"
                    var eStatus = "Defending"
                    updateAction(pStatus, eStatus)
                    playerAttack();
                    await sleep(1000);
                    
                }
                if (playerDice < enemyDice) {
                    var pStatus = "Defending"
                    var eStatus = "Attacking"
                    updateAction(pStatus, eStatus)
                    enemyAttack();
                    await sleep(1000);
                } 
                if (playerDice == enemyDice) {
                    updateAction("Missing", "Missing")
                    await sleep(1000);
                }
            } else 
            {
                console.log("You did it!");
                return gameOver = true;
            }
        } else 
        {
            console.log("You are dead");
            return gameOver = true;
        }
    }
}

gameStart(true)