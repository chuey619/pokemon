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
class PokeMon {
    constructor(name, type, img) {
        this.name = name
        this.img = img
        this.hp = 20;
        this.attack = 10
        this.level = 0
        this.currentHp = this.hp;
        this.currentXp = 0
        this.xpToLevel = 100 
        this.xpGiven = 50
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
            this.xpToLevel += 100
            this.attack += this.level * 3
            this.hp += this.level * 4
            this.currentHp += 15
            if(this.currentHp > this.hp) {
                this.currentHp = this.hp
            }
            chuey.changeHp()
            updateLog(`Your ${this.name} leveled up to level ${this.level} and gained attack +${this.level * 3} and Max HP +${this.level * 4}!                                 ` )
        }
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
        console.log(target.active.currentHp)
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
        
        chuey.currentRoom.enemies.changeHp()
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
        chuey.currentRoom = rooms[roomI]
        updateLog(`Moving to ${chuey.currentRoom.name}                                 `)
        setTimeout(() => {
           
            
        }, 500)
        screen.style.backgroundImage = 'url(' + chuey.currentRoom.background + ')'
        roomI ++
        
        const enemyPokeImg = document.querySelector('.enemy img')
    
        enemyPokeImg.setAttribute('src', this.currentRoom.enemies.active.img)
        chuey.battle()
        chuey.currentRoom.enemies.changeHp()
        
        
    }
    advanceRoom() {
        let screen = document.querySelector('.screen')
        chuey.currentRoom = safeRoom
        chuey.random()
        screen.style.backgroundImage = 'url(' + chuey.currentRoom.background + ')'
        
        const buttons = document.querySelectorAll('.menu')
        buttons[1].innerText = 'Heal'
        buttons[2].innerText = 'Train'
        buttons[1].removeEventListener('click', chuey.potionFunction)
        buttons[2].removeEventListener('click', chuey.attackFunction)
        if (roomI === rooms.length) {
            victory()
        }
        buttons[0].addEventListener('click',  chuey.changeActive)
        buttons[1].addEventListener('click', chuey.heal)
        buttons[2].addEventListener('click', chuey.train)
    }
    attackFunction(){
        const buttons = document.querySelectorAll('.menu')
        buttons[2].removeEventListener('click', chuey.attackFunction)
        const pokeTable = document.querySelector('.poke-menu')
        pokeTable.style.display = 'none'
        if(chuey.active.isKod()) {
            updateLog('You must switch pokemon or heal!!!                                 ')
            return 
        }
        const enemyPoke = document.querySelector('.enemy')
        if (chuey.currentRoom.enemies != null) {
            chuey.attack(chuey.currentRoom.enemies)
            if(chuey.currentRoom.enemies.active.isKod() && chuey.currentRoom.enemies.pokemon.length > 1){
                updateLog(`Defeated the enemies ${chuey.currentRoom.enemies.active.name}!                                 `)
                chuey.active.getXP(chuey.currentRoom.enemies.active.xpGiven)
                setTimeout(() => {
                    chuey.currentRoom.enemies.removeActive()
                    chuey.currentRoom.enemies.setActive()
                    buttons[2].addEventListener('click', chuey.attackFunction)
                }, 500)
              
            } else if (chuey.currentRoom.enemies.active.isKod()) {
                chuey.active.getXP(chuey.currentRoom.enemies.active.xpGiven)
                setTimeout(() => {
                    chuey.currentRoom.enemies.removeFromRoom()
                    enemyPoke.style.display = 'none'
                    chuey.advanceRoom()
                }, 500)
                
            } else {
                setTimeout(() => {
                    chuey.currentRoom.enemies.attack(chuey)
                    buttons[2].addEventListener('click', chuey.attackFunction)
                },500)
                
                
            }
            
        } else {
            let screen = document.querySelector('.screen')
            
            chuey.advanceRoom()
        }
        
    }
   
    potionFunction(){
        const pokeTable = document.querySelector('.poke-menu')
        pokeTable.style.display = 'none'
        const buttons = document.querySelectorAll('.menu')
        
        if(chuey.potions) {
            buttons[1].removeEventListener('click', chuey.potionFunction)
            chuey.usePotion()
            setTimeout(() => {
                chuey.currentRoom.enemies.attack(chuey)
                buttons[1].addEventListener('click', chuey.potionFunction)
            }, 400)
            
        } else {
            updateLog('all out of potions                                 ')
        }
        
    }
    battle() {
        const buttons = document.querySelectorAll('.menu');
        buttons[0].addEventListener('click', chuey.changeActive)
        buttons[1].removeEventListener('click', chuey.heal)
        buttons[2].removeEventListener('click', chuey.train)
        buttons[2].innerText = 'attack'
        buttons[1].innerText = 'use potion'
        buttons[2].addEventListener('click', chuey.attackFunction) 
        buttons[1].addEventListener('click', chuey.potionFunction)
    }
    train() {
        
        const pokeTable = document.querySelector('.poke-menu')
        pokeTable.style.display = 'none'
        updateLog(`You trained your pokemon and they gained 100xp                                 `)
        for (let poke of chuey.pokemon) {
            poke.currentXp += 100
            poke.levelUp()
        }
        setTimeout(() => {
            chuey.changeRoom()
        }, 500)
        
    }
    heal() {
        const pokeTable = document.querySelector('.poke-menu')
        pokeTable.style.display = 'none'
        updateLog(`You healed your pokemon                                 `)
        for (let poke of chuey.pokemon) {
            poke.currentHp = poke.hp
        }
        chuey.changeHp()
        setTimeout(() => {
            chuey.changeRoom()
        }, 500)
        
    }
    changeActive() {
        
        const pokeTable = document.querySelector('.poke-menu')
        pokeTable.style.display = 'block'
        const rows = document.querySelectorAll('tr')
        const poke0 = document.querySelectorAll('#poke0 th')
        const poke1 = document.querySelectorAll('#poke1 th')
        const poke2 = document.querySelectorAll('#poke2 th')
        poke0[0].innerText = `${chuey.pokemon[0].name}`
        poke0[1].innerText = `${chuey.pokemon[0].level}`
        poke0[2].innerText = `${chuey.pokemon[0].currentHp}`
        poke0[3].innerText = `${chuey.pokemon[0].type}`
        poke1[0].innerText = `${chuey.pokemon[1].name}`
        poke1[1].innerText = `${chuey.pokemon[1].level}`
        poke1[2].innerText = `${chuey.pokemon[1].currentHp}`
        poke1[3].innerText = `${chuey.pokemon[1].type}`
        poke2[0].innerText = `${chuey.pokemon[2].name}`
        poke2[1].innerText = `${chuey.pokemon[2].level}`
        poke2[2].innerText = `${chuey.pokemon[2].currentHp}`
        poke2[3].innerText = `${chuey.pokemon[2].type}`
        rows.forEach(element => {
           
            if (element.id) {
                element.addEventListener('click', (event) => {
                    
                    let index = parseInt(element.id[4])
                   
                    if (chuey.active != chuey.pokemon[index]) {
                        if(chuey.pokemon[index].isKod()) {
                            // alert('That pokemon is knocked out!')
                            return
                        } else {
                            
                            chuey.setActive(index)
                            
                            pokeTable.style.display = 'none'
                            updateLog(`Switched to ${chuey.active.name}                                 `)
                            if(chuey.currentRoom.enemies != null) {
                                setTimeout(() => {
                                    chuey.currentRoom.enemies.attack(chuey)
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
        chuey.active = chuey.pokemon[ind]
        chuey.changeHp()
        setTimeout(() => {
            
            const myPoke = document.querySelector('.player img')
            myPoke.setAttribute('src', chuey.active.img)
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
        chuey.potions += 1
    }
    pokemonBrawl() {
        updateLog(`Your pokemon got angry and fought each other!                                               `)
        for (let poke of chuey.pokemon) {
            poke.currentHp -= 5
        }
    }
    bonded() {
        updateLog(`Your pokemon seem to be forming a tight bond! They all gain 50 xp                                                  `)
        for (let poke of chuey.pokemon) {
            poke.currentXp += 50
            poke.levelUp()
        }
    }
    random() {
        let randomInt = Math.floor(Math.random() * 7)
        if (randomInt === 1) {
            chuey.findPotion()
        } else if (randomInt === 2) {
            chuey.pokemonBrawl()
        } else if (randomInt === 3) {
            chuey.bonded()
        }
    }
    }
    

        
       
        
    

    

const squirtle = new PokeMon('squirtle', 'water', './assets/squirtlePixel.png')
const bulbasoar = new PokeMon('bulbasoar', 'grass', './assets/UserBulb.png')
const charmander = new PokeMon('charmander','fire', './assets/userChar.png')
const squirtle2 = new PokeMon('squirtle', 'water', './assets/squirtle.png')
const bulbasoar2 = new PokeMon('bulbasoar', 'grass', './assets/bulb.png')
const charmander2 = new PokeMon('charmander','fire', './assets/charmander.png')
const squirtle3 = new PokeMon('squirtle', 'water', './assets/squirtle.png')
const bulbasoar3 = new PokeMon('bulbasoar', 'grass', './assets/bulb.png')
const charmander3 = new PokeMon('charmander','fire', './assets/charmander.png')
const squirtle4 = new PokeMon('squirtle', 'water', './assets/squirtle.png')
const bulbasoar4 = new PokeMon('bulbasoar', 'grass', './assets/bulb.png')
const charmander4 = new PokeMon('charmander','fire', './assets/charmander.png')
const squirtle5 = new PokeMon('squirtle', 'water', './assets/squirtle.png')
const bulbasoar5 = new PokeMon('bulbasoar', 'grass', './assets/bulb.png')
const charmander5 = new PokeMon('charmander','fire', './assets/charmander.png')
const test1 = new Enemy('test enemy')
const test2 = new Enemy('test enemy2')
const test3 = new Enemy('test enemy2')
const test4 = new Enemy('test enemy2')
test1.addPoke(squirtle2)
test1.addPoke(charmander2)
test1.addPoke(bulbasoar2)
test2.addPoke(squirtle3)
test2.addPoke(charmander3)
test2.addPoke(bulbasoar3)
test3.addPoke(squirtle4)
test3.addPoke(charmander4)
test3.addPoke(bulbasoar4)
test4.addPoke(squirtle5)
test4.addPoke(charmander5)
test4.addPoke(bulbasoar5)

let roomI = 1;
let logNumber = 1
const forestEnemies = test1
const caveEnemies = test2
const glacierEnemies = test3
const skyEnemies = test4
const safeRoom = new Room('Camp', null, "data:image/jpeg;base64,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")
const forest = new Room('The Forest', forestEnemies, 'data:image/jpeg;base64,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')
const cave = new Room('The Cave', caveEnemies, 'data:image/jpeg;base64,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')
const glacier = new Room('The Glacier', glacierEnemies,'data:image/jpeg;base64,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' )
const victoryRoad = new Room('Victory Road', skyEnemies, 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxMSEhUTEhMWFRUXFxUYFxgXFRUWFxUVFRUXFxcVFRUYHSggGBolGxUVITEhJSkrLi4uFx8zODMtNygtLisBCgoKDg0OGhAQGysfHyUtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLf/AABEIAKoBKQMBIgACEQEDEQH/xAAcAAACAwEBAQEAAAAAAAAAAAADBAIFBgEABwj/xAA+EAABAwIEAwYDBgQGAgMAAAABAAIRAyEEEjFBBVFhEyJxgZGhBjKxFEJSwdHwFSPh8WJygpKisjPCB0OT/8QAGgEAAwEBAQEAAAAAAAAAAAAAAQIDAAQFBv/EACoRAAICAQQCAgEDBQEAAAAAAAABAhEDBBIhMRNBMlEiBUJhFBVxodFS/9oADAMBAAIRAxEAPwA1fBPZ8zSPKyhTC+ghgPVVeI+GWucS12UHaPovpI62L+fB809LL9vJlw1Go0C4gNEkrSUfhxjT3iXD0WgweEYxoDQAApZdbFfHkri0kn8uCt4XwdtJskAu3MadArHsuiYyqJXmSyuTtnoxxKKpACwBL1GJqol6jtlkwOIq5qapUIC9QoyZ2TwYtKYY4xUUui72XRN9moOCXcNsEMTQkEcwsnicIWOgrc5JKhicI1zYLQr4dR4znzaberRhezXRTT+Nw2R5G2yDTpEmACT0XpKaas8xxadC/Zr3ZpuphnN+ZpHiEOFlOxXGuwHZr3ZI8LoajuNQt2SO3h7yMwYSPBGw9KXNETJC3ApgCAufPqPHVI6dPp/LbZ87FGTEXmFtMFgxTYGjYe6ZdQadWj0RQFyZdT5EkduHS+Nt9gOyXDTTZYoFqhvOjxinZLwpdE0aag5beDYhSqxBNNNuao5EykI4ivZdF4UZ2TWRNMoALbzLHYhTwnMIj6Y5JwhCc1DeN46EX0kF1NWDmIFRipGROUROEJHeECFQixqlVFkZ9bkqXheNZWbmpuzDS3PkVe4XDCAStkSibG2+jtLvEAqwZTCC2BoFOnVXJJ2dkOArqcJKs4yrA1AkMSwc0Ijy6AF6myhJuowmqTrIt10LFW+QrGWXCu0pJUiy6SylESFwU1N5gJZzt1kB0gzzCE5xKhnUGuumSEbCHAtqfMLJilhWN+VoHgFOk7QKVV8Ib30OoRXNCeNo5gRCyNallcW8itk96quJcNz95uu/VdOny7XTOPV4XNXEoIXQ1GZhXOOUNJPKFp+EcHFMBzrvI8h4Lqy54wRw4dPLI66K/gfCnB4qPbAi3ir15RiUBy83JkeR2z2MeGOKO1A1Oi2SoFM4ZlpStjI85qgAjOUCEtj0AqlAIR6iUxmJbSbmcY+pTJk5P7CZVJlOVmsV8QuiWANvvcpbB/GbmuAqMEbkakdE6TfRz+fGnVm2bQAXSAq/hHHqWJnJII1BH5qxhI7XZ1RcWrQNwQ3NRpUSFkzNC72peoE1VSb3XhViSmJ4l0JLOeabxWqTXSujkl2fO/g74i+y1IeJpuIzf4T+IL7DhsQ17GuYZa4Ag8wV+egVsfg74u+zAUajZpl3zTds/kq5se7lHPgy7HT6PrJQnPKmagc0FpBBvIStSpdcSR6DkOtqJetVug9oUWlh3EiRZbal2bc3wcZJTlGkYTFGiBspvfCnKVlYxogyyi5yg96FJKWgtnS+UCo665VJBQXGFRIRsI5yNhGSZQsNQLzrAVlSpBtkJOgwVuzjwh1AiuQnlTRRgHOuoySV1+qZo4YalO3SJpNhcJTyza535oziolelTbsulSIOKi4rzygkooVsk0SYTtNsCEpQddNF6zNFHCoIdasGglzg0C9yqM/EjC6KckbmICyQJZIx7Lt7gLlJ45lN7TmjSxOyrf44wm9vJV3FeIB4hog8/wCixGWVUUvE4zQI8RohfD9Oia38/wCUAwDoT1S+JMam/NVj6pK6oL8Tzm6lZ9TwVakwfymtAOsfmnaeMJiGrBfDPGKNBvfBLydbkAc1oMb8WUGxDtfwifVRlB2d0My223Ro31QBmJ01XRUB0MrMt+JaTmz2jY66+iJR+IqAFnN6XhLsZTzR+y9qlIVHXVJxb4p7OMga/ndCwvxZQqfMSx24dp5FVimSnli+LLWuZSik3Fse3O1wLec2S322n+Nv+4K6aISas+NU6gTjWMMXI8RZVDXp2hiiLajkrtnLOD9Gx+GviE4VwBqF9LdvKfvDwX0LCYttVoex2YG4K+IPeCZAhXPw18QOwjyQ3O1wgtJI8wpuHsbFkceGfYqDZIV00rLfC3xNRxhLWAtc0SQfSx3WnBXJku+T0cLVcE3OsgqOIfCX7YpFFlHNDToUe0A0Sr3kqMo7Qbx1tQHVerNaRBSYclcVxijSMVKjWnWCb+iCi/QfIq5LWmAwQFLPKwuN+M3l0UaXdvd3sQkMK/E4qo1hrkGDvlEdY1Kbxv2SeoXUVZ9IzqLuiznCeEVabjmxUtJBIaZJI6nRaQYhnNK1XRWM3Jc8C7JLhbdWQCWZiGk2TIclkUidAUXLhKDUxTAQ1zgCQTBOw1KWhmzzxdRychKqMZ8R0mzldm8P1VXV+LHzDGCOs/kmoi8kV2W2L4lWpvytw7nCJBBGsqmxmN4hWf3WPpiPltA80eh8TA/OCD0SmM+JKjrU+4OZufJMmvojNpr5MQxfCcQCHV3Eg696dNl19aBlbYIbsQ4iXuLvE6pXOhKVkdqXQZ7zqIK8cR68kPtFFzggHaL4gSl6OHJNhHXknW07yjMGyfy0qQnit8i7MG0C9yq+qwGYOmx2CtQ7ZBxFMG3T2SxytPkd4k1wUzrIZKedgyBIPqElX11XRHKmc8sbRBzipOwj4kiBtNvqneBsmpm2APqdFbY2mXG4DtIB2XLn1ThLaho4Mk47omSr1HMBbmtNwD+QSuX/ADehWixbsujGjwASP2wrjeVy5YP6fL9GYGE1/cI+FwZcSP6I7SJKZwZ7x8V7XkGcRcYB4Gk9OnNN4Hhufceh8x4qwpOl+WYltkJ/FW07fMW2Mbp1Kye1F38Ms+zO7VrjJs7YRK+r4SrmYHDcSviFDjLIIkwZ8p5q/wAN8Y1qVNhpw5jQ4Fp1k/KSeQKnLG5vgvjyxgj6XWSWJxLWNL3mGi5JXzXGfHeJe0NBDDu4C5VDieI1anz1HOvMFxj0VoaOX7mLPUr0fUX/ABfhACe0mJsAZMclS47/AOQB/wDTS83/AKBYFglNU2AakDxVXpsce+SL1M3wi9rfEeKrSC7LMfLbfZRpUYMuOZ25Nz6qq/itKmJBzHkP1QXfEPJo9VCS9LgybfLL5ztkKo6xO50hV2G4g193d2fSeUpzU2NlPZQbF8PiatIyx7h5n6J8cdxR0qn0CCaXVeLAAncv4Ar+wx4liCQe1dI5GFa4b4oxLfmeXaaxaFQmpAt6oD8ZFhrzS7HL0MpuPs0ON+K8Q4R2hb1EBVb+JPc6X1HOMRc7clUuqk6qOdOsXAjySfsvWY4bqJxwVMaq5nSeBB8jLtuNRKeKBKoM6LSrxuklhXoaORl5VxQNkF2KVQ7ElQNYpVhG8jLY4teGLVPnXWOReJA3s0VHGCFI4oc1QMqHREbUUXiLLIy5p1fdczXKqG10cYuylKDRSOReywlLvoC/7ulBjuaY4eTVfA+UXJ/JSnuirKKUZOh7BsFMCd+8dpjQKbakkztr4n9F6sReoflaO75KtqYiKRM3dPuvPc3J2dqgoqiOMqdyeZJVNnR8ZX7oAOirc6dC1ZXU8LUGUkENJF+m/hZaSlinkk02NA8hZWVPgjatJzmOGaJgySYElUZrloBi7TEjXzG6rl1LzHItG38y3w2CrVBmNIEDrB0mQB0MKqx1A4cw+mQXjMC4zPP0VvwrjdRkQT5Q4f7Tp5JziDamOaxhDWjNLXOLmMnQga3M7cgtptRKE6l0bJoI7fxbsyLcUN2AjwXnVm3y5mztt4Kyr4KnSc9j9QQ3LcmSNQeWnqoYOnRd3XAA89/EHZepLW4o8p2cK0s30irbVQftjpPdWobwei2oJJgtBZfuueJzNcbRtAm/NHo8N7QkNqlneJDcsR0jXYIT/WFHiPJdaDJ7SMbVxtTW7QDGm/JArYlzzJK+hj4drtbIdTMkyS5153IIgkrK/EHCsgD2tEye0ymWg3M625WtZDF+orLKmTeJwdSVFFKm1yGvErsTA0OsrbT5JiniiNyFWByIKqaxHAvsPxA7m0Js4rzWcbVhNU6vJMmvZN2iyq1pQ5QG1uacw1HNdXuKXBPlsi0FHp4UlHp0ACNUUPAJUZzfooooXZgxubolLCCbrjnt13UKuM5KT3sdbUF+yC10KpRA5Ql3Ypx3UWhzjYF3OASlcZLlsO6L6R55UUQgNs8EEi0ggf3TmF4exwBNYC2mU6HqYGy4suvhB0lZ0R0mSSsr5XlZ4vhbGNc4V2OIEhsQT0FzJ8lVki15nSLqmPVY8iuyWTFODpomHLwfClWw72gFzSARIJFiOhQSq2n0LyuyWdeDlEKVBpc7K0S7khKUUuTdnZWk4fTyUw0fM656f2CzWZ7H3ZIab/3VhXx2Yh07RA253XlavNv/ABid2ijHc37L/GYMPYGZnATcNibaa7KjfwM1JFOrDZ0ff/kP0S1PGPmGktbN+8b7xyjxVvg+JEj+YzMObRB5X2K4qcTunCM/kZjiOAqUBmdBbMZmkESdjFx5qt+0+C2HH+xdTLGNcJkkaRtp0JWT/hzebvb9FWEk1ycOTG4Osb4Lajj6jJ7NxaNy2xPmpcHxTGVia1Nr2kEEOEwduvmLqTT0Q3g37oIPMm3UdUOC8JZW7aRZ8JqUab3AsbUbJhwLmnKdIEz/AGTXE6TKrpoVKlOIhpJyz0vrKpqbGkXDg4HXMACOQACm/DzBFUAxN3aHlNrpWUeSaXX+xTGNe6p33lzzEmSfK/JMY/hNZmU2e0/K5pBPmNWn9yUq69p03HknqL6Y0fUnLBJ2O8Rt0KbcbHkUl9D3D+FYjs3OLSQJzNJaXEAfMG680v8Aa7TJIEQdSBYC+4uPVeo497JLXQfukiOYnW267Rp0RUzOloOmQN7psQ4CTvFv7BP8hlk6UWjzuMVSC3O4xHdkyf3O6Xq4cVqZ2fs0kQRaY6+PqrDiT6lR1N4MFtnVMwY57drm1hMTMSh4mo0tDWhjc+btP5hsZytbIhogd64IkT0TxfFrg4ssW5tyV/RlqnB3mS2OjZvM6X0AG/Tqo0eDvIMwDsDrMjXpc+i0DKtNpc0MMztUzgADSRYgc0OlVk92fE6DzOi6v63KlRBRt0UH8JqWtqY6NENIc4jo7QXEIY4fVH3Dt73Bv0WwoUnEGHNkdRJt90TeAPZEweDe42gnrA/eib+5TXpFPC30Y52CqjVh9iu06D9MrvRb3+GVPwtUhgiBdrJWX6pJekZ6ObMS2hU3aUxQFRps0+i1xoxq1nl+SVdVHJvoVl+qz/8AKJS0rRUitU/B5rmWodla3OjPZc7R7WmzuUbRv9B6Ir9WyL9qE8D/AJKl1Fw/uoupwJkfmfBPvcXXyi53sR63S2KwxcDIaCORuZ5Wgof3PM/oywWL4OuzN32uI6c+vRWLuKuYP5Jyhp70QOkdb/1SLMOZjOGzNpgAnmdhP1Ks6fB8OGy6q+o8Akmm05AT/iLXZvbwXPm1Esrub/4ehpoUqiq/kR4ljn1AHVANO6RImTE6x7JanDQDmMRpMFsGII8inMTgqZqDsj2jXNktIAMgiQCwDa+nPWy9geGmrmFNnzXaS/LEciReddFPijoqVgO1ZqCSP3bqvUMaxjppt7sXzR825aeWlk8/h1Zhy1GfL3nREQdDI0EA+iUZhCHZhtdpENg2voZ3shwSnlafRbUOPUn0TSc5wIBgEAi5mJjS/NIYgYfsy5pfn2EgtPiYlKUcEZtBcDaT3fcc0enScAQWtm15goqbj8WycskZfKNllwUsOtMk793MPdPY7AtYRUp04Md4iBN7WnXwWeOJqU7tkX1a4g/Sw80Ctj3uMk683SdvdJy3dhlkx7dtUN4rEtFnSCdiJ8jG6Re6+o/IdI3S+IE6kk6R5yicNdSk9sCBI0vA5+qZdAxOvxiqJAiLDM47Rzv4pnt6jSJGXo0m0xMbBM8Vw7cjTh3Zr3azUNIJzO5aCyUwbmSO64uNyDMAjmd0LsMpNSqYdmMY1xLaeadC8mQYvIab+gQv4lX/AAM//NNVs7RmbTaNL3/pyKF9tq/gZ/uclM86+y0PDmXaCS7nYAR/f2XWcOi8ZhMWEn08AqrDYjLUmSRYa6DeVosLibTmt+XhuknuRGGXayvdhWO2QDw9u6sGYd0yLiTrbbcbLlUFsSIQUjvWyXQGjggW90taf8o/Mpn+HZhBLQLzlESNlBldSp4jaB6LOymxBKPCqY1M+fWdPNGdhqI1DJ2tJ9kFtSdA30CJkcRtHh7JXYVGKXCG2AGLiJ0iNefS6i7CUPwM62AvqdEuGfuAuih0KHQWk+w4wtM/dZ6D9LojMCz8I8R+/ogCgeTkRlHofr9VrNS+g32FhNwI5QPeVx3DKP4R5QFwMPL6KFWnOsesrWw0vol9loN1LfMtleY6gLC/g1x+gS4oj8I9AjsA5e4WMQmn92iT6CfdcZg6mvdaeh/rdOsqjlHkpduOR9ELNtB08EIu6T5e1pXH4ZkXXauLDfuk+UfVBfinGe60CLSRM9VuQNpcAK+FpnnPRqq8ZRAbDQ+diW2V63FaAtaJ5OCi/iFMakeRnw2TJtCuEZejMV6bTTOufwt4Ql+H8TrULM0mS3YnwWrPEGEWBjnaPCRv0QK1dpiQLiRImx8E6m/aF8aXx4M5jcU+s/tHUmA6G3zcie7rc33tyRn4qsYAkRBGU5fpt0V0RTnUA+n5I7cOwDULOYrxN/uZSUsHUcC81jnNiDmkjkXSgOw1UjKRoeV/VaoYMLv2UJd4fAvsyrOFvF5/fgpjDEatJ5y73iLLS/ZRzUTQaN/ZbebwIz9XB2gN56uBHh1CSrYOYBptPtHhA9lrHUWEa+v9lA0qd7+pj/1WUwPCmZdnDQ898OEad4WA02Eqf8FF4i5GpnQnpyKuXYimDF5uYDXONvJSpVi6MrCDLswIy6Ahvum3MnLxQ7KqlwaXfO7/AEgAAeQTGI4UGFhuQCMwc6ZEkyTyiArptMN38dpKpeK8QAdAvsOXmhFuTOPJk3S/Hog7Es7rZs0yGxYQbW31Kj2jfx/8R+irWsJuiZTzVKRPgz1DFFlla8Px4ce98ouIuPCN1Q5LojHlsRNl0zgpIV16PovDahe3O5hbJkSV7FuY4EgiRJNz93n6j1WSocZrNAmS0jeeeo6prC42JPP30t7BcfhadlIz2tMsA8c/opsLZ3RsBiaT5lgaYA11kx3eqVxBNMwQBN41jpO6J6GLOpuh1lRvI+qcw9VokDNB2gkJCi15AIAuJFxpy8U/h2uy3IExtp08UrHlmjHtjIe2JmPJdbU5H2CWeL2JPkvBvikKKSasbLj+L6KJf/i90uWAWJE8pEqbcPOn0MLB3IkXjdxUTB3n0RBg/PyKIMJ/hKwVyAFI7e5RGUXncDzTDaB/Cjspx936fqhYaFmYZyK2id/zTAB5LxHT6IBF3U45ei92RPLzCYLI+79FEk7D2RMKvwbju0fvohvwUNy5iRrExKdLncgoODui1sFIrqmHbaGxzvr+iJUpB0QA2BsPqjvpuKh2LuaNgoWdhf3CnTw4F8rfefREc1w3H9EJ7jzC1moIK5bpYeACi7HO5j0StQnmgPqEbLUax1+IJ39gEGpVG5SBxTgSDEe46KP21u6faCywDwNfomqLwdrJBtVrm5rZQL/1S9biANgfJCjhz6h3tiXLarTpHLS66XDUnxVTSU8fjgxkncW5dEFG+jidt8iuPxby6QQQJLTEKofa83Q8bj5M9AYGl9wq2vxA5jcQJiN11QxsdRLCviw0XQP4oPwn2VdVqFxmI813s1RQj7A9opXrjMC2RzUXYokRb80qSi02Lp2JIfakhn7Y/wAf3opdq6xmJIlALEMNi6G1ApGgbxFrRrceqvOGcVY8tzNkibnW8fosESnaFQhuYajrdRngVA210fUWVWkSN1KpWaBe2pJPgsRw7H1Q1zibdeZGyPXxZqDUwYOuxG3kSuN4WmTbfs2tHEAROl4StXBOcZBgaxY+c+KpsJxjLDXgZbxECBsOlloMDixUbmDSG6CYEgbiNlOUXEfHlcegLC8CC4+35IzKrxfbop16P3v35lQaW2EwgengzLIhptfn9UTtkvA5heab/MgdFjIe47x++qK09SlRT6n1RR4rBGApSlw5SD1jBpXCh51wuQMEzKD45n1UHFDJRMEkIT6w5rhaUvWEX/Mo0Buib8TBhKVKxnZRcZ05Em5MHl1lKgE9EyRFZ4P2Ha15BLSj0KY1mb21sd9fBRwlGLrlfiFKmYJkyZi8Hr6pX3Rw5s7lwnwAxeEAOY/LckfpzSzmUT3h3YgCeg+aNymX45lQCHXGg0KQGCLgb+Uwiv5JrJMhi+NARlG950jqFRU+Lszd4T/l0k2sCg8VBEgtLTyII0tY7qmy9V3Y8MWgKJravF2SGtfJsYiZ6JHiWOe5tyTcgyNP6KhwOINOoHevUaFP4/iQILGtEc/fRbw7ZKg0I1K153Q+0vJXAxdaF0cADUqk850XstRQ+0AIf2g/iS7QbRcqVN8Lz9VAqq5HTsYOIUDUQQpBbbQaJOTTqJpta6fm25fuD6FKp3iR/wDH/kafMsbdBgYbBY8SM8wOuvkm8ZxEBzSO82NYjTQR4KkCY2A6KUoK7EmkW9DEMfHtOs9Fo+C8QygEnuixMzbQW2AWOwOp8lZ8PHc8z+a58kFRHo3zK7XSGuBkT5TqkxcOMjuxoZmVVcKcRTfFrD6JjAHu/wCmfPmubbR0YJNTVDbndV5lTqk6hXaZRPVLAVDpJ90Wk4/spWmdfBQzFAJaNeeg9SptJ5/RV9ErryhQSxD+Z913tEiwqUoUaxw1UPtd0u4rmHN/VahJzcVYariQNZsq/E8VaNe781j01uq/GuPaVLn5T/3as7iDJve5VYY0zy55Zvtl9h+KtFvvTFriAdQpPxrsrrgHY+fJZxp0/eyYxLjGuyo4KyNl83j0AgAWFidz1Wcx2Nc55dYEmeYCRJXm6jxTRgosxZ4LEkuvr+aZxHFS27T+/FVzP/JS/wBH/ZL1NfNBwTYbJYzFOeDJnxVTVEbpysq966caHgclda+644KIVqKUFfVkXQcy8V4JkqClRyV1cXljH//Z')
const rooms = [forest,  cave,  glacier,  victoryRoad]
const chuey = new User('user')
chuey.addPoke(squirtle)
chuey.addPoke(bulbasoar)
chuey.addPoke(charmander)
test1.currentRoom = forest
test2.currentRoom = cave
test3.currentRoom = glacier
test4.currentRoom = victoryRoad








function roomBattle() {
      chuey.battle()
      if(chuey.currentRoom.isCleared()) {
         chuey.advanceRoom()
      }
      
}
function play() {
    
    const myPoke = document.querySelector('.player img')
    myPoke.setAttribute('src', chuey.active.img)
    
    const enemyPoke = document.querySelector('.enemy img')
    enemyPoke.setAttribute('src', chuey.currentRoom.enemies.active.img)
    chuey.battle()
   
}
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
function updateLog(string) {
    const log = document.querySelector('#log');
    log.value = logNumber + '. ' + string + log.value 
    logNumber ++
    
}


play()
