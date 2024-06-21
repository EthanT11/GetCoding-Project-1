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

// popups
// TODO: Maybe merge into one and pass clicked id as arg
// put into a switch case?

// Adds closing button to popups
function genButton(popup) {
    const button = document.createElement("button")
    button.classList.add("closebtn")
    button.onclick = _close;
    popup.append(button)
    function _close() {
        popup.classList.toggle("show")
    }
}

// TODO: Fix stats popup close button from being in the middle
// pretty sure its appending itself to the last made div holding
// the enemy container
function popUp() {
    const popup = document.getElementById("statsPopup");
    genButton(popup)
    popup.classList.toggle("show");
}

function classPopup() {
    const popup = document.getElementById("classPopup");
    popup.classList.toggle("show");
}

function saPopup() {
    let popup;
    if (player.name == "Mage") {
        popup = document.getElementById("spellPopup");
    } else {
        popup = document.getElementById("abilPopup");
    }
    genButton(popup)
    popup.classList.toggle("show");
}

function levelPopup() {
    const popup = document.getElementById("levelPopup");
    popup.classList.toggle("show");
}


function helpPopup() {
    const popup = document.getElementById("helpPopup");
    popup.innerHTML = "";
    genButton(popup);
    _genHeader();
    _genText();
    popup.classList.toggle("show");

    // create h2 element
    function _genHeader() {
        const h2 = document.createElement("h2");
        h2.classList.add("class");
        h2.innerHTML = "How to Play";
        popup.append(h2);
    }

    // create help text
    function _genText() {
        const helpText = 
        `- Choose Class -
    Pick between three classes for your character; Fighter, Ranger, or Mage.

- Objective -
    Get 10 wins in a row.
    Each win highlights a circle below the title.

- Fighting -
    There are three button on the bottom; Attack, Abilities and Stats.
    
    Everytime you attack/use an ability/spell the enemy will attack back!

    Make sure to keep an eye on your Health(Green bar) and for Mages also
    your Magic(blue bar).`;
        popup.append(helpText);
    }
}

// generate level circles
// TODO: Look into just changing the background color property of a class
// rather then just switching ID's
function genLevelCircle() {
    const getProgressCont = document.getElementById("progressContainer");
    let style = "circle";
    
    clearElement("progressContainer");
    for (let i = 0; i < winsNeeded; i++) {
        createCircle = document.createElement("div");
        if (i == winCounter) {
            style = "selectedCircle";
        } else if (i < winCounter) {
            style = "clearedCircle";
        } else {
            style = "circle";
        }
        createCircle.id = style;
        
        getProgressCont.appendChild(createCircle)
    }
    
}

