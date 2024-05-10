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


function getHit() {
    var hp = 10;
    while (hp > 0) {
        hp -= 1;
        console.log("Ouch!" + "\n HP: " + hp);
    }
}

class Player {
    constructor(hp, xp) {
        this.hp = hp
        this.xp = xp
    }
}

async function gameStart(bool) {
    var gameStart = bool;
    var playerHp = 10;
    var enemyHp = 10;
    var filler = "\n-------------\n"

    function dice(max) {
        return Math.floor(Math.random() * max);
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function playerAttack() {
        console.log(filler)
        console.log("Player attacks Monster!");
        console.log(filler)
        await sleep(1000)
        console.log("You hit!\n " + playerDice + " VS " + enemyDice);
        enemyHp -= 1;
        console.log("Enemy\nHP: " + enemyHp);
    }

    async function enemyAttack() {
        console.log(filler)
        console.log("Monster attacks Player!");
        console.log(filler)
        await sleep(1000)
        console.log("It hit!\nPlayerDice: " + playerDice + " VS EnemyDice: " + enemyDice);
        playerHp -= 1;
        console.log("Player\nHP: " + playerHp);
    }

    while (gameStart == false) {
        if (playerHp > 0) {
            if (enemyHp > 0) {
                playerDice = dice(10);
                enemyDice = dice(10);
                if (playerDice > enemyDice) {
                    playerAttack()
                }
                if (playerDice < enemyDice) {
                    enemyAttack()
                } 
                if (playerDice == enemyDice) {
                    console.log(filler)
                    console.log("You both missed...");
                    console.log(filler)
                    await sleep(1000)
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

gameStart(false)