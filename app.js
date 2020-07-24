// room
class Room {
    constructor(name, enemies, background){
        this.name = name;
        this.enemies = enemies;
        this.background = background
    }
    isCleared() {
        return this.enemies === null
    }
}
//pokemon
class PokeMon {
    constructor(name, type, lvl, img) {
        this.name = name
        this.img = img
        this.level = lvl
        this.hp = 20 + (this.level * 4);
        this.attack = 10 + (this.level * 3)
        this.currentHp = this.hp;
        this.currentXp = 0
        this.xpToLevel = 100 
        this.xpGiven = 50 + (this.level * 50)
        this.type = type
        if(this.type === 'fire') {
            this.weakness = 'water'
        } else if (this.type === 'water') {
            this.weakness = 'grass'
        } else if (this.type === 'grass') {
            this.weakness = 'fire'
        }
    }
    isKod() {
        return this.currentHp <= 0
    }
    getXP(xp) {
        this.currentXp += xp
        this.levelUp()
    }
    levelUp() {
        if (this.currentXp >= this.xpToLevel) {
            this.level += 1
            this.currentXp = this.currentXp - this.xpToLevel
            this.xpToLevel += 150
            this.attack += this.level * 3
            this.hp += this.level * 4
            this.currentHp += 15
            if(this.currentHp > this.hp) {
                this.currentHp = this.hp
            }
            user.changeHp()
            updateLog(`Your ${this.name} leveled up to level ${this.level} and gained attack +${this.level * 3} and Max HP +${this.level * 4}!                                 ` )
        }
    }
}
// enemies
class Enemy {
    constructor(name) {
        this.name = name;
        this.pokemon = [];
        this.active;
        this.currentRoom;
    }
    addPoke(poke) {
        this.pokemon.push(poke)
        if (!this.active) {
            this.active = poke
        }
    }
    attack(target) {
        if(target.active.weakness === this.active.type) {
            target.active.currentHp -= this.active.attack * 1.5
            updateLog(`Super effective! The enemies ${this.active.name} attacked for ${this.active.attack *1.5} damage!                                 `)
        } else if (this.active.weakness === target.active.type) {
            target.active.currentHp -= this.active.attack * .5
            updateLog(`Not very effective! The enemies ${this.active.name} attacked for ${this.active.attack * .5} damage!                                 `)
        } else {
            target.active.currentHp -= this.active.attack
            updateLog(`The enemies ${this.active.name} attacked for ${this.active.attack} damage!                                 `)
        }
        

        if (target.active.currentHp < 0) {
            target.active.currentHp = 0
        }
        
        target.changeHp()
        if(target.gameOver()) {
            setTimeout(endGame, 500)
        }
        
        //alert(`The ememies ${this.active.name} attacked your ${target.active.name} for ${this.active.attack} damage`)
    }
    changeHp() {
        const enemyHealthBar = document.querySelector('#enemy')
        let percent =  (this.active.currentHp /  this.active.hp) * 100
        if (percent < 1) {
            percent = 1
        }
        enemyHealthBar.style.width = percent + '%'
        enemyHealthBar.innerText = this.active.currentHp + '/' + this.active.hp
    }
    removeActive() {
        this.pokemon.splice(0, 1)
        // const enemyPoke = document.querySelector('.enemy img')
        // enemyPoke.setAttribute('src', '')
        }
    setActive() {
        const enemyPoke = document.querySelector('.enemy img')

        if(this.pokemon) {
            this.active = this.pokemon[0]
            updateLog(`${this.currentRoom.enemies.name} sent out ${this.active.name}                                 `)
            this.changeHp()
            enemyPoke.setAttribute('src', this.active.img)
        } 
    }
    removeFromRoom() {
        updateLog(`you defeated ${this.name} and decide to set up camp for the night                                 `)
        this.currentRoom.enemies = null
    }
    isDefeated() {
        return this.pokemon.length < 1
    }
}
// the user
class User extends Enemy {
    constructor(name){
        super(name)
        this.currentRoom = forest
        this.potions = 3;
    
    }
    attack(target) {
        if(target.active.weakness === this.active.type) {
            target.active.currentHp -= this.active.attack * 1.5
            updateLog(`Super effective! Your ${this.active.name} attacked for ${this.active.attack * 1.5} damage!                                   `)
        } else if (this.active.weakness === target.active.type) {
            target.active.currentHp -= this.active.attack * .5
            updateLog(`Not very effective! Your ${this.active.name} attacked for ${this.active.attack * .5} damage!                                 `)
        } else {
            target.active.currentHp -= this.active.attack 
            updateLog(`Your ${this.active.name} attacked for ${this.active.attack} damage!                                                            `)
        }
        
        user.currentRoom.enemies.changeHp()
    }
    changeHp() {
        const playerHealthBar = document.querySelector('#user')
        let percent =  (this.active.currentHp /  this.active.hp) * 100
        if(percent <= 0) {
            percent = 1
        }
        playerHealthBar.style.width = percent + '%'
        playerHealthBar.innerText = this.active.currentHp + '/' + this.active.hp
    }
    usePotion() {
    
            if(this.active.currentHp + 25 < this.active.hp) {
                updateLog(`Healed your ${this.active.name} for 25 hp!                                 `)
                this.active.currentHp += 25;
                this.potions -= 1;
                this.changeHp()
            } else {
                updateLog(`Fully healed your ${this.active.name}                                 `)
                this.active.currentHp = this.active.hp;
                this.potions -= 1;
                this.changeHp()
            }
            
        
    }
    changeRoom() {
        
        const screen = document.querySelector('.screen')
        const enemyPoke = document.querySelector('.enemy')
        enemyPoke.style.display = 'block'
        user.currentRoom = rooms[roomI]
        updateLog(`Moving to ${user.currentRoom.name}                                 `)
        setTimeout(() => {
           
            
        }, 500)
        screen.style.backgroundImage = 'url(' + user.currentRoom.background + ')'
        roomI ++
        
        const enemyPokeImg = document.querySelector('.enemy img')
    
        enemyPokeImg.setAttribute('src', this.currentRoom.enemies.active.img)
        user.battle()
        user.currentRoom.enemies.changeHp()
        
        
    }
    advanceRoom() {
        let screen = document.querySelector('.screen')
        user.currentRoom = safeRoom
        user.random()
        screen.style.backgroundImage = 'url(' + user.currentRoom.background + ')'
        
        const buttons = document.querySelectorAll('.menu')
        buttons[1].innerText = 'Heal'
        buttons[2].innerText = 'Train'
        buttons[1].removeEventListener('click', user.potionFunction)
        buttons[2].removeEventListener('click', user.attackFunction)
        if (roomI === rooms.length) {
            setTimeout(() => {
                victory()
            }, 500)
            
        }
        buttons[0].addEventListener('click',  user.changeActive)
        buttons[1].addEventListener('click', user.heal)
        buttons[2].addEventListener('click', user.train)
    }
    attackFunction(){
        const buttons = document.querySelectorAll('.menu')
        buttons[1].removeEventListener('click', user.potionFunction)
        buttons[2].removeEventListener('click', user.attackFunction)
        const pokeTable = document.querySelector('.poke-menu')
        pokeTable.style.display = 'none'
        if(user.active.isKod()) {
            updateLog('You must switch pokemon or heal!!!                                 ')
            user.changeActive()
            buttons[1].addEventListener('click', user.potionFunction)
            buttons[2].addEventListener('click', user.attackFunction)
            return 
        }
        const enemyPoke = document.querySelector('.enemy')
        if (user.currentRoom.enemies != null) {
            user.attack(user.currentRoom.enemies)
            if(user.currentRoom.enemies.active.isKod() && user.currentRoom.enemies.pokemon.length > 1){
                updateLog(`Defeated the enemies ${user.currentRoom.enemies.active.name}!                                 `)
                user.active.getXP(user.currentRoom.enemies.active.xpGiven)
                setTimeout(() => {
                    user.currentRoom.enemies.removeActive()
                    user.currentRoom.enemies.setActive()
                    buttons[1].addEventListener('click', user.potionFunction)
                    buttons[2].addEventListener('click', user.attackFunction)
                }, 500)
              
            } else if (user.currentRoom.enemies.active.isKod()) {
                user.active.getXP(user.currentRoom.enemies.active.xpGiven)
                setTimeout(() => {
                    user.currentRoom.enemies.removeFromRoom()
                    enemyPoke.style.display = 'none'
                    user.advanceRoom()
                }, 500)
                
            } else {
                setTimeout(() => {
                    user.currentRoom.enemies.attack(user)
                    buttons[1].addEventListener('click', user.potionFunction)
                    buttons[2].addEventListener('click', user.attackFunction)
                },500)
                
                
            }
            
        } else {
            // let screen = document.querySelector('.screen')
            
            user.advanceRoom()
        }
        
    }
   
