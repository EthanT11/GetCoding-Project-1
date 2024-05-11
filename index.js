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

  
  
class Enemy {
    constructor(hp, damage, dice, name) {
        this.hp = hp;
        this.damage = damage;
        this.dice = dice;
        this.name = name;
    }
    update(enemyAction = "Action") {
        var getEnemyAction = document.getElementById("enemy-action");
        var getEnemyHp = document.getElementById("enemy-hp");

        getEnemyAction.innerHTML = enemyAction;
        getEnemyHp.innerHTML = this.hp;
    }
    attack(player){
        return player -= this.damage;
    }
}
class Player {
    constructor(hp, damage, dice, name) {
        this.hp = hp;
        this.damage = damage;
        this.dice = dice;
        this.name = name;
    }
    update(playerAction = "Action") {
        var getPlayerAction = document.getElementById("player-action");
        var getPlayerHp = document.getElementById("player-hp");

        getPlayerAction.innerHTML = playerAction;
        getPlayerHp.innerHTML = this.hp;
    }
    attack(enemy){
        return enemy -= this.damage;
    }
}

async function gameStart() {
    var gameStart = true;
    var player = new Player(10, 1, 9, "Player"); // Player(HP, Damage, Dice, Name)
    var enemy = new Enemy(10, 1, 9, "Enemy"); // Enemy(HP, Damage, Dice, Name)

    function dice(max) {
        return Math.floor(Math.random() * max + 1);
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    while (gameStart == true) {
        // time in ms
        const waitTime = 500;

        player.update("Ready");
        enemy.update("Ready");
        if (player.hp > 0) {
            if (enemy.hp > 0) {
                player.update();
                enemy.update();
                playerDice = dice(player.dice);
                enemyDice = dice(enemy.dice);

                if (playerDice > enemyDice) {
                    player.update("Attacking");
                    enemy.update("Defending");
                    enemy.hp = player.attack(enemy.hp);
                    await sleep(waitTime);
                    
                }
                if (playerDice < enemyDice) {
                    player.update("Defending");
                    enemy.update("Attacking");
                    player.hp = enemy.attack(player.hp);
                    await sleep(waitTime);
                } 
                if (playerDice == enemyDice) {
                    player.update("Missing");
                    enemy.update("Missing");
                    await sleep(waitTime);
                }
            } else 
            {
                player.update("Victorious");
                enemy.update("Dead");
                sleep(1500);
                return gameOver = true;
            }
        } else 
        {
            player.update("Dead");
            enemy.update("Victorious");
            sleep(1500);
            return gameOver = true;
        }
    }
}
