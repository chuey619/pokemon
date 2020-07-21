class Room {
    constructor(name, enemies, color){
        this.name = name;
        this.enemies = enemies;
        this.color = color
    }
    isCleared() {
        return this.enemies === null
    }
}
class PokeMon {
    constructor(name) {
        this.name = name;
        this.hp = 20;
        this.attack = 10;
        this.currentHp = this.hp;
    }
    isKod() {
        return this.currentHp < 1
    }
}
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
        target.active.currentHp -= this.active.attack
        alert(`The ememies ${this.active.name} attacked your ${target.active.name} for ${this.active.attack} damage`)
    }
    removeActive() {
        this.pokemon.splice(0, 1)
        }
    setActive() {
        if(this.pokemon) {
            this.active = this.pokemon[0]
            alert(`enemy sent out ${this.active.name}`)
        } 
    }
    removeFromRoom() {
        alert(`you defeated ${this.name}`)
        this.currentRoom.enemies = null
    }
    isDefeated() {
        return this.pokemon.length < 1
    }
}
class User extends Enemy {
    constructor(name){
        super(name)
        this.currentRoom = forest
        this.action;
        this.potions = 3;
    
    }
    attack(target) {
        target.active.currentHp -= this.active.attack
        alert(`Your ${this.active.name} attacked the enemies ${target.active.name} for ${this.active.attack} damage`)
    }
    usePotion() {
        if(this.potions) {
            if(this.active.currentHp + 25 < this.active.hp) {
                alert(`Healed your ${this.active.name} for 25 hp`)
                this.active.currentHp += 25;
                this.potions -= 1;
            } else {
                alert(`Fully healed your ${this.active.name}`)
                this.active.currentHp += 25;
                this.potions -= 1;
            }
            
        } else {
            alert(`all out of potions`)
        }
    }
    showStatus() {
        for (let poke of chuey.pokemon) {
            alert(`${poke.name} ${poke.currentHp}`)
        }
    }
    changeRoom() {
        let screen = document.querySelector('.screen')
        if (roomI === rooms.length) {
            alert('you win!!!!!!')
            return
        }
        chuey.currentRoom = rooms[roomI]
        screen.style.backgroundColor = chuey.currentRoom.color
        roomI ++
        console.log(chuey.currentRoom)
        chuey.battle()
        
        
    }
    advanceRoom() {
        const buttons = document.querySelectorAll('button')
        buttons[0].innerText = 'Check Status'
        buttons[1].innerText = 'Advance Rooms'
        buttons[0].removeEventListener('click', chuey.attackFunction)
        buttons[1].removeEventListener('click', chuey.potionFunction)
        buttons[0].addEventListener('click',  chuey.showStatus)
        buttons[1].addEventListener('click', chuey.changeRoom)
    }
    attackFunction(){
        console.log(chuey)
        if (chuey.currentRoom.enemies != null) {
            chuey.attack(chuey.currentRoom.enemies)
            //console.log(room.enemies.active.hp)
            if(chuey.currentRoom.enemies.active.isKod() && chuey.currentRoom.enemies.pokemon.length > 1){
                alert(`defeated the enemies ${chuey.currentRoom.enemies.active.name}`)
                chuey.currentRoom.enemies.removeActive()
                chuey.currentRoom.enemies.setActive()
                chuey.currentRoom.enemies.attack(chuey)
            } else if (chuey.currentRoom.enemies.active.isKod()) {
                chuey.currentRoom.enemies.removeFromRoom()
                chuey.advanceRoom()
            } else {
                chuey.currentRoom.enemies.attack(chuey)
            }
        }
    }
    potionFunction(){
        chuey.usePotion()
        chuey.currentRoom.enemies.attack(chuey)
    }
    battle() {
        const buttons = document.querySelectorAll('button');
        console.log(this.currentRoom.isCleared())
        buttons[0].removeEventListener('click', chuey.showStatus)
        buttons[1].removeEventListener('click', chuey.changeRoom)
        buttons[0].innerText = 'attack'
        buttons[1].innerText = 'use potion'
        buttons[0].addEventListener('click', chuey.attackFunction) 
        buttons[1].addEventListener('click', chuey.potionFunction)
    }
    }
    

        
       
        
    

    

const squirtle = new PokeMon('squirtle')
const squirtle2 = new PokeMon('squirtle2')
const squirtle3 = new PokeMon('squirtle3')
const test1 = new Enemy('test enemy')
const test2 = new Enemy('test enemy2')

test1.addPoke(squirtle2)
test2.addPoke(squirtle2)
test2.addPoke(squirtle3)
let roomI = 1;
const forestEnemies = test1
const caveEnemies = test1
const glacierEnemies = test1
const skyEnemies = test1
const forest = new Room('Forest', forestEnemies, 'lightgreen')
const cave = new Room('Cave', caveEnemies, 'lightslategrey')
const glacier = new Room('Glacier', glacierEnemies,'skyblue' )
const victoryRoad = new Room('Victory Road', skyEnemies, 'darkred')
const rooms = [forest, cave, glacier, victoryRoad]
const chuey = new User('user')
chuey.addPoke(squirtle)
test1.currentRoom = forest
test2.currentRoom = forest
// console.log(test2.isDefeated())
// console.log(test2.pokemon)








function roomBattle() {
      chuey.battle()
      if(chuey.currentRoom.isCleared()) {
         chuey.advanceRoom()
      }
      
}
function play() {
       advanceRoom()
   
}
// console.log(chuey.currentRoom.isCleared(

for (let room of rooms) {
    chuey.battle()
}