    potionFunction(){
        const pokeTable = document.querySelector('.poke-menu')
        pokeTable.style.display = 'none'
        const buttons = document.querySelectorAll('.menu')
        
        if(user.potions) {
            buttons[2].removeEventListener('click', user.attackFunction)
            buttons[1].removeEventListener('click', user.potionFunction)
            user.usePotion()
            setTimeout(() => {
                user.currentRoom.enemies.attack(user)
                buttons[1].addEventListener('click', user.potionFunction)
                buttons[2].addEventListener('click', user.attackFunction)
            }, 400)
            
        } else {
            updateLog('all out of potions                                 ')
        }
        
    }
    battle() {
        const buttons = document.querySelectorAll('.menu');
        buttons[0].addEventListener('click', user.changeActive)
        buttons[1].removeEventListener('click', user.heal)
        buttons[2].removeEventListener('click', user.train)
        buttons[2].innerText = 'attack'
        buttons[1].innerText = 'use potion'
        buttons[2].addEventListener('click', user.attackFunction) 
        buttons[1].addEventListener('click', user.potionFunction)
    }
    train() {
        
        const pokeTable = document.querySelector('.poke-menu')
        pokeTable.style.display = 'none'
        updateLog(`You trained your pokemon and they gained 100xp                                 `)
        for (let poke of user.pokemon) {
            poke.currentXp += 100
            poke.levelUp()
        }
        setTimeout(() => {
            user.changeRoom()
        }, 500)
        
    }
    heal() {
        const pokeTable = document.querySelector('.poke-menu')
        pokeTable.style.display = 'none'
        updateLog(`You healed your pokemon                                 `)
        for (let poke of user.pokemon) {
            poke.currentHp = poke.hp
        }
        user.changeHp()
        setTimeout(() => {
            user.changeRoom()
        }, 500)
        
    }
    changeActive() {
        const buttons = document.querySelectorAll('.menu')
        buttons[0].style.display = 'none'
        const pokeTable = document.querySelector('.poke-menu')
        pokeTable.style.display = 'block'
        const rows = document.querySelectorAll('tr')
        const poke0 = document.querySelectorAll('#poke0 th')
        const poke1 = document.querySelectorAll('#poke1 th')
        const poke2 = document.querySelectorAll('#poke2 th')
        poke0[0].innerText = `${user.pokemon[0].name}`
        poke0[1].innerText = `${user.pokemon[0].level}`
        poke0[2].innerText = `${user.pokemon[0].currentHp}`
        poke0[3].innerText = `${user.pokemon[0].type}`
        poke1[0].innerText = `${user.pokemon[1].name}`
        poke1[1].innerText = `${user.pokemon[1].level}`
        poke1[2].innerText = `${user.pokemon[1].currentHp}`
        poke1[3].innerText = `${user.pokemon[1].type}`
        poke2[0].innerText = `${user.pokemon[2].name}`
        poke2[1].innerText = `${user.pokemon[2].level}`
        poke2[2].innerText = `${user.pokemon[2].currentHp}`
        poke2[3].innerText = `${user.pokemon[2].type}`
        rows.forEach(element => {
           
            if (element.id) {
                element.addEventListener('click', (event) => {
                    
                    let index = parseInt(element.id[4])
                   
                    if (user.active != user.pokemon[index]) {
                        
                        if(user.pokemon[index].isKod()) {
                            // alert('That pokemon is knocked out!')
                            return
                        } else {
                            buttons[2].removeEventListener('click', user.attackFunction)
                            buttons[1].removeEventListener('click', user.potionFunction)
                            user.setActive(index)
                            buttons[0].style.display = 'inline'
                            
                            pokeTable.style.display = 'none'
                            updateLog(`Switched to ${user.active.name}                                 `)
                            if(user.currentRoom.enemies != null) {
                                setTimeout(() => {
                                    user.currentRoom.enemies.attack(user)
                                    buttons[2].addEventListener('click', user.attackFunction)
                                    buttons[1].addEventListener('click', user.potionFunction)
                                }, 700)
                                
                            } else {
                                return
                            }
                    
                        }
                        // return
                    }
                    
                })
            }  
        });
    }
    setActive(ind) {
        const playerDiv = document.querySelector('.player')
        playerDiv.style.opacity = '0'
        user.active = user.pokemon[ind]
        user.changeHp()
        setTimeout(() => {
            
            const myPoke = document.querySelector('.player img')
            myPoke.setAttribute('src', user.active.img)
            playerDiv.style.opacity = '1'
            
        }, 200)
        
    }
    gameOver() {
        
        let output = this.pokemon.every((element) => {
           return element.currentHp < 1;
        })
        return output
    }
    findPotion() {
        updateLog(`You found a potion on your way to camp!                                               `)
        user.potions += 1
    }
    pokemonBrawl() {
        updateLog(`Your pokemon got angry and fought each other!                                               `)
        for (let poke of user.pokemon) {
            poke.currentHp -= 5
        }
    }
    bonded() {
        updateLog(`Your pokemon seem to be forming a tight bond! They all gain 50 xp                                                  `)
        for (let poke of user.pokemon) {
            poke.currentXp += 50
            poke.levelUp()
        }
    }
    random() {
        let randomInt = Math.floor(Math.random() * 7)
        if (randomInt === 1) {
            user.findPotion()
        } else if (randomInt === 2) {
            user.pokemonBrawl()
        } else if (randomInt === 3) {
            user.bonded()
        }
    }
    }
    

        
       
        
    

    