// clears element, takes elementID
function clearElement(element) {
    document.getElementById(element).innerHTML = "";
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

// -- Game Functions --

// init
var player;
var enemy;
var chooseClass = false;

var winCounter = 0;
var winsNeeded = 6;

var stunCounter = 0;
var stunFlag = false;

var blockCounter = 0;
var blockFlag = false;

var spellData = {};
var spellCount;
var spellBookFlag;

var turnCounter = 0;
var rangerFlag = false;
var setRanger;

var ENEMYDAM = 2; // for testing; enemy damage
var WAITTIME = 1000; // change enemy gen time

var actionTextCount = 0;

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
        
        this.ranger = rangerFlag;

        this.textList = [];
        if (this.ranger) {
            setRanger = true;
        }
    }
    
    // Update HP and Action on UI
    update(playerAction, addSub) {
        // get player menu container elements
        var getAttackButton = document.getElementById("attack-button");
        var getBlockButton = document.getElementById("block-button");
        
        this._updateContainer(playerAction, addSub);
        this._updateStats();
        
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
    _updateContainer(playerAction, addSub = false) {
        // get player container elements
        var getPlayerAction = document.getElementById("player-action");
        var getPlayerHp = document.getElementById("player-hp");
        var getPlayerMp = document.getElementById("player-mp");
        var getPlayerName = document.getElementById("player-name");

        // set player container elements
        getPlayerAction.innerHTML = playerAction;
        getPlayerName.innerHTML = this.name;
        getPlayerHp.innerHTML = `${this.hp} / ${this.max_hp}`;
        getPlayerMp.innerHTML = `${this.mp} / ${this.max_mp}`;

        if (addSub == true) {
            this._updateAction(playerAction);
        }   else if (addSub == false) {
            // pass
        }

        this._setMeter("playerHp-meter");
        this._setMeter("playerMp-meter");
    }
    // todo: Smooth out action log, maybe delay adding element when i >= 1
    _updateAction(action) {
        const getBorderCont = document.getElementById("pSubAct");
        if (action == "Ready") {
            // pass
        } else if (action == undefined) {
            // pass
        } else {
            if (this.textList[0] == undefined) {
                // pass
            } else if (this.textList.length == 8) {
                this.textList.pop();
            }
            this.textList.unshift(action)
            getBorderCont.innerHTML = "";
            for (let i = 0; i < this.textList.length; i++) {
                const makeH3 = document.createElement("h3");
                makeH3.innerHTML = this.textList[i]
                makeH3.classList.add("actionSubText")
                getBorderCont.appendChild(makeH3);
            }
            
        }
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
    _setMeter(meter) {
        var getHpMeter = document.getElementById(meter);
        var attributes;
        switch(meter) {
            case "playerHp-meter":
                attributes = {
                    "min": "0",
                    "max": this.max_hp,
                    "low": this.max_hp - (this.max_hp * 0.75),
                    "high": this.max_hp - (this.max_hp * 0.50),
                    "optimum": this.max_hp - (this.max_hp * 0.25),
                    "value": this.hp
                }
                break
            case "playerMp-meter":
                attributes = {
                    "min": "0",
                    "max": this.max_mp,
                    "low": this.max_mp - (this.max_mp * 0.75),
                    "high": this.max_mp - (this.max_mp * 0.50),
                    "optimum": this.max_mp - (this.max_mp * 0.25),
                    "value": this.mp
                }
                break
        }
        
        for (let atri in attributes) {
            getHpMeter.setAttribute(atri, attributes[atri]);
        }
    }
}

// Class for spell creation; takes name, damage, and cost
// Creates a button and places in spell menu
class Spell {
    constructor(name, damage, cost, info, canStun = false) {
        this.name = name;
        this.damage = damage;
        this.cost = cost;
        this.info = info;
        this.stun = canStun;  
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
// spell information: name, damage, cost, info, canStun
// may be redundent but helps me keep it a bit organized
let spellInfo = {
    fireData: {
        _name: "Fire",
        _dam: 8,
        _cost: 2,
        _info: "Hurl a fireball!"
    },
    iceData: {
        _name: "Ice",
        _dam: 2,
        _cost: 1,
        _info: "Freeze the enemy!"
    },
    earthData: {
        _name: "Earth",
        _dam: 4,
        _cost: 3,
        _info: "Fling large rocks!",
        _canStun: true
    },
    healData: {
        _name: "Heal",
        _dam: -4,
        _cost: 0,
        _info: "Cure wounds!"
    }
}

// shorten call
let fData = spellInfo.fireData;
let iData = spellInfo.iceData;
let eData = spellInfo.earthData;
let hData = spellInfo.healData;
// spell list
let spells = {
    fireSpell: new Spell(fData._name, fData._dam, fData._cost, fData._info),
    iceSpell: new Spell(iData._name, iData._dam, iData._cost, iData._info),
    earthSpell: new Spell(eData._name, eData._dam, eData._cost, eData._info, eData._canStun),
    healSpell: new Spell(hData._name, hData._dam, hData._cost, hData._info), // negative damage for healing
}

// TODO: Clean up the code, VERY messy from all the trial and error
_createSpellBook()
async function _createSpellBook() {
    const spellPopup = document.getElementById("spellPopup");
    const tabel = document.createElement("table");
    spellPopup.appendChild(tabel)

    const header = tabel.createTHead();
    let nameList = ["Name", "Damage", "Cost", "Info"]

    for (let i = 0; i < nameList.length; i++) {
        header.appendChild(document.createElement("th")).appendChild(document.createTextNode(nameList[i]))
    }


    let spellList = [spells.fireSpell, spells.iceSpell, spells.earthSpell, spells.healSpell];


    for (let i = 0; i < spellList.length; i++) {
        const tr = tabel.insertRow();
        let _spell = spellList[i]
        
        for (let j = 0; j < 4; j++) {
            const td = tr.insertCell(j);
            if (j == 0) {
                spellButt = document.createElement("button")
                spellButt.id = _spell.name
                spellButt.innerHTML = _spell.name
                spellButt.classList.add("popButton");
                spellButt.onclick = spellAttack
                td.appendChild(spellButt)
            }
            if (j == 1) {
                td.appendChild(document.createTextNode(`${_spell.damage}`))
            }
            if (j == 2) {
                td.appendChild(document.createTextNode(`${_spell.cost}`))
            }
            if (j == 3) {
                td.appendChild(document.createTextNode(`${_spell.info}`))
            }
        }
    }

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
        _checkCost(spells.healSpell, player.hp, player.mp);
    }
    
    if (!stunFlag) { // TODO: figure out something better, probably in the update rework
        updateCharacters(`${clicked_id}!`, "Ouch!", true, true);
    } else {
        updateCharacters(`${clicked_id}!`, `*Stunned* (${stunCounter})`, true, true);
    }
    
    if (!canUse) { // check if player has enough mp
        console.log("not enough mp")
    } else {
        _castSpell();
    }
    // helper funcs
    async function _castSpell() {
        saPopup() // close popup
        if (clicked_id == "Heal"){ // TODO: rework heal, quickly threw it together to help testing
            player.hp = spellData.hpDam;
            player.mp = spellData.mpDam;
            enemyAttack();
            checkVictory();
        } else {
            if (spellData.canStun == true) { // check if spell can stun
                stunEnemy();
            }
            spriteContainerHit("eSprite")
            await sleep(2000)
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
        }
    }
}


class Enemy {
    constructor(max_hp, hp, damage, name) {
        this.max_hp = max_hp;
        this.hp = hp;
        this.damage = damage;
        this.name = name;
        this.textList = [];
    }
    // Update HP and Action on UI
    update(enemyAction, addSub) {
        var getEnemyAction = document.getElementById("enemy-action");
        var getEnemyHp = document.getElementById("enemy-hp");
        var getEnemyName = document.getElementById("enemy-name");

        var getEnemySName = document.getElementById("e-class");
        var getEnemySHp = document.getElementById("e-hp")
        var getEmemySDam = document.getElementById("e-dam")
        
        getEnemyAction.innerHTML = enemyAction;
        getEnemyHp.innerHTML = `${this.hp} / ${this.max_hp}`;
        getEnemyName.innerHTML = this.name;

        getEnemySName.innerHTML = `Type: ${this.name}`;
        getEnemySHp.innerHTML = `Max HP: ${this.max_hp}`;
        getEmemySDam.innerHTML = `Damage: ${this.damage}`;

        if (addSub == true) {
            this._updateAction(enemyAction, addSub)
        } else if (addSub == false) {
            // pass
        }
        
        this._setHpMeter();
    }
    attack(playerHp) {
        return playerHp -= this.damage; // returns player hp value
    }
    _updateAction(action, addSub = false) {
        const getBorderCont = document.getElementById("eSubAct");
        if (action == "Ready") {
            // pass
        } else if (action == undefined) {
            // pass
        } else {
            if (this.textList[0] == undefined) {
                // pass
            } else if (this.textList.length == 8) {
                this.textList.pop();
            }
            this.textList.unshift(action)
            getBorderCont.innerHTML = "";
            for (let i = 0; i < this.textList.length; i++) {
                const makeH3 = document.createElement("h3");
                makeH3.innerHTML = this.textList[i]
                makeH3.classList.add("actionSubText")
                getBorderCont.appendChild(makeH3);
            }
            
        }
    }
    _setHpMeter() {
        var getHpMeter = document.getElementById("enemy-meter");
        let attributes = {
            "min": "0",
            "max": this.max_hp,
            "low": this.max_hp - (this.max_hp * 0.75),
            "high": this.max_hp - (this.max_hp * 0.50),
            "optimum": this.max_hp - (this.max_hp * 0.25),
            "value": this.hp
        }

        for (let atri in attributes) {
            getHpMeter.setAttribute(atri, attributes[atri]);
        }
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
        player.damage += 1;
        player.block += 1;
        player.update("I'm feeling strong!", true)
    } else if (clicked_id == "second-choice") {
        player.hp = player.max_hp;
        player.mp = player.max_mp;
        player.update("I'm feeling healthy!", true)
    } else if (clicked_id == "third-choice") {
        blockCounter = 5;
        getBlockButton.innerText = `Block (${blockCounter})`
        player.update("Neat! A shield!", true)
    }
    levelPopup();
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
    var MAX_HP = 10 + (winCounter * (dice(2) + 1));
    var HP = MAX_HP;
    // var DAM = (dice(2) + 1) + winCounter;
    var DAM = 2;
    var NAME = ["Goblin", "Bats", "Ghoul", "Orc", "Evil Monk", "Dragon"];

    buttonState(true, true, true);
    player.mage = false; // turn off spellbook; figure out something better
    
    updateCharacters("Ready", "Searching for foes...");
    await sleep(WAITTIME);
    enemy = new Enemy(MAX_HP, HP, DAM, NAME[winCounter]);
    buttonState(false, true, false);
    updateCharacters("Ready", "Ready");
    
    // TODO: Finish and flush out enemy list
    function _getEnemy() {
        let max_hp = [(dice(10) + winCounter)]
        let enemyList = {
            "goblin": {
                "name": "Goblin",
                "max_hp": 0,
                "hp": 0,
                "dam": 0
            },
            "orc": {
                "name": "Orc",
                "max_hp": 0,
                "hp": 0,
                "dam": 0
            },
            "ghoul": {
                "name": "Ghoul",
                "max_hp": 0,
                "hp": 0,
                "dam": 0
            },
            "bats": {
                "name": "Bats",
                "max_hp": 0,
                "hp": 0,
                "dam": 0
            },
            "evilMonk": {
                "name": "Evil Monk",
                "max_hp": 0,
                "hp": 0,
                "dam": 0
            },
            "dragon": {
                "name": "Dragon",
                "max_hp": 0,
                "hp": 0,
                "dam": 0
            },
        };
    }
}

// choose class based on button clicked
function setClass(clicked_id) {
    var MAX_HP = [16, 14, 12]; // fighter ranger mage
    var MAX_MP = [10, 12, 14];
    var DAMAGE = [4, 3, 3];
    var BLOCK = [4, 3, 2];
    var NAME = ["Fighter", "Ranger", "Mage"];

    var abilButton = document.getElementById("abilities-button");
    
    // TODO fix spellbook not showing up
    if (!chooseClass) {
        if (clicked_id == "fight-button") {
            player = new Player(MAX_HP[0], MAX_HP[0], MAX_MP[0], MAX_MP[0], DAMAGE[0], BLOCK[0], NAME[0]); // Player(MAX-HP, HP, Damage, Block, Name)
        }
        if (clicked_id == "range-button") {
            rangerFlag = true;
            player = new Player(MAX_HP[1], MAX_HP[1], MAX_MP[1], MAX_MP[1], DAMAGE[1], BLOCK[1], NAME[1]); // Player(MAX-HP, HP, Damage, Block, Name)
        }
        if (clicked_id == "mage-button") {
            player = new Player(MAX_HP[2], MAX_HP[2], MAX_MP[2], MAX_MP[2], DAMAGE[2], BLOCK[2], NAME[2]); // Player(MAX-HP, HP, Damage, Block, Name)
            abilButton.classList.add("splimg")
        }
        genEnemy();
        classPopup();
    } else {
        return console.log("Already picked a class");
    }
}

// general update player/enemy UI, takes actions as str. "Attacking", "Defending"
function updateCharacters(p_action, e_action, pAddSub, eAddSub) {
    if (p_action == undefined) {
        const pAction = document.getElementById("player-action")
        p_action = pAction.innerHTML;
    } else if (e_action == undefined) {
        const eAction = document.getElementById("enemy-action")
        e_action = eAction.innerHTML;
    }

    player.update(p_action, pAddSub);
    enemy.update(e_action, eAddSub);
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
        enemy.update(`*Stunned* (${stunCounter})`, true)
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
        enemy.update(`*Stunned* (${stunCounter})`, true)
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
        spriteContainerHit("pSprite")
        updateCharacters(`*Flinches* -(${enemy.damage})`, "Bite!", true, true);
    } 
    if (player.hp <= 0) {
        playerDeath();
    }
    checkStun();
    

}
async function playerDeath() {
    var getLevelUp = document.getElementById("levelContainer");

    getLevelUp.hidden = true;
    updateCharacters("Piles of bones", "Victory laugh", true, true);
    buttonState(true, true, true);
    await sleep(4000);
    newGame();
}

// TODO: Fix jerky animation in css, maybe use the curve?
let intId;
async function spriteContainerHit(spriteContainerId) {

    _setAnim();
    await sleep(1000);
    _reset();

    function _setAnim() {
        if (!intId) {intId = setInterval(_flashCont, 500);}
    }
    
    function _flashCont() {
        const container = document.getElementById(spriteContainerId);
        const pContainer = document.getElementById("pSprite");
        const eContainer = document.getElementById("eSprite");
        switch(spriteContainerId) {
            // Attack player anim
            case "pSprite":
                eContainer.className = eContainer.className === "enemySprite" ? "eSpriteAtk" : "enemySprite";
                container.className = container.className === "playerSprite" ? "pSpriteHit" : "playerSprite";
                break;
                // Attack enemy anim
                case "eSprite":
                pContainer.className = pContainer.className === "playerSprite" ? "pSpriteAtk" : "playerSprite";
                container.className = container.className === "enemySprite" ? "eSpriteHit" : "enemySprite";
                break;
        }
    }
    function _reset() {
        clearInterval(intId);
        intId = null;
    }

}


// attack button; increments winCounter each win
async function attackEnemy() {
    if (enemy.hp > 0) {
        enemy.hp = player.attack(enemy.hp);
        _textCheck();
        spriteContainerHit("eSprite");
        buttonSwitch(1250);
        if (turnCounter > 0) {
            turnCounter --;
        } else {
            if (player.ranger) {
                turnCounter = 1;
            } else if (enemy.hp > 0) {
                await sleep(2000);
                enemyAttack();
                await sleep(2000);
            }
        }
    } 
    checkVictory();

    function _textCheck() { // change text depending on class
        var ptext;
        var etext = `*Wince* -(${player.damage})`;
        switch(player.name) {
            case "Fighter":
                ptext = `Slash! +(${player.damage})`
                break;
            case "Ranger":
                ptext = `Loose arrow! +(${player.damage})`
                break;
            case "Mage":
                ptext = `Bonk! +(${player.damage})`
                break;
        }
        updateCharacters(`${ptext}`, `${etext}`, true, true)
    }
}

async function checkVictory() {
    updateCharacters("Ready", "Ready")
    if (enemy.hp <= 0) { // check if enemyhp is 0. Level up & load next enemy
        var getLevelUp = document.getElementById("levelContainer");
        winCounter ++;
        player.mage = false;

        buttonState(true, true, true);
        updateCharacters("Victory Dance", "Pile of bones", true, true);
        if (winCounter < winsNeeded) {
            getLevelUp.hidden = false;
            levelPopup();
            
            await sleep(3000)
            genEnemy();
            genLevelCircle();
        } else { // victory condition
            getLevelUp.hidden = true;
            buttonState(true, false, true);
            player.mage = false;
            player.update("I win!!", true);
            await sleep(6000);
            newGame();
        }
    }
}

async function blockEnemy() {
    var getBlockButton = document.getElementById("block-button");
    var blocked = player.blockAttack(enemy.damage); // player.block - enemy.damage -> 4 - 2
    var healCheck = player.hp + blocked;

    saPopup(); // close popup
    if (blockCounter > 0) {
        spriteContainerHit("pSprite")
        if (blocked >= 0) { // if greater than 0 heal for the amount
            if (healCheck >= player.max_hp) { // check if hp would be greater then max
                player.hp = player.max_hp;
            } 
            else {
                player.hp += blocked;
            }
            enemy.hp -= blocked;
            checkVictory()
            updateCharacters()
        } else if (blocked < 0) {
            player.hp += blocked;
            player.update(`Blocked ${enemy.damage} Damage`, true);
            if (player.hp <= 0) {
                playerDeath();
            }
        }
        blockCounter --;
        getBlockButton.innerText = `Block (${blockCounter})`;
    } else {
        player.update("Your shield is broke!", true);
        getBlockButton.innerText = "*Broken*";
        getBlockButton.disabled = true;
    }
}

function newGame() { // reset game state
    winCounter = 0;
    stunCounter = 0;
    blockCounter = 5;
    stunFlag = false;
    player = new Player("?", "?", "?", "?", "?", "?", "...");
    enemy = new Enemy("?", "?", "?", "...");
    updateCharacters("Choose Class", "Awaiting player choice");
    buttonState(true, false, true);
    classPopup();
    genLevelCircle();
}

// starts new game on page load
newGame();
// helpPopup();
