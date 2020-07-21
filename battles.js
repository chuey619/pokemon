// class Trainer{
//     constructor(name, pokeArr, room) {
//         this.name = name
//         this.pokemon = pokeArr
//         this.currentRoom = room
//         this.activePoke = this.pokemon[0]
//     }
//     isDefeated() {
//         return this.pokemon.length < 1
//     }
//     attack() {
//         let currentEnemy = this.currentRoom.enemies[0]
//         if(currentEnemy) {
//             currentEnemy.activePoke.hp -= this.activePoke.attackPower
//             console.log(currentEnemy.activePoke.hp)
//             console.log('attacked enemy pokemon')
//             if(currentEnemy.activePoke.isKod()) {
//                 currentEnemy.removePoke()
//             }
//         } else {
//             console.log('all enemies are defeated')
//             return
//         }
        
//     }
//     battle() {
//         let currentEnemy = this.currentRoom.enemies[0]
//         while(this.currentRoom.enemies.length > 0) {
//             let move = prompt('What action would you like to take?')
//             if(move === 'attack'){
//                 this.attack()
//                 currentEnemy.attackUser()
//             }
            
//         }
//         console.log('youve cleared this room')
//         return
//     } 
// }
// class Enemy extends Trainer{
//     constructor(name, pokeArr, room){
//         super(name, pokeArr, room)
//     }
//     removePoke() {
//         this.pokemon.splice(this.pokemon.indexOf(this.activePoke), 1)
//         if(!this.isDefeated) {
//             console.log(`you defeated the enemies ${this.activePoke.name} they switched to ${this.pokemon[0].name}`)
//             this.activePoke = this.pokemon[0]
//         } else {
//             this.removeFromRoom()
//         }
//     }
//     moveToRoom(room) {
//         room.enemies.push(this)
//         console.log('moved to room')
//         console.log(room.enemies)
//     }
//     removeFromRoom() {
//         this.currentRoom.enemies.splice(this.currentRoom.enemies.indexOf(this, 1))
//         console.log('removed enemy from room')
//     }
//     attackUser() {
//         user.activePoke.hp -= this.activePoke.attackPower
//     }
    
// }
// class Pokemon {
//     constructor(name, image) {
//         this.name = name;
//         this.image = image;
//         this.hp = 50
//         this.attackPower = 10
//     }
//     isKod() {
//         return this.hp < 1
//     }
// }
// class Room {
//     constructor(name){
//         this.name = name
//         this.enemies = []
//     }
// }

// const squirtle = new Pokemon('squirtle', 'C:\Users\Chuey\ga-sei\PokemonProject\pokemon\assets\pokePics\download.png')
// const charmander = new Pokemon('charmander', 'C:\Users\Chuey\ga-sei\PokemonProject\pokemon\assets\pokePics\char.jpg')
// const bulbasoar = new Pokemon('bulbasoar', 'C:\Users\Chuey\ga-sei\PokemonProject\pokemon\assets\pokePics\bulb.jpg')
// const starters = [squirtle, charmander, bulbasoar]
// const forestRoom = new Room('Forest')
// const caveRoom = new Room('cave');
// const user = new Trainer('user', starters, forestRoom)
// const enemy = new Enemy('enemy1', starters, forestRoom);
// enemy.moveToRoom(forestRoom)

// user.battle()
// console.log(forestRoom.enemies + 'last console log')

//room 
//has enemies
//battle room while it still has enemies

class Room{
    constructor(name, enemies) {
        this.name = name;
        this.enemies = enemies;
    }
}

class Trainer {
    constructor(name, pokes) {
        this.name = name;
        this.pokes = pokes;
        this.potions = 3;
        this.activePoke = this.pokes[0]
    }
    
    
    

    }