//user pokes
const squirtle = new PokeMon('squirtle', 'water', 0, './assets/pokePics/squirtlePixel.png')
const bulbasoar = new PokeMon('bulbasoar', 'grass', 0, './assets/pokePics/UserBulb.png')
const charmander = new PokeMon('charmander','fire', 0, './assets/pokePics/userChar.png')
//forest pokes
const forestSquirtle = new PokeMon('squirtle', 'water', 0, './assets/pokePics/squirtle.png')
const forestBulbasoar = new PokeMon('bulbasoar', 'grass', 0, './assets/pokePics/bulb.png')
const forestSnivy = new PokeMon('snivy', 'grass', 1, './assets/pokePics/snivy.png')
//cave pokes
const caveSquirtle = new PokeMon('squirtle', 'water', 0,  './assets/pokePics/squirtle.png')
const caveBulbasoar = new PokeMon('bulbasoar', 'grass', 0, './assets/pokePics/bulb.png')
const caveCharmander = new PokeMon('charmander','fire', 1, './assets/pokePics/charmander.png')
//glacier pokes

const iceSpheal = new PokeMon('spheal', 'water', 1, './assets/pokePics/spheal.png')
const iceSquirtle = new PokeMon('squirtle','water', 1, './assets/pokePics/squirtle.png')
const iceSquirtle2 = new PokeMon('squirtle', 'water', 2, './assets/pokePics/squirtle.png')
//champ pokes
const champSquirtle = new PokeMon('squirtle', 'water', 1, './assets/pokePics/squirtle.png')
const champBulbasoar = new PokeMon('bulbasoar', 'grass', 2, './assets/pokePics/bulb.png')
const champCharmander = new PokeMon('charizard','fire', 2, './assets/pokePics/charmander.png')
// enemies
const forestEnemy = new Enemy('The Forest King')
const caveEnemy = new Enemy('The Cave Dweller')
const glacierEnemy = new Enemy('The Ice Man')
const pokeChamp = new Enemy('The Champ')
//give neemies pokes
forestEnemy.addPoke(forestSquirtle)
forestEnemy.addPoke(forestBulbasoar)
forestEnemy.addPoke(forestSnivy)
caveEnemy.addPoke(caveSquirtle)
caveEnemy.addPoke(caveBulbasoar)
caveEnemy.addPoke(caveCharmander)
glacierEnemy.addPoke(iceSpheal)
glacierEnemy.addPoke(iceSquirtle)
glacierEnemy.addPoke(iceSquirtle2)
pokeChamp.addPoke(champBulbasoar)
pokeChamp.addPoke(champSquirtle)
pokeChamp.addPoke(champCharmander)
// keeps track of things
let roomI = 1;
let logNumber = 1
//set up room
const safeRoom = new Room('Camp', null, "./assets/backgrounds/night.jpg")
const forest = new Room('The Forest', forestEnemy, './assets/backgrounds/forest.jpg')
const cave = new Room('The Cave', caveEnemy, './assets/backgrounds/cave.jpg')
const glacier = new Room('The Glacier', glacierEnemy,'./assets/backgrounds/glacier.jpg' )
const victoryRoad = new Room('Victory Road', pokeChamp, './assets/backgrounds/victory.jpg')
const rooms = [forest, cave, glacier, victoryRoad]
// set up user
const user = new User('Ash')
user.addPoke(squirtle)
user.addPoke(bulbasoar)
user.addPoke(charmander)
//put enemies in rooms
forestEnemy.currentRoom = forest
caveEnemy.currentRoom = cave
glacierEnemy.currentRoom = glacier
pokeChamp.currentRoom = victoryRoad









