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
async function pCheck () {
    let arr;
    let getClasses = document.getElementsByClassName("show")
    arr = Array.prototype.slice.call(getClasses)
    console.log(`getclasses: ${getClasses}`)
    console.log(arr)
    if (arr == "") {
        console.log("Array is Empty")
    } else {
        let objId = arr[0].id
        let pop = document.getElementById(objId)
        if (objId == "classPopup" || objId == "levelPopup" || objId == undefined) {
            console.log(`Cannot remove ${objId}`)
        } else {
            pop.classList.toggle("show");
        }
    }
}

async function popUp() {
    await pCheck()
    const popup = document.getElementById("statsPopup");
    genButton(popup)
    popup.classList.toggle("show");
}

function classPopup() {
    pCheck()
    const popup = document.getElementById("classPopup");
    popup.classList.toggle("show");
}

function saPopup(close = false) {
    const popup = document.getElementById("abilPopup");
    if (close) {
        popup.classList.remove("show");
    } else {
        pCheck()
        genButton(popup)
        popup.classList.toggle("show");
    }
}

let levelFlag = false;
function levelPopup() {
    pCheck()
    createLevelPopup();
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
    pCheck()
}


function helpPopup() {
    pCheck()
    const popup = document.getElementById("helpPopup");
    popup.innerHTML = "";
    genButton(popup);
    _genHeader();
    _genText();
    popup.classList.toggle("show");
    pCheck()

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
    Get 5 wins in a row.
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

const winsNeeded = 5;
// Sleep Timers
const GENTIME = 4000;
const TURNTIME = 3000; // 3000 optimal for animation

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


        if (this.hp < 0) {
            getPlayerHp.innerHTML = `0 / ${this.max_hp}`;
        } else {
            getPlayerHp.innerHTML = `${this.hp} / ${this.max_hp}`;
        }
        if (this.mp < 0) {
            getPlayerMp.innerHTML = `0 / ${this.max_mp}`;
        } else {
            getPlayerMp.innerHTML = `${this.mp} / ${this.max_mp}`;
        }

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
        
        if (this.hp < 0) {
            getEnemyHp.innerHTML = `0 / ${this.max_hp}`;
        } else {
            getEnemyHp.innerHTML = `${this.hp} / ${this.max_hp}`;
        }

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

// TODO: try and generate levels through this later?
let levelOps = {
    Stats: {
        name: "Stats",
        info: "Increase your stats"
    },
    Heal: {
        name: "Heal",
        info: "Heal your HP/MP"
    }
}

function createLevelPopup() {
    const levelPop = document.getElementById("levelPopup");
    levelPop.innerHTML = "";

    const h2 = document.createElement("h2");
    h2.innerHTML = "Level Up!";
    h2.id = "class";
    levelPop.append(h2);

    const table = document.createElement("table");
    levelPop.appendChild(table);
    const header = table.createTHead();
    let headNames = ["Choose", "Info"];

    for (let i = 0; i < headNames.length; i++) {
        header.appendChild(document.createElement("th")).appendChild(document.createTextNode(headNames[i]))
    }

    let choices = [];
    if (player.name == "Mage") {
        choices = [levelOps.Stats, levelOps.Heal];
    } else {
        choices = [levelOps.Stats, levelOps.Heal]; // TODO add shield fix
    }
    for (let i = 0; i < choices.length; i++) {
        const tr = table.insertRow();
        let choice = choices[i];
        for (let j = 0; j < 4; j++) {
            const td = tr.insertCell(j);
            if (j == 0) {
                levelButt = document.createElement("button");
                levelButt.id = i;
                levelButt.onclick = levelUp
                levelButt.innerHTML = `${choice.name}`
                levelButt.classList.add("popButton");
                td.appendChild(levelButt)
            }
            if (j == 1) {
                td.appendChild(document.createTextNode(choice.info))
            }
        }
    }
}

// add randomness to amounts dependent on difficulty?
// amounts dependent on class?
// TODO: generate buttons through js rather then hard code to easily add more or adjust
async function levelUp(clicked_id) {
    clicked_id = clicked_id.srcElement.id
    console.log(clicked_id)
    if (clicked_id == 0) {
        player.max_hp += 2;
        player.max_mp += 2;
        player.damage += 1;
        player.update("I'm feeling strong!", true)
    } else if (clicked_id == 1) {
        player.hp = player.max_hp;
        player.mp = player.max_mp;
        player.update("I'm feeling healthy!", true)
    } else if (clicked_id == 2) {
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
    const getStunButton = document.getElementById("stun-button");
    const d4 = dice(4);
    const d2 = dice(2) + 1;
    if (player.mp < abilities.Stun.cost) {
        console.log("Not enough MP")
    } else {
        player.mp -= abilities.Stun.cost;
        disableActionButtons(true);
        if (d4 >= 3) { // pass check
            stunFlag = true;
            const stunCounter = d2;
            if (player.name == "Mage") {
                // skip button disabling
            } else {
                getStunButton.disabled = true;
                getStunButton.innerHTML = `Stun (${stunCounter})`
            }
            spriteContainerHit("eSprite");
            updateCharacters(`Success!`, `*Stunned* (${stunCounter})`, true, true);
            updateBar(`${player.name} stuns ${enemy.name}`, "lightgreen")
            await sleep(3000)
            updateBar(`${player.name}'s Turn`, "lightgreen");
            disableActionButtons(false);
            
        } else if (d4 <= 2) { // fail check
            player.update(`Failed!`);
            enemyAttack();
        }
    }
}

function checkStun() {
    const getStunButton = document.getElementById("stun-button");
    if (getStunButton == null) {
        console.log(`checkStun skipped: No stun button`)
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
    }
}
async function blockEnemy() {
    saPopup(true);
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
        updateBar(`${player.name} blocks!`, "lightgreen")
        spriteContainerHit("pSprite")
        updateCharacters(`Blocked!+(${enemy.damage})`, `Ouch!-(${enemy.damage})`, true, true)
        await sleep(3000);
        checkVictory();
    } else {
        player.update("Your shield is broke!", true);
        getBlockButton.innerText = "*Broken*";
        getBlockButton.disabled = true;
    }
}

async function doubleShot() {
    saPopup(true);
    if (player.mp < abilities.DoubleShot.cost) {
        console.log("Not enough MP");
    } else {
        player.mp -= abilities.DoubleShot.cost;
        attackEnemy(false, false)
        updateBar(`${player.name} used Double Shot`, "lightgreen")
        enemy.update();
        await sleep(1500) //
        attackEnemy(true, false)
    }
}
// 443
function splAtk(clicked_id) {
    saPopup(true);
    clicked_id = clicked_id.srcElement.id;
    let cost;
    let dam;
    let text;
    let canStun = false;
    switch(clicked_id) {
        case "fire-button":
            cost = spells.Fire.stats.cost;
            dam = spells.Fire.stats.dam;
            text = spells.Fire.name;
            break;
        case "ice-button":
            cost = spells.Ice.stats.cost;
            dam = spells.Ice.stats.dam;
            text = spells.Ice.name
            break;
        case "earth-button":
            cost = spells.Earth.stats.cost;
            dam = spells.Earth.stats.dam;
            text = spells.Earth.name
            canStun = true;
            break;
        case "heal-button":
            cost = spells.Heal.stats.cost;
            dam = spells.Heal.stats.dam;
            text = spells.Heal.name
            break;   
    }
    
    if (player.mp < cost) {
        player.update("Not enough MP")
    } else {
        if (clicked_id == "heal-button") {
            if (player.hp == player.max_hp) {
                player.update("Already full HP")
            } else {
                updateBar(`${player.name} casts ${text}!`, "lightgreen")
                player.hp -= dam;
                player.mp -= cost;
                if (player.hp > player.max_hp) {
                    player.hp = player.max_hp;
                }
                enemyAttack();
                checkVictory();
            }
            
        } else {
            if (canStun) {
                if(stunFlag) {
                    enemy.update("Enemy already stunned", true)
                } else {
                    stunEnemy()
                }
            }
            canStun = false;
            spriteContainerHit("eSprite");
            updateBar(`${player.name} casts ${text}!`, "lightgreen")
            enemy.hp -= dam;
            player.mp -= cost;
            enemyAttack();
            checkVictory();
        }
    }
}
                
let abilities = {
    "Block": {
        name: "Block",
        id: "block-button",
        onclick: blockEnemy,
        info: "Block & Heal damage",
    },
    "Stun": {
        name: "Stun",
        id: "stun-button",
        onclick: stunEnemy,
        info: "50% chance to Stun",
        cost: 5
    },
    "DoubleShot": {
        name: "Double Shot",
        id: "ds-button",
        onclick: doubleShot,
        info: "Fire two arrows",
        cost: 5
    },
    "null": {
        name: "null",
        id: "null",
        onclick: "i am null",
        info: "null"
    }
}
let spells = {
    "Fire": {
        name: "Fire",
        id: "fire-button",
        onclick: splAtk,
        info: "Throw a Fireball!",
        stats: {
            dam: 8,
            cost: 8,
        }
    },
    "Ice": {
        name: "Ice",
        id: "ice-button",
        onclick: splAtk,
        info: "Freeze the enemy!",
        stats: {
            dam: 4,
            cost: 4,
        }
    },
    "Earth": {
        name: "Earth",
        id: "earth-button",
        onclick: splAtk,
        info: "Fling large rocks!",
        stats: {
            dam: 5,
            cost: 6,
        }
    },
    "Heal": {
        name: "Heal",
        id: "heal-button",
        onclick: splAtk,
        info: "Cure wounds!",
        stats: {
            dam: -4,
            cost: 4,
        }
    },
}

// createAbilities()
function createAbilities() {
    const abilPop = document.getElementById("abilPopup");
    abilPop.innerHTML = "";
    const h2 = document.createElement("h2");
    h2.innerHTML = "Abilities";
    h2.id = "class";
    if (player.name == "Mage") {
        h2.innerHTML = "Spells";
    }
    abilPop.append(h2);
    
    
    
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
            abilityNames = [spells.Fire, spells.Ice, spells.Earth, spells.Heal]
        } else {
            throw new Error(`Error: ${player.name} is not a valid class`)
        }
    }

    const table = document.createElement("table");
    abilPop.appendChild(table);
    const header = table.createTHead();
    let headNames = ["Name", "Cost", "Info"]
    if (player.name == "Mage") {
        headNames = ["Name", "Damage", "Cost", "Info"]
    }
    
    for (let i = 0; i < headNames.length; i++) {
        header.appendChild(document.createElement("th")).appendChild(document.createTextNode(headNames[i]))
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
            if (player.name == "Mage"){
                if (j == 1) {
                    td.appendChild(document.createTextNode(`${ability.stats.dam}`))
                }
                if (j == 2) {
                    td.appendChild(document.createTextNode(`${ability.stats.cost}`))
                }
                if (j == 3) {
                    td.appendChild(document.createTextNode(`${ability.info}`))
                }
            } else {
                if (j == 1) {
                    if (ability.cost == undefined) {
                        td.appendChild(document.createTextNode(`0`))
                    } else {
                        td.appendChild(document.createTextNode(`${ability.cost}`))
                    }
                }
                if (j == 2) {
                    td.appendChild(document.createTextNode(`${ability.info}`))
                }
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
    pCheck()
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
const soundEffect = new Audio("audio/8-bit-explosion.mp3"); // Hit sound

const volSlider = document.getElementById("volumeSlider");

audioElement.volume = 0.25;
soundEffect.volume = 0.25;
volSlider.oninput = function() {
    const value = volSlider.value;
    audioElement.volume = value/100;
    soundEffect.volume = value/100;
}

function muteAudio() {
    const getVolumeCont = document.getElementById("volumeCont");
    const getMuteButt = document.getElementById("muteButt");
    getMuteButt.innerHTML = "";
    getVolumeCont.classList.toggle("muted")
     if (audioElement.muted) {
        getMuteButt.innerHTML = "BGM -on-"
        audioElement.muted = false;
        soundEffect.muted = false;
     }  else {
        getMuteButt.innerHTML = "BGM -off-"
        audioElement.muted = true;
        soundEffect.muted = true;
     }
}

// starts new game on page load
newGame();
helpPopup();
