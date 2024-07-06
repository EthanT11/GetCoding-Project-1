// Show dropdown menu
function dropDown() {
    document.getElementById("myDropdown").classList.toggle("show");
  }
  
  // Close dropdown menu
  window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
      const dropdowns = document.getElementsByClassName("dropdown-content");
      for (let i = 0; i < dropdowns.length; i++) {
          const openDropdown = dropdowns[i];
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
    const button = document.createElement("button");
    button.classList.add("closebtn");
    button.onclick = _close;
    popup.append(button)
    function _close() {
        popup.classList.toggle("show");
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
    switch (player.name) {
        case "Mage":
            popup = document.getElementById("spellPopup");
            break;
        case "Ranger":
            popup = document.getElementById("abilPopup");
            break;
        case "Fighter":
            popup = document.getElementById("abilPopup");
            break;
        default:
            console.log("Unreachable")
            newGame();
    }
    genButton(popup)
    popup.classList.toggle("show");
}

let levelFlag = false;
function levelPopup() {
    const popup = document.getElementById("levelPopup");
    popup.classList.toggle("show");
    if (popup.classList.contains("show")) {
        levelFlag = true;
        disableActionButtons(true);
    } else {
        levelFlag = false;
        if (genFlag) {} else {
            disableActionButtons(false)
        }
    }
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
    your Magic(blue bar).
    
- Music in the background from https://www.FesliyanStudios.com`;
        popup.append(helpText);
    }
}

// generate level circles
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

// -- Game Functions --

// init
let player;
let enemy;

let winCounter = 0;

let stunCounter = 0;
let stunFlag = false;

let blockCounter = 0;
let blockFlag = false;

let spellData = {};


const winsNeeded = 3;
// Sleep Timers
const GENTIME = 4000/2;
const TURNTIME = 3000/2; // 3000 optimal for animation

class Player {
    constructor(max_hp, hp, max_mp, mp, damage, name) {
        this.max_hp = max_hp;
        this.hp = hp;
        this.max_mp = max_mp;
        this.mp = mp;
        this.damage = damage;
        this.name = name;

        this.textList = [];
        
    }

