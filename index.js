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

// popup
function popUp() {
    var popup = document.getElementById("myPopup");
    popup.classList.toggle("show");
}


// switches active buttons between class and fight menu; boolean
// TODO: try and remove block flag and chooseClass flag
function buttonState(actionState, chooseClass, blockState = blockFlag) {
    var classState;

    classState = !chooseClass ? false : true;
    document.getElementById("fight-button").disabled = classState;
    document.getElementById("range-button").disabled = classState;
    document.getElementById("mage-button").disabled = classState;
    
    blockFlag = blockState;
    document.getElementById("attack-button").disabled = actionState;
    document.getElementById("block-button").disabled = blockFlag;
    document.getElementById("stun-button").disabled = actionState;

    if (stunCounter == 0) {
        document.getElementById("stun-button").innerText = "Stun";
    }
    
}

async function buttonSwitch(time) { // disables buttons then enables them after x time.
    buttonState(true, true, true);
    await sleep(1250)
    buttonState(false, true, false);
}

// toggles spell book visibility
function openSpellBook() {
    var getSpellbook = document.getElementById("spellContainer");
    if (getSpellbook.hidden) {
        getSpellbook.hidden = false;
    } else {
        getSpellbook.hidden = true;
    }
}

// -- Game Functions --


// init
var player;
var enemy;
var chooseClass = false;

var winCounter = 0;
var winsNeeded = 3;

var stunCounter = 0;
var stunFlag = false;

var blockCounter = 0;
var blockFlag = false;

var spellData = {};
var mageFlag = false;

var turnCounter = 0;
var rangerFlag = false;
var setRanger;

var ENEMYDAM = 2; // for testing; enemy damage
var WAITTIME = 1000; // change enemy gen time

// TODO: Maybe add the flags to the player constructor?? Might cause a lot of issues
class Player {
    constructor(max_hp, hp, max_mp, mp, damage, block, name) {
        this.max_hp = max_hp;
        this.hp = hp;
        this.max_mp = max_mp;
        this.mp = mp;
        this.damage = damage;
        this.block = block;
        this.name = name;

        this.mage = mageFlag;
        this.ranger = rangerFlag;
        if (this.ranger) {
            setRanger = true;
        }
    }
    
    // Update HP and Action on UI
    update(playerAction) {
        // get player menu container elements
        var getAttackButton = document.getElementById("attack-button");
        var getBlockButton = document.getElementById("block-button");
        var getSpellButton = document.getElementById("spell-book");
        var getSpellContainer = document.getElementById("spellContainer");
        
        this._updateContainer(playerAction);
        this._updateStats();
        
        // show spellbook if mage is true
        if (this.mage && this.name == "Mage") {
            getSpellButton.disabled = false;
        } else {
            getSpellButton.disabled = true;
            getSpellContainer.hidden = true;
        }
        
        // set amount of actions to 2
        // TODO: try and use turnCounter for stun instead? 
        if (this.ranger && this.name == "Ranger") {
            if (setRanger) {
                getAttackButton.innerHTML = "Quick Atk";
                turnCounter = 1;
                setRanger = false;
            }
        }
        
        // check if block button should be active based on hp
        if (!blockFlag) {
            if (player.hp < player.max_hp && blockCounter > 0) {
                getBlockButton.disabled = false;
            } else {
                getBlockButton.disabled = true;
            }
        }
    }
    attack(enemyHp) {
        if (this.ranger) {
            var dblDam = dice(2); // TODO: Probably make the chances lower...
            if (dblDam == 2) {
                console.log("DOUBLE DAMAGE!!!!")
                return enemyHp -= this.damage * 2;
            } else {
                return enemyHp -= this.damage;
            }
        } else {
            return enemyHp -= this.damage; // returns enemy hp value
        }
    }
    blockAttack(enemyDam) {
        return this.block - enemyDam;
    }
    _updateContainer(playerAction) {
        // get player container elements
        var getPlayerAction = document.getElementById("player-action");
        var getPlayerHp = document.getElementById("player-hp");
        var getPlayerMp = document.getElementById("player-mp");
        var getPlayerName = document.getElementById("player-name");

        // set player container elements
        getPlayerName.innerHTML = this.name;
        getPlayerHp.innerHTML = `HP: ${this.hp} / ${this.max_hp}`;
        getPlayerMp.innerHTML = `MP: ${this.mp} / ${this.max_mp}`;
        getPlayerAction.innerHTML = playerAction;
    }
    _updateStats() {
        // get player stats container elements
        var getPlayerSClass = document.getElementById("s-class");
        var getPlayerSHp = document.getElementById("s-hp");
        var getPlayerSMp = document.getElementById("s-mp");
        var getPlayerSDamage = document.getElementById("s-dam");
        var getPlayerSBlock = document.getElementById("s-block");
        var getPlayerSWins = document.getElementById("s-wins");
        
        // set player stats container elements
        getPlayerSClass.innerHTML = `Class: ${this.name}`;
        getPlayerSHp.innerHTML = `Max HP: ${this.max_hp}`;
        getPlayerSMp.innerHTML = `Max MP: ${this.max_mp}`;
        getPlayerSDamage.innerHTML = `Damage: ${this.damage}`;
        getPlayerSBlock.innerHTML = `Block: ${this.block}`;
        getPlayerSWins.innerHTML = `Wins: ${winCounter}`;
    }
    
}