//plays game
function play() {
    
    const myPoke = document.querySelector('.player img')
    myPoke.setAttribute('src', user.active.img)
    
    const enemyPoke = document.querySelector('.enemy img')
    enemyPoke.setAttribute('src', user.currentRoom.enemies.active.img)
    user.battle()
   
}
//called on defeat
function endGame() {
    let container = document.querySelector('.container')
    container.style.display = 'none'
    let gameOverScreen = document.querySelector('.game-over')
    gameOverScreen.style.display = 'block'
    setTimeout(() => {
        gameOverScreen.style.opacity = '1'
    }, 500)
    
    let resetButton = document.querySelectorAll('.reset')[0]
    resetButton.addEventListener('click', () => {
        location.reload()
    })
}
//called on win
function victory() {
    let container = document.querySelector('.container')
    container.style.display = 'none'
    let victoryScreen = document.querySelector('.victory')
    victoryScreen.style.display = 'block'
    setTimeout(() => {
        victoryScreen.style.opacity = '1'
    }, 500)
    
    let resetButton = document.querySelectorAll('.reset')[1]
    resetButton.addEventListener('click', () => {
        location.reload()
    })
}
//updates game log
function updateLog(string) {
    const log = document.querySelector('#log');
    log.value = logNumber + '. ' + string + log.value 
    logNumber ++
    
}


play()