    // Update HP and Action on UI
    update(playerAction, addSub) {
        // get player menu container elements
        const getBlockButton = document.getElementById("block-button");
        
        this._updateContainer(playerAction, addSub);
        this._updateStats();
        
        
        // check if block button should be active based on hp
        if (getBlockButton == null) {
            // console.log(`blockFlag skipped: No block button`)
        } else {
            if (!blockFlag) {
                if (player.hp < player.max_hp && blockCounter > 0) {
                    getBlockButton.disabled = false;
                } else {
                    getBlockButton.disabled = true;
                }
            }
        }
    }
    attack(enemyHp, update = true) {
        if (update) {
            updateBar(`${player.name} Attacks!`, "lightgreen")
        } 
        if (player.name == "Ranger") {
            const dblDam = dice(4);
            if (dblDam >= 4) {
                console.log("DOUBLE DAMAGE!!!!")
                return enemyHp -= this.damage * 2;
            } else {
                return enemyHp -= this.damage;
            }
        } else {
            return enemyHp -= this.damage; // returns enemy hp value
        }
    }
    _updateContainer(playerAction, addSub = false) {
        // get player container elements
        const getPlayerAction = document.getElementById("player-action");
        const getPlayerHp = document.getElementById("player-hp");
        const getPlayerMp = document.getElementById("player-mp");
        const getPlayerName = document.getElementById("player-name");

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
        // get player stats cconstainer elements
        const getPlayerSClass = document.getElementById("s-class");
        const getPlayerSHp = document.getElementById("s-hp");
        const getPlayerSMp = document.getElementById("s-mp");
        const getPlayerSDamage = document.getElementById("s-dam");
        const getPlayerSWins = document.getElementById("s-wins");
        
        // set player stats container elements
        getPlayerSClass.innerHTML = `Class: ${this.name}`;
        getPlayerSHp.innerHTML = `Max HP: ${this.max_hp}`;
        getPlayerSMp.innerHTML = `Max MP: ${this.max_mp}`;
        getPlayerSDamage.innerHTML = `Damage: ${this.damage}`;
        getPlayerSWins.innerHTML = `Wins: ${winCounter}`;
    }
    _setMeter(meter) {
        const getHpMeter = document.getElementById(meter);
        let attributes;
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
        const hpLeft = hp -= this.damage;
        const mpLeft = playerMp -= this.cost;
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
        _cost: 8,
        _info: "Hurl a fireball!"
    },
    iceData: {
        _name: "Ice",
        _dam: 4,
        _cost: 4,
        _info: "Freeze the enemy!"
    },
    earthData: {
        _name: "Earth",
        _dam: 5,
        _cost: 6,
        _info: "Fling large rocks!",
        _canStun: true
    },
    healData: {
        _name: "Heal",
        _dam: -4,
        _cost: 4,
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
// Probably redo at some point but works for now
// TODO: Make spellbook generate on playerclass rather then always
_createSpellBook()
function _createSpellBook() {
    const spellPopup = document.getElementById("spellPopup");
    const table = document.createElement("table");
    spellPopup.appendChild(table)

    const header = table.createTHead();
    let nameList = ["Name", "Damage", "Cost", "Info"]

    for (let i = 0; i < nameList.length; i++) {
        header.appendChild(document.createElement("th")).appendChild(document.createTextNode(nameList[i]))
    }


    let spellList = [spells.fireSpell, spells.iceSpell, spells.earthSpell, spells.healSpell];


    for (let i = 0; i < spellList.length; i++) {
        const tr = table.insertRow();
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
            updateBar(`${player.name} casts ${spellData.sname}`, "lightgreen")
            
            enemy.hp = spellData.hpDam;
            player.mp = spellData.mpDam;
            enemyAttack();
            checkVictory();
        }
    }
    function _checkCost(spell, hp, mp) {  // check if spell can be used
        const check = spell.checkCost(player.mp);
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
        const getEnemyAction = document.getElementById("enemy-action");
        const getEnemyHp = document.getElementById("enemy-hp");
        const getEnemyName = document.getElementById("enemy-name");

        const getEnemySName = document.getElementById("e-class");
        const getEnemySHp = document.getElementById("e-hp")
        const getEmemySDam = document.getElementById("e-dam")
        
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
        
        if (enemyAction == undefined || enemyAction == "") {
            // pass
        } else {
            getEnemyAction.innerHTML = enemyAction;
        }

        this._setHpMeter();
    }
    attack(playerHp) {
        updateBar(`${enemy.name} Attacks!`, "red")
        return playerHp -= this.damage; // returns player hp value
    }
    _updateAction(action) {
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
        const getHpMeter = document.getElementById("enemy-meter");
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
// TODO: generate buttons through js rather then hard code to easily add more or adjust
async function levelUp(clicked_id) {
    const getBlockButton = document.getElementById("block-button");

    if (clicked_id == "first-choice") {
        player.max_hp += 2;
        player.max_mp += 2;
        player.damage += 1;
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
    player.update("Ready");
}

// generate random number between 1 and x
function dice(max) {
    return Math.floor(Math.random() * max) + 1;
}

// adds delay
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

let genFlag = false;
// generate random enemy
// TODO: Add variety for different levels and different names
async function genEnemy() {
    const MAX_HP = 10 + (winCounter * (dice(2) + 1));
    const DAM = (dice(2) + 1) + winCounter;
    const NAME = ["Goblin", "Bat", "Ghoul", "Orc", "Evil Monk", "Dragon"];
    
    enemy = new Enemy(MAX_HP, MAX_HP, DAM, NAME[winCounter]);
    stunCounter = 0;
    stunFlag = false;
    checkStun();
    updateCharacters("Ready", "...");
    updateBar("Searching...", "lightgreen")

    genFlag = true;
    await sleep(GENTIME);
    genFlag = false;

    updateCharacters("Ready", "Ready");
    updateBar(`${player.name}'s Turn`, "lightgreen");
    if (levelFlag) {} else{
        disableActionButtons(false);
    }
}

// choose class based on button clicked
function setClass(clicked_id) {
    const MAX_HP = [16, 14, 12]; // fighter ranger mage
    const MAX_MP = [10, 12, 24];
    const DAMAGE = [4, 3, 2];
    const NAME = ["Fighter", "Ranger", "Mage"];
    const abilButton = document.getElementById("abilities-button");
    abilButton.classList.toggle("ablimg");
    if (clicked_id == "fight-button") {
        player = new Player(MAX_HP[0], MAX_HP[0], MAX_MP[0], MAX_MP[0], DAMAGE[0], NAME[0]); // Player(MAX-HP, HP, Damage, Block, Name)
        if (abilButton.classList.contains("splimg")) {
            abilButton.classList.remove("splimg")
        }
        abilButton.classList.toggle("ablimg");
    }
    if (clicked_id == "range-button") {
        player = new Player(MAX_HP[1], MAX_HP[1], MAX_MP[1], MAX_MP[1], DAMAGE[1], NAME[1]); // Player(MAX-HP, HP, Damage, Block, Name)
        if (abilButton.classList.contains("splimg")) {
            abilButton.classList.remove("splimg");
        }
        abilButton.classList.add("ablimg");
    }
    if (clicked_id == "mage-button") {
        player = new Player(MAX_HP[2], MAX_HP[2], MAX_MP[2], MAX_MP[2], DAMAGE[2], NAME[2]); // Player(MAX-HP, HP, Damage, Block, Name)
        if (abilButton.classList.contains("ablimg")) {
            abilButton.classList.remove("ablimg")
        }
        abilButton.classList.toggle("splimg");
    }
    createAbilities()
    genEnemy();
    classPopup();
    audioElement.play();
    audioElement.loop = true; // Has to activate on a user interacting with the dom; maybe find a better place to put it or start it?
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

async function stunEnemy() {
    saPopup();
    const getStunButton = document.getElementById("stun-button");
    const d4 = dice(4);
    const d2 = dice(2) + 1;
    disableActionButtons(true);
    if (d4 >= 3) { // pass check
        stunFlag = true;
        stunCounter = d2;
        getStunButton.disabled = true;
        getStunButton.innerHTML = `Stun (${stunCounter})`
        spriteContainerHit("eSprite");
        updateCharacters(`Success!`, `*Stunned* (${stunCounter})`, true, true);
        disableActionButtons(false);
        
    } else if (d4 <= 2) { // fail check
        player.update(`Failed!`);
        enemyAttack();
    }
}

function checkStun() {
    const getStunButton = document.getElementById("stun-button");
    if (getStunButton == null) {
        // console.log(`checkStun skipped: No stun button`)
    } else {
        if (stunCounter == 0) {
            stunFlag = false;
            getStunButton.disabled = false;
            getStunButton.innerHTML = "Stun";
        }
        if (!stunFlag) {} else {
            stunCounter --;
            getStunButton.innerHTML = `Stun (${stunCounter})`
            enemy.update(`*Stunned* (${stunCounter})`, true)
        }
    }
}
// enemy attack
async function enemyAttack() {
    await sleep(TURNTIME);
    if (player.hp > 0 && enemy.hp > 0 && !stunFlag) {
        updateBar(`${enemy.name} Attacks!`, "red")
        player.hp = enemy.attack(player.hp);
        spriteContainerHit("pSprite")
        updateCharacters(`*Flinches* -(${enemy.damage})`, `Bite!(${enemy.damage})`, true, true);
        await sleep(TURNTIME);
    } 
    if (player.hp <= 0) {
        playerDeath();
    } else {
        checkStun();
        updateBar(`${player.name}'s Turn`, "lightgreen");
        disableActionButtons(false);
    }
    
}
async function playerDeath() {
    updateCharacters("Piles of bones", "Victory laugh", true, true);
  

    newGame();
}

let intId;
async function spriteContainerHit(spriteContainerId) {
    _setAnim();
    soundEffect.play();
    await sleep(1000)
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

function updateBar(text, color, style) {
    const getBar = document.getElementById("blackBar");
    const createEle = document.createElement("h3");
    getBar.innerHTML = "";
    createEle.style.color = color;

    if (createEle.style.color == "" || createEle.style.color == undefined) {
        console.log(`${color}: Not a valid color`);
        createEle.style.color = "orange"; // Default so text always has a color
    }

    if (style == undefined || style == "default") {
        createEle.classList.add("barText");    
    } else if (style == "party") {
        createEle.classList.add("partyText")
    }

    createEle.innerHTML = text;
    getBar.append(createEle);
}


// attack button;
async function attackEnemy(atkBack = true, update = true) {
    let oldHp = enemy.hp;
    disableActionButtons(true);
    enemy.hp = player.attack(enemy.hp, update);
    let curHp = enemy.hp;
    _textCheck();
    spriteContainerHit("eSprite");

    if (!atkBack) {
        // Skip enemy turn and victory check for now
    } else {
        if (enemy.hp > 0) {
            enemyAttack();
        }  else {
            checkVictory();
        }

    }


    function _textCheck() { // change text depending on class
        let damage = oldHp - curHp
        let ptext;
        let etext = `*Wince* -(${damage})`;
        switch(player.name) {
            case "Fighter":
                ptext = `Slash! +(${damage})`
                break;
            case "Ranger":
                ptext = `Loose arrow! +(${damage})`
                break;
            case "Mage":
                ptext = `Bonk! +(${damage})`
                break;
        }
        updateCharacters(`${ptext}`, `${etext}`, true, true)
    }
}

async function checkVictory() {
    if (enemy.hp <= 0) { // check if enemyhp is 0. Level up & load next enemy
        winCounter ++;
        updateCharacters("Victory Dance", "Pile of bones", true, true);
        if (winCounter < winsNeeded) {
            updateBar("Victorious!!", "lightgreen");
            levelPopup();
            await sleep(4000)
            genEnemy();
            genLevelCircle();
        } else { // victory condition

            player.update("I win!!", true);
            updateBar("You beat the game, Congratulations", "yellow", "party")
            await sleep(12000)
            newGame();
        }
    } else {

        updateCharacters("Ready", "Ready", true, true);
       
        updateBar(`${player.name}'s Turn`, "lightgreen");
    }
}
async function blockEnemy() {
    saPopup();
    if (blockCounter > 0) {
        const getBlockButton = document.getElementById("block-button");
        
        let blocked = enemy.damage;
        if (player.hp + blocked > player.max_hp) {
            player.hp = player.max_hp;
        } else {
            player.hp += blocked;
            enemy.hp -= blocked;
        }
        blockCounter --;
        getBlockButton.innerText = `Block (${blockCounter})`;
        updateBar("Blocked!", "lightgreen")
        spriteContainerHit("pSprite")
        updateCharacters(`Blocked!+(${enemy.damage})`, `Ouch!-(${enemy.damage})`, true, true)
        checkVictory();
    } else {
        player.update("Your shield is broke!", true);
        getBlockButton.innerText = "*Broken*";
        getBlockButton.disabled = true;
    }
}

async function doubleShot() {
    saPopup();
    
    attackEnemy(false)
    enemy.update();
    await sleep(1500) //
    attackEnemy(true, false)
}

createAbilities()
function createAbilities(type) {
    const abilPop = document.getElementById("abilPopup");
    abilPop.innerHTML = "";

    const h2 = document.createElement("h2");
    const table = document.createElement("table");
    h2.innerHTML = "Abilities";
    h2.id = "class";
    abilPop.append(h2);
    abilPop.appendChild(table);
    const header = table.createTHead();
    let headNames = ["Name", "Info"]

    for (let i = 0; i < headNames.length; i++) {
        header.appendChild(document.createElement("th")).appendChild(document.createTextNode(headNames[i]))
    }

    const abilities = {
        "Block": {
            name: "Block",
            id: "block-button",
            onclick: blockEnemy,
            info: "Block & Heal damage",
            tag: "yes"
        },
        "Stun": {
            name: "Stun",
            id: "stun-button",
            onclick: stunEnemy,
            info: "50% chance to stun",
            tag: "yes"
        },
        "DoubleShot": {
            name: "Double Shot",
            id: "ds-button",
            onclick: doubleShot,
            info: "testing"
        },
        "null": {
            name: "null",
            id: "null",
            onclick: "i am null",
            info: "null"
        }
    }

    let abilityNames = []
    // maybe add tag to ability info and iterate through that ranger, mage etc
    if (!player) {
        abilityNames = [abilities.Block, abilities.Stun];
    } else {
        if (player.name == "Fighter") {
            abilityNames = [abilities.Block, abilities.Stun]
        } else if (player.name == "Ranger") {
            abilityNames = [abilities.Stun, abilities.DoubleShot]
        } else if (player.name == "Mage") {
            abilityNames = [abilities.null]
        } else {
            throw new Error(`Error: ${player.name} is not a valid class`)
        }
    }

    for (let i = 0; i < abilityNames.length; i++) {
        const tr = table.insertRow();
        let ability = abilityNames[i];
        for (let j = 0; j < 4; j++) {
            const td = tr.insertCell(j);
            if (j == 0) {
                abilButt = document.createElement("button");
                abilButt.id = ability.id;
                abilButt.innerHTML = ability.name
                abilButt.classList.add("popButton");
                abilButt.onclick = ability.onclick
                td.appendChild(abilButt)
            }
            if (j == 1) {
                td.appendChild(document.createTextNode(`${ability.info}`))
            }
        }
    }
    
}

function newGame() { // reset game state
    winCounter = 0;
    stunCounter = 0;
    blockCounter = 5;
    stunFlag = false;
    player = new Player("?", "?", "?", "?", "?", "?", "...");
    enemy = new Enemy("?", "?", "?", "...");
    disableActionButtons(true)
    updateCharacters("...", "...");
    classPopup();
    updateBar("Choose your Class", "lightgreen");
    genLevelCircle();
    
}
// disableButtons()
function disableActionButtons(bool) {
    const getAtkButt = document.getElementById("attack-button");
    const getAbilButt = document.getElementById("abilities-button");
    getAtkButt.disabled = bool;
    getAbilButt.disabled = bool;
}

// Audio
const audioElement = new Audio("audio/8_Bit_Nostalgia.mp3"); // Background music
const soundEffect = new Audio("audio/8-bit-explosion.mp3"); // Hit effect

const volSlider = document.getElementById("volumeSlider");

audioElement.volume = 0; // 0.25 | Turn back on
soundEffect.volume = 0;
volSlider.oninput = function() {
    const value = volSlider.value;
    audioElement.volume = value/100;
    soundEffect.volume = value/100;
}

function muteAudio() {
     if (audioElement.muted) {
        audioElement.muted = false;
        soundEffect.muted = false;
     }  else {
        audioElement.muted = true;
        soundEffect.muted = true;
     }
}

// starts new game on page load
newGame();
// helpPopup();