// Class for spell creation; takes name, damage, and cost
// Creates a button and places in spell menu
class Spell {
    constructor(name, damage, cost, canStun = false) {
        this.name = name;
        this.damage = damage;
        this.cost = cost;
        this.stun = canStun;

        // create button
        var spellButton = document.createElement("button")
        spellButton.innerText = this.name;
        spellButton.id = this.name;
        spellButton.onclick = spellAttack;
        document.getElementById("spellContainer").appendChild(spellButton);
        
    }
    attack(hp, playerMp) { // returns spelldata[hp, mpleft]
        var hpLeft = hp -= this.damage;
        var mpLeft = playerMp -= this.cost;
        spellData = {
            sname: this.name,
            hpDam: hpLeft,
            mpDam: mpLeft,
            canStun: this.stun,
        };
        return spellData;
    }
    checkCost(playerMp) {
        return playerMp >= this.cost;
    }
}

// spell list
let spells = {
    fireSpell: new Spell("Fire", 4, 4),
    iceSpell: new Spell("Ice", 2, 2),
    earthSpell: new Spell("Earth", 1, 2, true),
    healSpell: new Spell("Heal", -4, 0), // negative damage for healing
}

// main spell function
async function spellAttack(clicked_id) {
    canUse = false;
    spellData = {}; // NOTE: Already set as list in global scope but use this to keep it clear
    clicked_id = clicked_id.srcElement.id;
    
    if (clicked_id == "Fire") { // Maybe burning effect?
        _checkCost(spells.fireSpell, enemy.hp, player.mp);
    } else if (clicked_id == "Ice") { // maybe reduce damage?
        _checkCost(spells.iceSpell, enemy.hp, player.mp);
    } else if (clicked_id == "Earth") { // Damages & chance to stun
        _checkCost(spells.earthSpell, enemy.hp, player.mp)
    } else if (clicked_id == "Heal") {  // Heals player
        canUse = true; // NOTE: leave for testing
        _checkCost(spells.healSpell, player.hp, player.mp);
    }
    
    if (!stunFlag) { // TODO: figure out something better, probably in the update rework
        updateCharacters(`${clicked_id}!`, "Ouch!");
    } else {
        updateCharacters(`${clicked_id}!`, `*Stunned* (${stunCounter})`);
    }
    
    if (!canUse) { // check if player has enough mp
        console.log("not enough mp")
    } else {
        _castSpell();
    }
    // helper funcs
    function _castSpell() {
        if (clicked_id == "Heal"){ // TODO: rework heal, quickly threw it together to help testing
            player.hp = spellData.hpDam;
            player.mp = spellData.mpDam;
            enemyAttack();
            checkVictory();
        } else {
            if (spellData.canStun == true) { // check if spell can stun
                stunEnemy();
            }
            enemy.hp = spellData.hpDam;
            player.mp = spellData.mpDam;
            enemyAttack();
            checkVictory();
        }
    }
    function _checkCost(spell, hp, mp) {  // check if spell can be used
        var check = spell.checkCost(player.mp);
        if (check) {
            canUse = true;
            spell.attack(hp, mp);
            console.log(spellData)
        }
    }
}


class Enemy {
    constructor(max_hp, hp, damage, name) {
        this.max_hp = max_hp;
        this.hp = hp;
        this.damage = damage;
        this.name = name;
    }
    // Update HP and Action on UI
    update(enemyAction = "Action") {
        var getEnemyAction = document.getElementById("enemy-action");
        var getEnemyHp = document.getElementById("enemy-hp");
        var getEnemyName = document.getElementById("enemy-name");

        var getEnemySName = document.getElementById("e-class");
        var getEnemySHp = document.getElementById("e-hp")
        var getEmemySDam = document.getElementById("e-dam")
        
        getEnemyAction.innerHTML = enemyAction;
        getEnemyHp.innerHTML = `HP: ${this.hp} / ${this.max_hp}`;
        getEnemyName.innerHTML = this.name;

        getEnemySName.innerHTML = `Class: ${this.name}`;
        getEnemySHp.innerHTML = `Max HP: ${this.max_hp}`;
        getEmemySDam.innerHTML = `Damage: ${this.damage}`;

    }
    attack(playerHp) {
        return playerHp -= this.damage; // returns player hp value
    }
}

// add randomness to amounts dependent on difficulty?
// amounts dependent on class?
// TODO: Accumulate levels if never choosen? OR disable menu buttons until a choice is made
async function levelUp(clicked_id) {
    var getLevelUp = document.getElementById("levelContainer");
    var getBlockButton = document.getElementById("block-button");
    console.log("Level Up!");
    getLevelUp.hidden = true;

    if (clicked_id == "first-choice") {
        player.max_hp += 2;
        player.max_mp += 2;
        player.damage += 2;
        player.block += 2;
        player.update("I'm feeling strong!")
    } else if (clicked_id == "second-choice") {
        player.hp = player.max_hp;
        player.mp = player.max_mp;
        player.update("I'm feeling healthy!")
    } else if (clicked_id == "third-choice") {
        blockCounter = 5;
        getBlockButton.innerText = `Block (${blockCounter})`
        player.update("Neat! A shield!")
    }
    buttonSwitch(2000);
    player.update("Ready")
}

// generate random number between 1 and x
function dice(max) {
    return Math.floor(Math.random() * max) + 1;
}

// adds delay
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// generate random enemy
// TODO: Add variety for different levels and different names
// idea: use winCounter to adjust "difficulty"
async function genEnemy() {
    var MAX_HP = dice(10) + 10;
    var HP = MAX_HP;
    // var DAM = dice(2) + dice(2) + 1;
    var DAM = ENEMYDAM; // for testing
    var NAME = "Goblin";

    buttonState(true, true, true);
    player.mage = false; // turn off spellbook; figure out something better
    
    updateCharacters("Ready", "Searching for foes...");
    await sleep(WAITTIME);
    enemy = new Enemy(MAX_HP, HP, DAM, NAME);
    buttonState(false, true, false);
    player.mage = true; // turn spellbook back on
    updateCharacters("Ready", "Ready");
}

// choose class based on button clicked
function setClass(clicked_id) {
    var MAX_HP = [12, 10, 8];
    var MAX_MP = [8, 10, 12];
    var DAMAGE = [2, 3, 4];
    var BLOCK = [4, 3, 2];
    var NAME = ["Fighter", "Ranger", "Mage"];
    
    if (!chooseClass) {
        if (clicked_id == "fight-button") {
            player = new Player(MAX_HP[0], MAX_HP[0], MAX_MP[0], MAX_MP[0], DAMAGE[0], BLOCK[0], NAME[0]); // Player(MAX-HP, HP, Damage, Block, Name)
        }
        if (clicked_id == "range-button") {
            rangerFlag = true;
            player = new Player(MAX_HP[1], MAX_HP[1], MAX_MP[1], MAX_MP[1], DAMAGE[1], BLOCK[1], NAME[1]); // Player(MAX-HP, HP, Damage, Block, Name)
        }
        if (clicked_id == "mage-button") {
            mageFlag = true;
            player = new Player(MAX_HP[2], MAX_HP[2], MAX_MP[2], MAX_MP[2], DAMAGE[2], BLOCK[2], NAME[2]); // Player(MAX-HP, HP, Damage, Block, Name)
        }
        genEnemy();
    } else {
        return console.log("Already picked a class");
    }
}

// general update player/enemy UI, takes actions as str. "Attacking", "Defending"
function updateCharacters(p_action, e_action) {
    player.update(p_action);
    enemy.update(e_action);
}

// TODO: hit enemy for half damage on success & 1.5 of gob damage to player on fail?
function stunEnemy() {
    var getStunButton = document.getElementById("stun-button");
    var d4 = dice(4);
    var d2 = dice(2) + 1;
    
    if (d4 >= 3) { // pass check
        stunFlag = true;
        stunCounter = d2;
        getStunButton.disabled = true;
        getStunButton.innerHTML = `Stun (${stunCounter})`
        enemy.update(`*Stunned* (${stunCounter})`)
    } else if (d4 <= 2) { // fail check
        enemyAttack();
        console.log("Failed Stun")
    }
}

function checkStun() {
    var getStunButton = document.getElementById("stun-button");
    if (!stunFlag) {} else {
        stunCounter --;
        getStunButton.innerHTML = `Stun (${stunCounter})`
        enemy.update(`*Stunned* (${stunCounter})`)
        if (stunCounter == 0) {
            stunFlag = false;
            getStunButton.disabled = false;
            getStunButton.innerHTML = "Stun";
        }
    }
}
// enemy attack
function enemyAttack() {
    if (player.hp > 0 && enemy.hp > 0 && !stunFlag) {
        player.hp = enemy.attack(player.hp);
        updateCharacters("Flinches in pain", "Bites");
    } 
    if (player.hp <= 0) {
        playerDeath();
    }
    checkStun();
    
    async function playerDeath() { // as of now the enemy attacking is the only way to die
        var getLevelUp = document.getElementById("levelContainer");
    
        getLevelUp.hidden = true;
        updateCharacters("Piles of bones", "Victory laugh");
        buttonState(true, true, true);
        await sleep(4000);
        newGame();
    }
}

// attack button; increments winCounter each win
async function attackEnemy() {
    if (enemy.hp > 0) {
        enemy.hp = player.attack(enemy.hp);
        _textCheck();
        buttonSwitch(1250);
        
        if (turnCounter > 0) {
            turnCounter --;
        } else {
            if (player.ranger) {
                turnCounter = 1;
            }
            enemyAttack();
        }
    } 
    checkVictory();

    function _textCheck() { // change text depending on class
        var ptext;
        var etext = "*Winces*";
        switch(player.name) {
            case "Fighter":
                ptext = "Slashes!"
                break;
            case "Ranger":
                ptext = "Shoots Arrow!"
                break;
            case "Mage":
                ptext = "Staff bash!"
                break;
        }
        updateCharacters(`${ptext}`, `${etext}`)
    }
}

async function checkVictory() {
    if (enemy.hp <= 0) { // check if enemyhp is 0. Level up & load next enemy
        var getLevelUp = document.getElementById("levelContainer");
        winCounter ++;
        player.mage = false;

        buttonState(true, true, true);
        updateCharacters("Victory Dance", "Pile of bones");
        if (winCounter < winsNeeded) {
            getLevelUp.hidden = false;
            
            await sleep(3000)
            genEnemy();
        } else { // victory condition
            getLevelUp.hidden = true;
            buttonState(true, false, true);
            player.mage = false;
            player.update("I win!!");
            await sleep(6000);
            newGame();
        }
    }
}

async function blockEnemy() {
    var getBlockButton = document.getElementById("block-button");
    var blocked = player.blockAttack(enemy.damage); // player.block - enemy.damage -> 4 - 2
    var healCheck = player.hp + blocked;
    if (blockCounter > 0) {
        if (blocked >= 0) { // if greater than 0 heal for the amount
            if (healCheck >= player.max_hp) { // check if hp would be greater then max
                player.hp = player.max_hp;
            } 
            else {
                player.hp += blocked;
            }
            player.update(`You blocked all damage`);
        } else if (blocked < 0) {
            player.hp += blocked;
            player.update(`Blocked ${enemy.damage} Damage`);
            if (player.hp <= 0) {
                playerDeath();
            }
        }
        blockCounter --;
        getBlockButton.innerText = `Block (${blockCounter})`;
    } else {
        player.update("Your shield is broke!");
        getBlockButton.innerText = "*Broken*";
        getBlockButton.disabled = true;
    }
}

function newGame() { // reset game state
    winCounter = 0;
    stunCounter = 0;
    blockCounter = 5;
    stunFlag = false;
    mageFlag = false;
    player = new Player("?", "?", "?", "?", "?", "?", "...");
    enemy = new Enemy("?", "?", "?", "...");
    updateCharacters("Choose Class", "Awaiting player choice");
    buttonState(true, false, true);
}

// starts new game on page load
newGame();
