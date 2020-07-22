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
    }
    isKod() {
        return this.currentHp < 1
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
            alert(`Your ${this.name} leveled up to level ${this.level} and gained attack +${this.level * 3} and Max HP +${this.level * 4}`)
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
        
        target.active.currentHp -= this.active.attack
        alert(`The enemies ${this.active.name} attacked for ${this.active.attack} damage!`)
        if (target.active.currentHp < 0) {
            target.active.currentHp = 0
        }
        console.log(target.active.currentHp)
        target.changeHp()
        if(target.gameOver()) {
            endGame()
        }
        
        //alert(`The ememies ${this.active.name} attacked your ${target.active.name} for ${this.active.attack} damage`)
    }
    changeHp() {
        const enemyHealthBar = document.querySelector('#enemy')
        let percent =  (this.active.currentHp /  this.active.hp) * 100
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
            alert(`enemy sent out ${this.active.name}`)
            this.changeHp()
            enemyPoke.setAttribute('src', this.active.img)
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
        this.potions = 3;
    
    }
    attack(target) {
        target.active.currentHp -= this.active.attack
        alert(`${chuey.active.name} attacked for ${chuey.active.attack} damage!`)
        chuey.currentRoom.enemies.changeHp()
    }
    changeHp() {
        const playerHealthBar = document.querySelector('#user')
        let percent =  (this.active.currentHp /  this.active.hp) * 100
        playerHealthBar.style.width = percent + '%'
        playerHealthBar.innerText = this.active.currentHp + '/' + this.active.hp
    }
    usePotion() {
    
            if(this.active.currentHp + 25 < this.active.hp) {
                alert(`Healed your ${this.active.name} for 25 hp`)
                this.active.currentHp += 25;
                this.potions -= 1;
                this.changeHp()
            } else {
                alert(`Fully healed your ${this.active.name}`)
                this.active.currentHp = this.active.hp;
                this.potions -= 1;
                this.changeHp()
            }
            
        
    }
    changeRoom() {
         
        const enemyPoke = document.querySelector('.enemy')
        enemyPoke.style.display = 'block'
        let screen = document.querySelector('.screen')
        if (roomI === rooms.length) {
            alert('you win!!!!!!')
            return
        }
        chuey.currentRoom = rooms[roomI]
        screen.style.backgroundColor = chuey.currentRoom.color
        roomI ++
        console.log(chuey.currentRoom)
        chuey.currentRoom.enemies.changeHp()
        const enemyPokeImg = document.querySelector('.enemy img')
        
        enemyPokeImg.setAttribute('src', this.active.img)
        chuey.battle()
    }
   
    advanceRoom() {
        const menu = document.querySelector('.menu-buttons')
        const buttons = document.querySelectorAll('.menu')
        const trainButton = document.querySelector('#train')
        
        buttons[1].innerText = 'Heal'
        buttons[2].innerText = 'Train'
        buttons[1].removeEventListener('click', chuey.potionFunction)
        buttons[2].removeEventListener('click', chuey.attackFunction)
        buttons[0].addEventListener('click',  chuey.changeActive)
        buttons[1].addEventListener('click', chuey.heal)
        buttons[2].addEventListener('click', chuey.train)
    }
    attackFunction(){
        if(chuey.active.isKod()) {
            alert('You must switch pokemon or heal!!!')
            return 
        }
        console.log(chuey)
        const enemyPoke = document.querySelector('.enemy')
        if (chuey.currentRoom.enemies != null) {
            chuey.attack(chuey.currentRoom.enemies)
            if(chuey.currentRoom.enemies.active.isKod() && chuey.currentRoom.enemies.pokemon.length > 1){
                alert(`defeated the enemies ${chuey.currentRoom.enemies.active.name}`)
                chuey.active.getXP(chuey.currentRoom.enemies.active.xpGiven)
                chuey.currentRoom.enemies.removeActive()
                chuey.currentRoom.enemies.setActive()
            } else if (chuey.currentRoom.enemies.active.isKod()) {
                chuey.active.getXP(chuey.currentRoom.enemies.active.xpGiven)
                chuey.currentRoom.enemies.removeFromRoom()
                enemyPoke.style.display = 'none'
                chuey.advanceRoom()
            } else {
                chuey.currentRoom.enemies.attack(chuey)
                
            }
        }
    }
   
    potionFunction(){
        if(chuey.potions) {
            chuey.usePotion()
            chuey.currentRoom.enemies.attack(chuey)
        } else {
            alert('all out of potions')
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
        alert(`You trained your pokemon and they gained 100xp`)
        for (let poke of chuey.pokemon) {
            poke.currentXp += 100
            poke.levelUp()
        }
        chuey.changeRoom()
    }
    heal() {
        alert(`You healed your pokemon`)
        for (let poke of chuey.pokemon) {
            poke.currentHp = poke.hp
        }
        chuey.changeHp()
        chuey.changeRoom()
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
            console.log(element.id)
            if (element.id) {
                element.addEventListener('click', (event) => {
                    let index = parseInt(element.id[4])
                    console.log(index)
                    if (chuey.active != chuey.pokemon[index]) {
                        if(chuey.pokemon[index].isKod()) {
                            alert('That pokemon is knocked out!')
                            return
                        } else {
                            chuey.setActive(index)
                            chuey.changeHp()
                            pokeTable.style.display = 'none'
                            alert(`Switched to ${chuey.active.name}`)
                            if(chuey.currentRoom.enemies != null) {
                                chuey.currentRoom.enemies.attack(chuey)
                            } else {
                                return
                            }
                        }
                    }
                })
            }  
        });
    }

    setActive(ind) {
        chuey.active = chuey.pokemon[ind]
        const myPoke = document.querySelector('.player img')
        myPoke.setAttribute('src', chuey.active.img)
    }
    gameOver() {
        
        let output = this.pokemon.every((element) => {
           return element.currentHp < 1;
        })
        return output
    }
    }
    

        
       
        
    

    

const squirtle = new PokeMon('squirtle', 'water', "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAHoA2QMBEQACEQEDEQH/xAAbAAEAAQUBAAAAAAAAAAAAAAAAAQMEBQYHAv/EADoQAAEEAgAEAwUGBQIHAAAAAAEAAgMEBREGEiExEyJBBxRRYXEVIzKBkaEWscHR8CRSQlVic5Kjsv/EABsBAQACAwEBAAAAAAAAAAAAAAAEBQEDBgIH/8QAMxEAAgICAQMCBAUCBgMAAAAAAAECAwQREgUhMUFREyJhcRQygZHhFaEjM0Ji0fAkNMH/2gAMAwEAAhEDEQA/AO4oYIQBAEAQEoAgCAhAEBKAhANoBtAEAQBAEAQBASgCAhAEAQBAEBKAhAEAQBAEAQBAEAQBAY7NZaDFVXPlewTOa7wY3HXiOA7LbTTK2Wl49foaMi+NMG5Pv6fU0bJ57I5tjGPjlxvhHmDoZjt/po9lbU41dL3+bf0KHJ6hO5JJcfszGuZd0R9sX9/95391Ica2vyL9iH+ItX+p/uz1i8pk8DM60yWzlC9vJ4M850315vX4KJdhxa+UlY3UZ1ybl3/U3rhjiWLMxCKw2OvkQHOfUD+ZzWA6Dv3H6qtuplW9MvcXKjfHa8mwLSSggCAIAgCAIAgCAIAgCAIAgCAlAQgCAlAQEAQBAWmWu/Z2NtXSwyCvC6TkB1zaG9LMVt6PFk+EHL2OYyZKXNWn37MpMEh54K73cwg9Do/krvHp+HDcfXycvl5Tun38LwenSNHYg9VvUSG5FFz2t1zuA36krYeCR6dv8KApnxYJfeaFg1rA6OlZ3c31b/L9FpupjYtM30ZEqZbidI4WzY4gxLb7YDCDI5nIXb7Khshwlo63Hu+NDkZleDcQgCAICUAQEIAgCAIAgJQEIAgCAIAgCAIAgCA0b2p3rtWpRgpOk5bTnxyxsGzKNDy6/NSKOMW5yW9dyDm85ca4vXJ6NUx3NHUjjkifBK0eaF4LXM79weoVzj2K2pWa1s5zMp+BdKve9epcgn5n81uIpjMrZjpMM9x7fD1921zg3TgPn37LErIwjts301StkoxLnhaJ3EWHbka+VgieWue+qSHSNDTrro9N6/dQl1KtvXAtJdImk3yR4OQjdVEo68/Tl5uoVglvwU6iXnswzc/8XzcPte/3WOm6wGdOXm5mdfj6lU3UFCNmku50fTIz+Hycvl9jriry1JCAhAEAQBAEAQBAEAQEoCEAQBAEAQEoCEAQAoDnntYtvihx8tF/PZqzOk5ItOc0gAg6/upFMW4y17EDMnGM69+5q+ItXMlF9p5FzjYstBeJG8j9jp1AGh2Vth7WPCMvJR9TnCeVNw8fwZD/ADupJXmH4n4afxNjTEy/Wp+67nJnP49A9B81XdS0q4/cuui/5stexaewutEDk5gz7x+PfzHZ6+ZUkJP4ridNbBKnkUaYIrt2utx+1aOGl5Mn7LevtYu/LFHX/lGqXqL/AMdnS9N/9Zfc7ioJPCAIAgCAIAgCAIAgCALICwAgCAIAgCAIAgKT7EDXFjpow4dSC4bCzp63oxyjvycd40nscOcV381dLbGKyT44qxruaTG8NAPPvXTofUqXj3up6mVmbhq6POvyKls3Q6aOZhY9vlaSOYHt1V1CUJJaOdnBxfdFeIuaxonkYX+pBAXpmvz4LfI1aV6v4dwNkjb5tB+j+xCj30VXpKxb0SsXKvxZN1dt/QxWKsw8OPkGD3WZMzwnA+fynqR5iddVqeHh1y5a7v6/yTvx+bOHHfb7fweXODWOd1PKCdAdSrJvS2ytS29Fz7PbH2dmLfGVqJzKU1Q1ooifvnODm78vbu34rnrpPJu+Va2dPQljUak967m9Se0ulE/lkxl756Df7pLCnGXE0LqtXnT/AO/qbPw9namdoMtVuaMuLvupS3nGjrZAJ6KNZBwlxZPotVsOSMqvBtCAICUBCAIAgCAIAsgLACAIAgCAIAgKdiUQwSSuBIjaXEDv0Cylt6MSels4/k/CzedlzLG8kb9OgBOnsdych3rp238e6vaqJQgq5vaXscrfmcrZTrWt+5gslVzdOnPDiLdaKO04eM1wLg4cuv8AaddgvGViyvnyizfg9QVK4z8fQ1vFVbmGL62LdHXyIaPHsTgmKRvcBux37eg9VqrplW+FfaS8v0JV11d6U7O8PRLyvuZPx7rjy5UtsSju6Bmm7/ZVmdlZ0LPhxfj6fwWmBg9NtqVkk+/1/kB8JOhBK0npsjoP3UOGT1CUlHfn/b/BLn0/pMYuWvH+7+T1DUbHMXW5IiQNgB+jv6K4p6Y1c7cpp/Z+36Ip7eqRjjqnDi0vqt+fPuebVu5YnirUIZYvvG+JNNF925vqGnr1U+WZ8V8av1+xW140aofEuXZ+F9TaIcdFDEwy7c+AOLdPJA2dn+QW6NcK5OUPUgSvsnBVt9kYq9lXTiYhxZC1nMwPAB5gFiNr3Js911baSRuvsZwMBxEXFdpsv2xejkhlc7ygRiTQAb9GNO1QW2ytlyl5OurqhVHhDwdKWs9hAEAQBAEAQBAEAQBAEAQBAEAQBAeJY2SxPjkG2PaWuHxBQNb7HLuKMFZ4cc2agAcU5zWsibt8jDrZJ2O3f1VtiZe/kmc7nYCrfOHgxQysPcNl/Qf3VpwKngY3Oinla8TLEb3CGTxGgnWiN/ArVdVW47s8Ik4srYT1X69i2r4rL5eAHBz1KwHU+970R2I6NPXao7OuKK1Uml9df8l7V0Np7u019G/+ETLwrxlDGXyZbBgAf9fX/wBa0/121+v9kSF0bH3+X+7MczAVZw21lzDNeHV0kUjg067aHT+ShXZdl9jb9S0pxKserS9DZsVdmsUIsfI9ooVz4kMZGiHEnfX8yuj6fiuiHJvv9Dkep534mXy/l+p7v3OTcbDogeZ2hrSsYx9SrSMRisTPxZxFWpY9zGHF2Ybdh87iGuZsdGaB2e/fSquo5EZv4a8o6LpmNOH+M/DX/wBO/lwjYXOOmjqSfRVZa+DF/wAS4b/mNc/R4WeLPDtgvUyFW5Wtt5qtiKYevI8HX6LDWj0pKXhldYPQQEoCEAQBAEAWQSsAhAEAQBAEAQBAeJY2yxujeNtcNEfELIa2tM53xV7N3vpM/g+SClb5xzm3I9zCz4dQ7qpEMq2D3FkJ9Px35j/c0+lwvlrOS+w8pNUfeqkSzv2RG6PfZum73o/ALRn5yupVUvzJ73+5tw8P8Pc7Y/la0Z3N4/KYSwyvg7FWvjS5rIo5QXua53UklwJ1v5ql+VvuW8FyKs3CXEGS5Is1cxtiuxwcGx8zTv6hg9NrK0vBhTj7FPJcIYWjFM412texhcz/AFEnfWx3K8qckzH51r0NGmvPx1GKaeCadjnEckDNub8yunw+qpLjZt/sc/ldFny5VNJfqXeHqZDi6rZdjGPowVo/FndciIE8fXbWEA9eh+C25XUudequ37GMPpfC1O3v49/c84O4eFMhTmxL3Vo5JWsnA8/NHzbI82/mudhZNz7ep099Vca+/oZi7xRmuJLr5IJn1aUrGtZXI/CdnZJ19P0XQ4+HyW2chldQaeq3rR5ocP0q1SKAxAuY3Xle7X81PhTGMUinsvlOTk/Uu8fZscM3hboO5az3N94jaA4vjb115gdevVa8jGhOHb0JOHlyqn9DrmIvsyeMrXomOjZPGHhr9bAP0VHKPF6Z1Fc1OCkvUvFg9hAEAQBAEAQBAEAQBAEBKAhAEAQBAcvy+UGJ9pV6V1SzaElWNnLWYHFvbzH5KvyVubJNcdwLri7MUzSoPbOxx98j21sjSQPiRvt81HimzbDcW9myHI0i1zhdqnv2mb/dY7mpJmnZe3HxFlvcqMoaKzmSySOLSyRnq1pG+qfl7s2xbijDZ6m2vLPHC2SOIs00neu3xKzBkiL2jdeEDE32cNqQzRyzx05OZkTuZ2zzeg6qyg916IU1q7b8bONZR9iTKwUnQT1zBM3xDNEWh4I7DfVecOEfiw5erR66jZJ0TUfRM2WhIa8rWsdyscRzb+C7RxSifPmtl4+exbkdHQmEXhHT3vaC1/0KjNyl4GoxW5AzOkpzwTg+IxvK5xGg86P4V6iuXysNaaaNh9jeUv3vturbtPlqUZ2RVY3Afdt0em9bPp3VDkpK6SXuddi/5EPsdKWgkBAEAQBAEAQBAEAQBAEAQBAEAQGOzeWrYem6zZfodmtHUuPwC2VVStlxiarro0x5SZzTFZh83GVrJ5SPwIp63hgu8je403Z9VF6njOmzt3XbuesDKjkVeVy2+xc8XcOYhlavLSgjZK6zG2R4e53Mz1GtqujLsWUeUn3M+zhTBNhLIaLeTRA1K/X/ANLzs8fEmu2zU8tiHcN2xZxTxDG5zWvjYOYvaOpHm33WU99mbYtSXYoZfKfbFJjIak0buvR3XW9j0Cn4XTbcjb8L3e+5Ay+o1Ya7/M36LQ9n2Sfw3lZ2Xo5HQWhHGx+uVsfU7JJ9Ov7KwXTLKd99/YgPrVd3GGtfsYj2kmb+La1qIO90tW/u5gNslHKPwu7H8loxK1+LTkvVE/NtTwfkfoy2yplbjrRrtJlEZ5A1uzv6eq6m/l8KWvOjj8dRdsefjZOBuzDHwjxh7wI2icaG2u12I9F4x2pVRT8pGcqpRtbS+X0PWXs3Z67oaZdLkHMPu0UbOZ7yO/K3XVecq1VVNp6Z6w8f4lq3Ha9TsHAuBqYbCxSQVHV7dyNktzmLtul5epIJ6H5DS52UnKTkzqYxUIqMfBsi8noIAgCAIAgJQEIAgCAIAgCAIAgBQHNuOiJeKGQzOLmisHNYT0HXqQrrpzXwu3nZzvV3JW/QwOVqG5WEbZQwteHgkb7L1m47yauCeiL0/LWJd8RrfoYibK38k4V32JIXMIkBdo/0C5Cyl0y4zWmd5VZXdHlX49y8j4hzlUCAW55GNPWTygfy9F44o98UvKPF3NuuD/U3vGO9jeu/6L3TBOyO122ebWoVSlH2Ze4sNNWOYAB7x1Px6ldvUoRilBaXsfOr7J2zcrHtlW7GySq/xAHcrTrfp0Wxd+zNUfJqlnMNlljqZh4jr0HapeM4AD48v+FQofAhdJzSWvBb/wDkTpiqpNrXdexUhyMFuRsGMkZcuSdIq0TxzSHvoKTZm0wi5Jps014F05qLi0vc90+EOK8nmq8EGLt4KGw5xs23sbIN62CRsfDX5qoszXvdXy78/UuqsFJat+bXj6HUeDOAIsDKbWWtR5a/HJzVrT4OR0A1ogdT8/1Uay6dr3N7JVVNdS+Ra2bsB0Ws2BAEAQBAEAQEoCEAQBAEAQBAEAQAoDlvtcq+424M5WtSPumMQR0AQ0SN35nb+WwpWLZOufKK2Qc2qmyGrHowEuRkkiAa3kJO9h210KgjluOmYfIyQVoDPLOK/p4mu/yVf1HEpthym+L9y46Zm30z4wXJe2+xV4Zr5/OYRl2jh32onF4D/EbpxBPTqQuVlRLl28HXxyI8e5StcMcazx8kPCDq7v8Ae2xGP6rfHH4vezRO5TWmipw9euUOfFZFrvfqgDbET3bLDvf0XS4Nishx9Ucf1DGcLHJLSZkrF58zQ0AsHY6PdT1HRAUdGCm+y2cW8PnNNr/Z5nd7x44HIRr/AIt+m9Kq6okuL+5edH/1/od0o8I8N0bUdujg8fXsRnccsVdrXN+hAVQXRnNIAgCAIAgCAIAgCAIAgJQEIAgCAIAgCAaQGm8e8N28ny5HFxNs34mCJlaZ4bG5pOyST6rfTe6vCIeThxyGm3o1CrwVxSzGWLk1Kocl4gZFUE4MZj15nF3x32Clf1GzlvRF/pFetcmTjfZLYzUJscV2ZqkwlHLUqSh8ZYNaJ2O5O+3ppRr8id0tsnY+NCiPGP7nWadSvSrtgqQxwxN7MY0ABRyQV0Byv2ucNzuu0eIabRFUqBzsm6Po5zPLpxA/FrRW6iz4die+xoyK/iVSil39DSmX2W68+QoB02LpvaLs5jcHRNd0BDdbPz+Ct59SrTjx/X6FLX0u3g+XZ+h4jxOR42q3I+Gqle1DEfDfLO7w3M31GgfoomTmxsjxS2SsLBsqfOb19DvnD9aalgsfVsjU0NeON43vqGgHqq0tzIIAgCAIAgJQBAEBCAIAgCAIAgCAIAgCAIAgCAIAgCAhzWvBa5ocD0II3tAU21oWtc1sUYa78QDQAUB6ihji34UbGA9+VoCA9oAgCAIAgCAIAgCAIAgCAICfRAQgCAIAgCAIAgCAIAsgLAAQBZACwCUBCAFAEAQBAEAQBAEAQH//2Q==")
const bulbasoar = new PokeMon('bulbasoar', 'grass', 'data:image/png;base64,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')
const charmander = new PokeMon('charmander','fire', 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQziXLj-1WhksbZiw3SDOqmKm3BZLh1L6gl8A&usqp=CAU')
const squirtle2 = new PokeMon('squirtle', 'water', "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAHoA2QMBEQACEQEDEQH/xAAbAAEAAQUBAAAAAAAAAAAAAAAAAQMEBQYHAv/EADoQAAEEAgAEAwUGBQIHAAAAAAEAAgMEBREGEiExEyJBBxRRYXEVIzKBkaEWscHR8CRSQlVic5Kjsv/EABsBAQACAwEBAAAAAAAAAAAAAAAEBQEDBgIH/8QAMxEAAgICAQMCBAUCBgMAAAAAAAECAwQREgUhMUFREyJhcRQygZHhFaEjM0Ji0fAkNMH/2gAMAwEAAhEDEQA/AO4oYIQBAEAQEoAgCAhAEBKAhANoBtAEAQBAEAQBASgCAhAEAQBAEBKAhAEAQBAEAQBAEAQBAY7NZaDFVXPlewTOa7wY3HXiOA7LbTTK2Wl49foaMi+NMG5Pv6fU0bJ57I5tjGPjlxvhHmDoZjt/po9lbU41dL3+bf0KHJ6hO5JJcfszGuZd0R9sX9/95391Ica2vyL9iH+ItX+p/uz1i8pk8DM60yWzlC9vJ4M850315vX4KJdhxa+UlY3UZ1ybl3/U3rhjiWLMxCKw2OvkQHOfUD+ZzWA6Dv3H6qtuplW9MvcXKjfHa8mwLSSggCAIAgCAIAgCAIAgCAIAgCAlAQgCAlAQEAQBAWmWu/Z2NtXSwyCvC6TkB1zaG9LMVt6PFk+EHL2OYyZKXNWn37MpMEh54K73cwg9Do/krvHp+HDcfXycvl5Tun38LwenSNHYg9VvUSG5FFz2t1zuA36krYeCR6dv8KApnxYJfeaFg1rA6OlZ3c31b/L9FpupjYtM30ZEqZbidI4WzY4gxLb7YDCDI5nIXb7Khshwlo63Hu+NDkZleDcQgCAICUAQEIAgCAIAgJQEIAgCAIAgCAIAgCA0b2p3rtWpRgpOk5bTnxyxsGzKNDy6/NSKOMW5yW9dyDm85ca4vXJ6NUx3NHUjjkifBK0eaF4LXM79weoVzj2K2pWa1s5zMp+BdKve9epcgn5n81uIpjMrZjpMM9x7fD1921zg3TgPn37LErIwjts301StkoxLnhaJ3EWHbka+VgieWue+qSHSNDTrro9N6/dQl1KtvXAtJdImk3yR4OQjdVEo68/Tl5uoVglvwU6iXnswzc/8XzcPte/3WOm6wGdOXm5mdfj6lU3UFCNmku50fTIz+Hycvl9jriry1JCAhAEAQBAEAQBAEAQEoCEAQBAEAQEoCEAQAoDnntYtvihx8tF/PZqzOk5ItOc0gAg6/upFMW4y17EDMnGM69+5q+ItXMlF9p5FzjYstBeJG8j9jp1AGh2Vth7WPCMvJR9TnCeVNw8fwZD/ADupJXmH4n4afxNjTEy/Wp+67nJnP49A9B81XdS0q4/cuui/5stexaewutEDk5gz7x+PfzHZ6+ZUkJP4ridNbBKnkUaYIrt2utx+1aOGl5Mn7LevtYu/LFHX/lGqXqL/AMdnS9N/9Zfc7ioJPCAIAgCAIAgCAIAgCALICwAgCAIAgCAIAgKT7EDXFjpow4dSC4bCzp63oxyjvycd40nscOcV381dLbGKyT44qxruaTG8NAPPvXTofUqXj3up6mVmbhq6POvyKls3Q6aOZhY9vlaSOYHt1V1CUJJaOdnBxfdFeIuaxonkYX+pBAXpmvz4LfI1aV6v4dwNkjb5tB+j+xCj30VXpKxb0SsXKvxZN1dt/QxWKsw8OPkGD3WZMzwnA+fynqR5iddVqeHh1y5a7v6/yTvx+bOHHfb7fweXODWOd1PKCdAdSrJvS2ytS29Fz7PbH2dmLfGVqJzKU1Q1ooifvnODm78vbu34rnrpPJu+Va2dPQljUak967m9Se0ulE/lkxl756Df7pLCnGXE0LqtXnT/AO/qbPw9namdoMtVuaMuLvupS3nGjrZAJ6KNZBwlxZPotVsOSMqvBtCAICUBCAIAgCAIAsgLACAIAgCAIAgKdiUQwSSuBIjaXEDv0Cylt6MSels4/k/CzedlzLG8kb9OgBOnsdych3rp238e6vaqJQgq5vaXscrfmcrZTrWt+5gslVzdOnPDiLdaKO04eM1wLg4cuv8AaddgvGViyvnyizfg9QVK4z8fQ1vFVbmGL62LdHXyIaPHsTgmKRvcBux37eg9VqrplW+FfaS8v0JV11d6U7O8PRLyvuZPx7rjy5UtsSju6Bmm7/ZVmdlZ0LPhxfj6fwWmBg9NtqVkk+/1/kB8JOhBK0npsjoP3UOGT1CUlHfn/b/BLn0/pMYuWvH+7+T1DUbHMXW5IiQNgB+jv6K4p6Y1c7cpp/Z+36Ip7eqRjjqnDi0vqt+fPuebVu5YnirUIZYvvG+JNNF925vqGnr1U+WZ8V8av1+xW140aofEuXZ+F9TaIcdFDEwy7c+AOLdPJA2dn+QW6NcK5OUPUgSvsnBVt9kYq9lXTiYhxZC1nMwPAB5gFiNr3Js911baSRuvsZwMBxEXFdpsv2xejkhlc7ygRiTQAb9GNO1QW2ytlyl5OurqhVHhDwdKWs9hAEAQBAEAQBAEAQBAEAQBAEAQBAeJY2SxPjkG2PaWuHxBQNb7HLuKMFZ4cc2agAcU5zWsibt8jDrZJ2O3f1VtiZe/kmc7nYCrfOHgxQysPcNl/Qf3VpwKngY3Oinla8TLEb3CGTxGgnWiN/ArVdVW47s8Ik4srYT1X69i2r4rL5eAHBz1KwHU+970R2I6NPXao7OuKK1Uml9df8l7V0Np7u019G/+ETLwrxlDGXyZbBgAf9fX/wBa0/121+v9kSF0bH3+X+7MczAVZw21lzDNeHV0kUjg067aHT+ShXZdl9jb9S0pxKserS9DZsVdmsUIsfI9ooVz4kMZGiHEnfX8yuj6fiuiHJvv9Dkep534mXy/l+p7v3OTcbDogeZ2hrSsYx9SrSMRisTPxZxFWpY9zGHF2Ybdh87iGuZsdGaB2e/fSquo5EZv4a8o6LpmNOH+M/DX/wBO/lwjYXOOmjqSfRVZa+DF/wAS4b/mNc/R4WeLPDtgvUyFW5Wtt5qtiKYevI8HX6LDWj0pKXhldYPQQEoCEAQBAEAWQSsAhAEAQBAEAQBAeJY2yxujeNtcNEfELIa2tM53xV7N3vpM/g+SClb5xzm3I9zCz4dQ7qpEMq2D3FkJ9Px35j/c0+lwvlrOS+w8pNUfeqkSzv2RG6PfZum73o/ALRn5yupVUvzJ73+5tw8P8Pc7Y/la0Z3N4/KYSwyvg7FWvjS5rIo5QXua53UklwJ1v5ql+VvuW8FyKs3CXEGS5Is1cxtiuxwcGx8zTv6hg9NrK0vBhTj7FPJcIYWjFM412texhcz/AFEnfWx3K8qckzH51r0NGmvPx1GKaeCadjnEckDNub8yunw+qpLjZt/sc/ldFny5VNJfqXeHqZDi6rZdjGPowVo/FndciIE8fXbWEA9eh+C25XUudequ37GMPpfC1O3v49/c84O4eFMhTmxL3Vo5JWsnA8/NHzbI82/mudhZNz7ep099Vca+/oZi7xRmuJLr5IJn1aUrGtZXI/CdnZJ19P0XQ4+HyW2chldQaeq3rR5ocP0q1SKAxAuY3Xle7X81PhTGMUinsvlOTk/Uu8fZscM3hboO5az3N94jaA4vjb115gdevVa8jGhOHb0JOHlyqn9DrmIvsyeMrXomOjZPGHhr9bAP0VHKPF6Z1Fc1OCkvUvFg9hAEAQBAEAQBAEAQBAEBKAhAEAQBAcvy+UGJ9pV6V1SzaElWNnLWYHFvbzH5KvyVubJNcdwLri7MUzSoPbOxx98j21sjSQPiRvt81HimzbDcW9myHI0i1zhdqnv2mb/dY7mpJmnZe3HxFlvcqMoaKzmSySOLSyRnq1pG+qfl7s2xbijDZ6m2vLPHC2SOIs00neu3xKzBkiL2jdeEDE32cNqQzRyzx05OZkTuZ2zzeg6qyg916IU1q7b8bONZR9iTKwUnQT1zBM3xDNEWh4I7DfVecOEfiw5erR66jZJ0TUfRM2WhIa8rWsdyscRzb+C7RxSifPmtl4+exbkdHQmEXhHT3vaC1/0KjNyl4GoxW5AzOkpzwTg+IxvK5xGg86P4V6iuXysNaaaNh9jeUv3vturbtPlqUZ2RVY3Afdt0em9bPp3VDkpK6SXuddi/5EPsdKWgkBAEAQBAEAQBAEAQBAEAQBAEAQGOzeWrYem6zZfodmtHUuPwC2VVStlxiarro0x5SZzTFZh83GVrJ5SPwIp63hgu8je403Z9VF6njOmzt3XbuesDKjkVeVy2+xc8XcOYhlavLSgjZK6zG2R4e53Mz1GtqujLsWUeUn3M+zhTBNhLIaLeTRA1K/X/ANLzs8fEmu2zU8tiHcN2xZxTxDG5zWvjYOYvaOpHm33WU99mbYtSXYoZfKfbFJjIak0buvR3XW9j0Cn4XTbcjb8L3e+5Ay+o1Ya7/M36LQ9n2Sfw3lZ2Xo5HQWhHGx+uVsfU7JJ9Ov7KwXTLKd99/YgPrVd3GGtfsYj2kmb+La1qIO90tW/u5gNslHKPwu7H8loxK1+LTkvVE/NtTwfkfoy2yplbjrRrtJlEZ5A1uzv6eq6m/l8KWvOjj8dRdsefjZOBuzDHwjxh7wI2icaG2u12I9F4x2pVRT8pGcqpRtbS+X0PWXs3Z67oaZdLkHMPu0UbOZ7yO/K3XVecq1VVNp6Z6w8f4lq3Ha9TsHAuBqYbCxSQVHV7dyNktzmLtul5epIJ6H5DS52UnKTkzqYxUIqMfBsi8noIAgCAIAgJQEIAgCAIAgCAIAgBQHNuOiJeKGQzOLmisHNYT0HXqQrrpzXwu3nZzvV3JW/QwOVqG5WEbZQwteHgkb7L1m47yauCeiL0/LWJd8RrfoYibK38k4V32JIXMIkBdo/0C5Cyl0y4zWmd5VZXdHlX49y8j4hzlUCAW55GNPWTygfy9F44o98UvKPF3NuuD/U3vGO9jeu/6L3TBOyO122ebWoVSlH2Ze4sNNWOYAB7x1Px6ldvUoRilBaXsfOr7J2zcrHtlW7GySq/xAHcrTrfp0Wxd+zNUfJqlnMNlljqZh4jr0HapeM4AD48v+FQofAhdJzSWvBb/wDkTpiqpNrXdexUhyMFuRsGMkZcuSdIq0TxzSHvoKTZm0wi5Jps014F05qLi0vc90+EOK8nmq8EGLt4KGw5xs23sbIN62CRsfDX5qoszXvdXy78/UuqsFJat+bXj6HUeDOAIsDKbWWtR5a/HJzVrT4OR0A1ogdT8/1Uay6dr3N7JVVNdS+Ra2bsB0Ws2BAEAQBAEAQEoCEAQBAEAQBAEAQAoDlvtcq+424M5WtSPumMQR0AQ0SN35nb+WwpWLZOufKK2Qc2qmyGrHowEuRkkiAa3kJO9h210KgjluOmYfIyQVoDPLOK/p4mu/yVf1HEpthym+L9y46Zm30z4wXJe2+xV4Zr5/OYRl2jh32onF4D/EbpxBPTqQuVlRLl28HXxyI8e5StcMcazx8kPCDq7v8Ae2xGP6rfHH4vezRO5TWmipw9euUOfFZFrvfqgDbET3bLDvf0XS4Nishx9Ucf1DGcLHJLSZkrF58zQ0AsHY6PdT1HRAUdGCm+y2cW8PnNNr/Z5nd7x44HIRr/AIt+m9Kq6okuL+5edH/1/od0o8I8N0bUdujg8fXsRnccsVdrXN+hAVQXRnNIAgCAIAgCAIAgCAIAgJQEIAgCAIAgCAaQGm8e8N28ny5HFxNs34mCJlaZ4bG5pOyST6rfTe6vCIeThxyGm3o1CrwVxSzGWLk1Kocl4gZFUE4MZj15nF3x32Clf1GzlvRF/pFetcmTjfZLYzUJscV2ZqkwlHLUqSh8ZYNaJ2O5O+3ppRr8id0tsnY+NCiPGP7nWadSvSrtgqQxwxN7MY0ABRyQV0Byv2ucNzuu0eIabRFUqBzsm6Po5zPLpxA/FrRW6iz4die+xoyK/iVSil39DSmX2W68+QoB02LpvaLs5jcHRNd0BDdbPz+Ct59SrTjx/X6FLX0u3g+XZ+h4jxOR42q3I+Gqle1DEfDfLO7w3M31GgfoomTmxsjxS2SsLBsqfOb19DvnD9aalgsfVsjU0NeON43vqGgHqq0tzIIAgCAIAgJQBAEBCAIAgCAIAgCAIAgCAIAgCAIAgCAhzWvBa5ocD0II3tAU21oWtc1sUYa78QDQAUB6ihji34UbGA9+VoCA9oAgCAIAgCAIAgCAIAgCAICfRAQgCAIAgCAIAgCAIAsgLAAQBZACwCUBCAFAEAQBAEAQBAEAQH//2Q==")
const bulbasoar2 = new PokeMon('bulbasoar', 'grass', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAABoVBMVEX///8AAAAAvNQhlvNMr1AAiXsufTJTbf5hYWEAvdNWVlYcfctLS0uLw0osejAimvpra2uGhoZ0dHRca8D0QzYAjH4SVIcvm2gvfC0ilfR9fX2Ojo4Aips8lEBBnUVVav88iT8AdmoAorclgEs4lesDqfRgfYuenp4AaF0AUUgAYVdFe/s0ive7u7sUXZY4jDsXaqseg1sXhWcAdIM+Pj5FW9QAXGg9ULo7hPgPst2tra0Aj6F4qEBetE8kYicWqOUuoOUjrdCiy/lpr/bi4uIAT1lqlDhNbSlWeS51u0wzdzYjXyYobCs4oWJAplwbSh0TrOKQJyB+Za37QCjePTEuPY1Djsize4MZcrk/jPDL4ft4IRstpc77xMG5MylSX6o3j9nIX34PRG9OZXHIyMhwkUxqgFV3vU1RhlNZgltBaUJGc20WclV3jZIllm4uhkUUTDEMWnISc6UmW6c7YMkOjrURXkcMcZNKgsaUHACVRUH/Ox1dZZo1ddxdi71VnbkoMXbRvr1wAABbGRRiYL7Nt9CZVnkcjKkNOl9Lo/SQtNwNaRRIAAAGaklEQVR4nO2d+XsTVRSGaUMhm02LtiRtGrrh0H1V0gJt2FTKFkWxVRQsuLAIhYKggrsi/NV2zjmT597kZpI8xFnC9/52JzPTeXtn7jfnZjrdtQsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPCKWMn4Dskb3Frm1pS/x9RcutsIcern1rK/x9RcdEMLhiEEhuGnhQ2teNTm66PEN9HKVjzkodHH3fXeG8T7WusDbll+H+OrAUMYBh8Yhj80xHDwGMEpcZQbx87xZ8kum2hYQ8Mx3E18y513hlsrbSphPVl1wzMwDCEwbDXD1hhprH0q380M2swwOY6JHLc6V4g1WmXmprpZV5BDskvrGem8mc49O3TmuDVALQdZuKZt1++3hguNGnYOwDBowPC1MuwkwmNo9RG3KALO7qGUGMy5GM7kiAGJkkGFmZu8s2CFRpx/++e0DNhd3bCsNaBtsId31u23lEZUNex8RcM1GPoBDFvGcIVDoNxQXVhuqIZGIA2tbuLWWUIyQI5UyoictlA33K2Fhiw8P37I5jbvWg+NU3200MNyK+kaE4YeLTMUT60rz3f02BziXfdpP+8GL4x7Zxh3uwBNC6sYqpfj+Q4bs+EpXhiFIQxhWGmYJuoaaQwLc7x5kA3vzBMX5IAHCD0mHBnJB1lFnHjzEV64XzNM9qt8n2W45UVoiOFQDx3VBZfO09Gjnp065tP2svScZqhzOta+Q2xY7H0zNF2A5YaVV17HXNpemB5xM2wnhr2LRRjCsOUNnbFUM5zrUe9Lg2V4dz9xr17D9D3e4C732p2LxNYYcX+WeJBVOeKzoTBSt+GculnPuNZdvSniYKy9klYxjOyQKcAQhjD0xJDjocxwkwwjhRgTRMP9LnCgODfZQ1o+bB8mHuaJjVWiGAueYXq+ozpOuGun5zTnQ34vc4CYiGRsCi1iSOfl5IG9ChMRw+UIQxjCUCHpGBJ1GEow6GXEuJOA9pgSyRsMI74ZTlk2y7d5uB+qadhziNfcUsuI8fvTxOUi5UJEN+TQiOiBuMAs04/34gHcqHayuhmOtRmQmFjlbC9ohhIaeZdbm8UwGNK1tsoTaWWGrDnpYujFlBsMYRh8w1IsEiPphg3p3rNkaKBspOExyUNDDg3r9jixRV95X5xjjIanF1Qecf2wxIbFUQNlZeISccU7Q0F/rm2Fv1GaNxlmYybU/jF/Jhw/SBT8NjRcjiVDw1XVADCEIQwbNOxRacDQNMQExHCTS4UxflDqh3EVKSMe89cQw279VCSWDIqx46PXbJ78+KHNT1M2y16UGGKY4FJhs83ALH82za0Flx4sZgxTUI7hX2/afHTpLZuPeWdelBglQ/smrJohfVaH4VKm6owwDGEIw9qGkeYYykhTGRolw58v2XhheIPG66mnnxDP8pM75Ld7DYj9Oree84EPZw1IwVFgVmOa4WXil08ZDwylPnxHmzyaTBngucFIypl7oiNeMPX2u9x3q6b6sKzg8MAwqhtKWR6phdS87VmjIbusHqhe4wteTLnBEIatYaiNNGJY5AGjykgjhtXnvINlmFgnEpphgSaUir92q8jOTh8hHm0QL4yGWVoly9v9r3+3WNsw1curzGq9yKGeOaHtbKqsK6uXid7PCDdsKJ7uhjVPTxjCEIY1DTkmmmvo+fcWYvhwQmWDj19iYvs34tkksaEZnvyM4Z39/sfnNn+6GV4hHnlumKjsn1KZeNjpWg5wvROJDenKL7iu/bK6oVMfXg2GYa9uyJp5w5oZGMIQhs0w5GDI1G+oFhwlQ55fKhlWflFaZujFJJu8IOpJgrjGjNY2HOUNuO+d0Pj7K+KfTeLxksrxI8M2z68ST/nHevgyFJlNvP42ca2moTOpKI/sSaWR0eeuMiqJNhUP/6S7OYZ1AEMYwrBBw1TTDVN+G1r0Stmu68wsJ4Hceet1B1dWqfV/ielEvTzpUvHtnVn72gzMGvuEmTVtYKTLLycdo+F69TMRhjD0ntfbUO4vHTm+Dw2doRVVWeRjk0R4cZJ4wYLSesCrLEZrEsh3KvZrnSCPZp3gBy2kIlzmz8LzOmGdbhjCMPDAcFfJMJADZR3w/86LS2hYp4iXnB0vuSX/UC9Yb51tGD00dMJ6eurAMPzAMPy0vqG1mKzGYshjAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAB84j8uZl7ITd1WPgAAAABJRU5ErkJggg==')
const charmander2 = new PokeMon('charmander','fire', 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQziXLj-1WhksbZiw3SDOqmKm3BZLh1L6gl8A&usqp=CAU')
const squirtle3 = new PokeMon('squirtle', 'water', "data:image/jpeg;base64,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")
const bulbasoar3 = new PokeMon('bulbasoar', 'grass', 'data:image/png;base64,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')
const charmander3 = new PokeMon('charmander','fire', 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQziXLj-1WhksbZiw3SDOqmKm3BZLh1L6gl8A&usqp=CAU')
const squirtle4 = new PokeMon('squirtle', 'water', "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAHoA2QMBEQACEQEDEQH/xAAbAAEAAQUBAAAAAAAAAAAAAAAAAQMEBQYHAv/EADoQAAEEAgAEAwUGBQIHAAAAAAEAAgMEBREGEiExEyJBBxRRYXEVIzKBkaEWscHR8CRSQlVic5Kjsv/EABsBAQACAwEBAAAAAAAAAAAAAAAEBQEDBgIH/8QAMxEAAgICAQMCBAUCBgMAAAAAAAECAwQREgUhMUFREyJhcRQygZHhFaEjM0Ji0fAkNMH/2gAMAwEAAhEDEQA/AO4oYIQBAEAQEoAgCAhAEBKAhANoBtAEAQBAEAQBASgCAhAEAQBAEBKAhAEAQBAEAQBAEAQBAY7NZaDFVXPlewTOa7wY3HXiOA7LbTTK2Wl49foaMi+NMG5Pv6fU0bJ57I5tjGPjlxvhHmDoZjt/po9lbU41dL3+bf0KHJ6hO5JJcfszGuZd0R9sX9/95391Ica2vyL9iH+ItX+p/uz1i8pk8DM60yWzlC9vJ4M850315vX4KJdhxa+UlY3UZ1ybl3/U3rhjiWLMxCKw2OvkQHOfUD+ZzWA6Dv3H6qtuplW9MvcXKjfHa8mwLSSggCAIAgCAIAgCAIAgCAIAgCAlAQgCAlAQEAQBAWmWu/Z2NtXSwyCvC6TkB1zaG9LMVt6PFk+EHL2OYyZKXNWn37MpMEh54K73cwg9Do/krvHp+HDcfXycvl5Tun38LwenSNHYg9VvUSG5FFz2t1zuA36krYeCR6dv8KApnxYJfeaFg1rA6OlZ3c31b/L9FpupjYtM30ZEqZbidI4WzY4gxLb7YDCDI5nIXb7Khshwlo63Hu+NDkZleDcQgCAICUAQEIAgCAIAgJQEIAgCAIAgCAIAgCA0b2p3rtWpRgpOk5bTnxyxsGzKNDy6/NSKOMW5yW9dyDm85ca4vXJ6NUx3NHUjjkifBK0eaF4LXM79weoVzj2K2pWa1s5zMp+BdKve9epcgn5n81uIpjMrZjpMM9x7fD1921zg3TgPn37LErIwjts301StkoxLnhaJ3EWHbka+VgieWue+qSHSNDTrro9N6/dQl1KtvXAtJdImk3yR4OQjdVEo68/Tl5uoVglvwU6iXnswzc/8XzcPte/3WOm6wGdOXm5mdfj6lU3UFCNmku50fTIz+Hycvl9jriry1JCAhAEAQBAEAQBAEAQEoCEAQBAEAQEoCEAQAoDnntYtvihx8tF/PZqzOk5ItOc0gAg6/upFMW4y17EDMnGM69+5q+ItXMlF9p5FzjYstBeJG8j9jp1AGh2Vth7WPCMvJR9TnCeVNw8fwZD/ADupJXmH4n4afxNjTEy/Wp+67nJnP49A9B81XdS0q4/cuui/5stexaewutEDk5gz7x+PfzHZ6+ZUkJP4ridNbBKnkUaYIrt2utx+1aOGl5Mn7LevtYu/LFHX/lGqXqL/AMdnS9N/9Zfc7ioJPCAIAgCAIAgCAIAgCALICwAgCAIAgCAIAgKT7EDXFjpow4dSC4bCzp63oxyjvycd40nscOcV381dLbGKyT44qxruaTG8NAPPvXTofUqXj3up6mVmbhq6POvyKls3Q6aOZhY9vlaSOYHt1V1CUJJaOdnBxfdFeIuaxonkYX+pBAXpmvz4LfI1aV6v4dwNkjb5tB+j+xCj30VXpKxb0SsXKvxZN1dt/QxWKsw8OPkGD3WZMzwnA+fynqR5iddVqeHh1y5a7v6/yTvx+bOHHfb7fweXODWOd1PKCdAdSrJvS2ytS29Fz7PbH2dmLfGVqJzKU1Q1ooifvnODm78vbu34rnrpPJu+Va2dPQljUak967m9Se0ulE/lkxl756Df7pLCnGXE0LqtXnT/AO/qbPw9namdoMtVuaMuLvupS3nGjrZAJ6KNZBwlxZPotVsOSMqvBtCAICUBCAIAgCAIAsgLACAIAgCAIAgKdiUQwSSuBIjaXEDv0Cylt6MSels4/k/CzedlzLG8kb9OgBOnsdych3rp238e6vaqJQgq5vaXscrfmcrZTrWt+5gslVzdOnPDiLdaKO04eM1wLg4cuv8AaddgvGViyvnyizfg9QVK4z8fQ1vFVbmGL62LdHXyIaPHsTgmKRvcBux37eg9VqrplW+FfaS8v0JV11d6U7O8PRLyvuZPx7rjy5UtsSju6Bmm7/ZVmdlZ0LPhxfj6fwWmBg9NtqVkk+/1/kB8JOhBK0npsjoP3UOGT1CUlHfn/b/BLn0/pMYuWvH+7+T1DUbHMXW5IiQNgB+jv6K4p6Y1c7cpp/Z+36Ip7eqRjjqnDi0vqt+fPuebVu5YnirUIZYvvG+JNNF925vqGnr1U+WZ8V8av1+xW140aofEuXZ+F9TaIcdFDEwy7c+AOLdPJA2dn+QW6NcK5OUPUgSvsnBVt9kYq9lXTiYhxZC1nMwPAB5gFiNr3Js911baSRuvsZwMBxEXFdpsv2xejkhlc7ygRiTQAb9GNO1QW2ytlyl5OurqhVHhDwdKWs9hAEAQBAEAQBAEAQBAEAQBAEAQBAeJY2SxPjkG2PaWuHxBQNb7HLuKMFZ4cc2agAcU5zWsibt8jDrZJ2O3f1VtiZe/kmc7nYCrfOHgxQysPcNl/Qf3VpwKngY3Oinla8TLEb3CGTxGgnWiN/ArVdVW47s8Ik4srYT1X69i2r4rL5eAHBz1KwHU+970R2I6NPXao7OuKK1Uml9df8l7V0Np7u019G/+ETLwrxlDGXyZbBgAf9fX/wBa0/121+v9kSF0bH3+X+7MczAVZw21lzDNeHV0kUjg067aHT+ShXZdl9jb9S0pxKserS9DZsVdmsUIsfI9ooVz4kMZGiHEnfX8yuj6fiuiHJvv9Dkep534mXy/l+p7v3OTcbDogeZ2hrSsYx9SrSMRisTPxZxFWpY9zGHF2Ybdh87iGuZsdGaB2e/fSquo5EZv4a8o6LpmNOH+M/DX/wBO/lwjYXOOmjqSfRVZa+DF/wAS4b/mNc/R4WeLPDtgvUyFW5Wtt5qtiKYevI8HX6LDWj0pKXhldYPQQEoCEAQBAEAWQSsAhAEAQBAEAQBAeJY2yxujeNtcNEfELIa2tM53xV7N3vpM/g+SClb5xzm3I9zCz4dQ7qpEMq2D3FkJ9Px35j/c0+lwvlrOS+w8pNUfeqkSzv2RG6PfZum73o/ALRn5yupVUvzJ73+5tw8P8Pc7Y/la0Z3N4/KYSwyvg7FWvjS5rIo5QXua53UklwJ1v5ql+VvuW8FyKs3CXEGS5Is1cxtiuxwcGx8zTv6hg9NrK0vBhTj7FPJcIYWjFM412texhcz/AFEnfWx3K8qckzH51r0NGmvPx1GKaeCadjnEckDNub8yunw+qpLjZt/sc/ldFny5VNJfqXeHqZDi6rZdjGPowVo/FndciIE8fXbWEA9eh+C25XUudequ37GMPpfC1O3v49/c84O4eFMhTmxL3Vo5JWsnA8/NHzbI82/mudhZNz7ep099Vca+/oZi7xRmuJLr5IJn1aUrGtZXI/CdnZJ19P0XQ4+HyW2chldQaeq3rR5ocP0q1SKAxAuY3Xle7X81PhTGMUinsvlOTk/Uu8fZscM3hboO5az3N94jaA4vjb115gdevVa8jGhOHb0JOHlyqn9DrmIvsyeMrXomOjZPGHhr9bAP0VHKPF6Z1Fc1OCkvUvFg9hAEAQBAEAQBAEAQBAEBKAhAEAQBAcvy+UGJ9pV6V1SzaElWNnLWYHFvbzH5KvyVubJNcdwLri7MUzSoPbOxx98j21sjSQPiRvt81HimzbDcW9myHI0i1zhdqnv2mb/dY7mpJmnZe3HxFlvcqMoaKzmSySOLSyRnq1pG+qfl7s2xbijDZ6m2vLPHC2SOIs00neu3xKzBkiL2jdeEDE32cNqQzRyzx05OZkTuZ2zzeg6qyg916IU1q7b8bONZR9iTKwUnQT1zBM3xDNEWh4I7DfVecOEfiw5erR66jZJ0TUfRM2WhIa8rWsdyscRzb+C7RxSifPmtl4+exbkdHQmEXhHT3vaC1/0KjNyl4GoxW5AzOkpzwTg+IxvK5xGg86P4V6iuXysNaaaNh9jeUv3vturbtPlqUZ2RVY3Afdt0em9bPp3VDkpK6SXuddi/5EPsdKWgkBAEAQBAEAQBAEAQBAEAQBAEAQGOzeWrYem6zZfodmtHUuPwC2VVStlxiarro0x5SZzTFZh83GVrJ5SPwIp63hgu8je403Z9VF6njOmzt3XbuesDKjkVeVy2+xc8XcOYhlavLSgjZK6zG2R4e53Mz1GtqujLsWUeUn3M+zhTBNhLIaLeTRA1K/X/ANLzs8fEmu2zU8tiHcN2xZxTxDG5zWvjYOYvaOpHm33WU99mbYtSXYoZfKfbFJjIak0buvR3XW9j0Cn4XTbcjb8L3e+5Ay+o1Ya7/M36LQ9n2Sfw3lZ2Xo5HQWhHGx+uVsfU7JJ9Ov7KwXTLKd99/YgPrVd3GGtfsYj2kmb+La1qIO90tW/u5gNslHKPwu7H8loxK1+LTkvVE/NtTwfkfoy2yplbjrRrtJlEZ5A1uzv6eq6m/l8KWvOjj8dRdsefjZOBuzDHwjxh7wI2icaG2u12I9F4x2pVRT8pGcqpRtbS+X0PWXs3Z67oaZdLkHMPu0UbOZ7yO/K3XVecq1VVNp6Z6w8f4lq3Ha9TsHAuBqYbCxSQVHV7dyNktzmLtul5epIJ6H5DS52UnKTkzqYxUIqMfBsi8noIAgCAIAgJQEIAgCAIAgCAIAgBQHNuOiJeKGQzOLmisHNYT0HXqQrrpzXwu3nZzvV3JW/QwOVqG5WEbZQwteHgkb7L1m47yauCeiL0/LWJd8RrfoYibK38k4V32JIXMIkBdo/0C5Cyl0y4zWmd5VZXdHlX49y8j4hzlUCAW55GNPWTygfy9F44o98UvKPF3NuuD/U3vGO9jeu/6L3TBOyO122ebWoVSlH2Ze4sNNWOYAB7x1Px6ldvUoRilBaXsfOr7J2zcrHtlW7GySq/xAHcrTrfp0Wxd+zNUfJqlnMNlljqZh4jr0HapeM4AD48v+FQofAhdJzSWvBb/wDkTpiqpNrXdexUhyMFuRsGMkZcuSdIq0TxzSHvoKTZm0wi5Jps014F05qLi0vc90+EOK8nmq8EGLt4KGw5xs23sbIN62CRsfDX5qoszXvdXy78/UuqsFJat+bXj6HUeDOAIsDKbWWtR5a/HJzVrT4OR0A1ogdT8/1Uay6dr3N7JVVNdS+Ra2bsB0Ws2BAEAQBAEAQEoCEAQBAEAQBAEAQAoDlvtcq+424M5WtSPumMQR0AQ0SN35nb+WwpWLZOufKK2Qc2qmyGrHowEuRkkiAa3kJO9h210KgjluOmYfIyQVoDPLOK/p4mu/yVf1HEpthym+L9y46Zm30z4wXJe2+xV4Zr5/OYRl2jh32onF4D/EbpxBPTqQuVlRLl28HXxyI8e5StcMcazx8kPCDq7v8Ae2xGP6rfHH4vezRO5TWmipw9euUOfFZFrvfqgDbET3bLDvf0XS4Nishx9Ucf1DGcLHJLSZkrF58zQ0AsHY6PdT1HRAUdGCm+y2cW8PnNNr/Z5nd7x44HIRr/AIt+m9Kq6okuL+5edH/1/od0o8I8N0bUdujg8fXsRnccsVdrXN+hAVQXRnNIAgCAIAgCAIAgCAIAgJQEIAgCAIAgCAaQGm8e8N28ny5HFxNs34mCJlaZ4bG5pOyST6rfTe6vCIeThxyGm3o1CrwVxSzGWLk1Kocl4gZFUE4MZj15nF3x32Clf1GzlvRF/pFetcmTjfZLYzUJscV2ZqkwlHLUqSh8ZYNaJ2O5O+3ppRr8id0tsnY+NCiPGP7nWadSvSrtgqQxwxN7MY0ABRyQV0Byv2ucNzuu0eIabRFUqBzsm6Po5zPLpxA/FrRW6iz4die+xoyK/iVSil39DSmX2W68+QoB02LpvaLs5jcHRNd0BDdbPz+Ct59SrTjx/X6FLX0u3g+XZ+h4jxOR42q3I+Gqle1DEfDfLO7w3M31GgfoomTmxsjxS2SsLBsqfOb19DvnD9aalgsfVsjU0NeON43vqGgHqq0tzIIAgCAIAgJQBAEBCAIAgCAIAgCAIAgCAIAgCAIAgCAhzWvBa5ocD0II3tAU21oWtc1sUYa78QDQAUB6ihji34UbGA9+VoCA9oAgCAIAgCAIAgCAIAgCAICfRAQgCAIAgCAIAgCAIAsgLAAQBZACwCUBCAFAEAQBAEAQBAEAQH//2Q==")
const bulbasoar4 = new PokeMon('bulbasoar', 'grass', 'data:image/png;base64,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')
const charmander4 = new PokeMon('charmander','fire', 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQziXLj-1WhksbZiw3SDOqmKm3BZLh1L6gl8A&usqp=CAU')
const squirtle5 = new PokeMon('squirtle', 'water', "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAHoA2QMBEQACEQEDEQH/xAAbAAEAAQUBAAAAAAAAAAAAAAAAAQMEBQYHAv/EADoQAAEEAgAEAwUGBQIHAAAAAAEAAgMEBREGEiExEyJBBxRRYXEVIzKBkaEWscHR8CRSQlVic5Kjsv/EABsBAQACAwEBAAAAAAAAAAAAAAAEBQEDBgIH/8QAMxEAAgICAQMCBAUCBgMAAAAAAAECAwQREgUhMUFREyJhcRQygZHhFaEjM0Ji0fAkNMH/2gAMAwEAAhEDEQA/AO4oYIQBAEAQEoAgCAhAEBKAhANoBtAEAQBAEAQBASgCAhAEAQBAEBKAhAEAQBAEAQBAEAQBAY7NZaDFVXPlewTOa7wY3HXiOA7LbTTK2Wl49foaMi+NMG5Pv6fU0bJ57I5tjGPjlxvhHmDoZjt/po9lbU41dL3+bf0KHJ6hO5JJcfszGuZd0R9sX9/95391Ica2vyL9iH+ItX+p/uz1i8pk8DM60yWzlC9vJ4M850315vX4KJdhxa+UlY3UZ1ybl3/U3rhjiWLMxCKw2OvkQHOfUD+ZzWA6Dv3H6qtuplW9MvcXKjfHa8mwLSSggCAIAgCAIAgCAIAgCAIAgCAlAQgCAlAQEAQBAWmWu/Z2NtXSwyCvC6TkB1zaG9LMVt6PFk+EHL2OYyZKXNWn37MpMEh54K73cwg9Do/krvHp+HDcfXycvl5Tun38LwenSNHYg9VvUSG5FFz2t1zuA36krYeCR6dv8KApnxYJfeaFg1rA6OlZ3c31b/L9FpupjYtM30ZEqZbidI4WzY4gxLb7YDCDI5nIXb7Khshwlo63Hu+NDkZleDcQgCAICUAQEIAgCAIAgJQEIAgCAIAgCAIAgCA0b2p3rtWpRgpOk5bTnxyxsGzKNDy6/NSKOMW5yW9dyDm85ca4vXJ6NUx3NHUjjkifBK0eaF4LXM79weoVzj2K2pWa1s5zMp+BdKve9epcgn5n81uIpjMrZjpMM9x7fD1921zg3TgPn37LErIwjts301StkoxLnhaJ3EWHbka+VgieWue+qSHSNDTrro9N6/dQl1KtvXAtJdImk3yR4OQjdVEo68/Tl5uoVglvwU6iXnswzc/8XzcPte/3WOm6wGdOXm5mdfj6lU3UFCNmku50fTIz+Hycvl9jriry1JCAhAEAQBAEAQBAEAQEoCEAQBAEAQEoCEAQAoDnntYtvihx8tF/PZqzOk5ItOc0gAg6/upFMW4y17EDMnGM69+5q+ItXMlF9p5FzjYstBeJG8j9jp1AGh2Vth7WPCMvJR9TnCeVNw8fwZD/ADupJXmH4n4afxNjTEy/Wp+67nJnP49A9B81XdS0q4/cuui/5stexaewutEDk5gz7x+PfzHZ6+ZUkJP4ridNbBKnkUaYIrt2utx+1aOGl5Mn7LevtYu/LFHX/lGqXqL/AMdnS9N/9Zfc7ioJPCAIAgCAIAgCAIAgCALICwAgCAIAgCAIAgKT7EDXFjpow4dSC4bCzp63oxyjvycd40nscOcV381dLbGKyT44qxruaTG8NAPPvXTofUqXj3up6mVmbhq6POvyKls3Q6aOZhY9vlaSOYHt1V1CUJJaOdnBxfdFeIuaxonkYX+pBAXpmvz4LfI1aV6v4dwNkjb5tB+j+xCj30VXpKxb0SsXKvxZN1dt/QxWKsw8OPkGD3WZMzwnA+fynqR5iddVqeHh1y5a7v6/yTvx+bOHHfb7fweXODWOd1PKCdAdSrJvS2ytS29Fz7PbH2dmLfGVqJzKU1Q1ooifvnODm78vbu34rnrpPJu+Va2dPQljUak967m9Se0ulE/lkxl756Df7pLCnGXE0LqtXnT/AO/qbPw9namdoMtVuaMuLvupS3nGjrZAJ6KNZBwlxZPotVsOSMqvBtCAICUBCAIAgCAIAsgLACAIAgCAIAgKdiUQwSSuBIjaXEDv0Cylt6MSels4/k/CzedlzLG8kb9OgBOnsdych3rp238e6vaqJQgq5vaXscrfmcrZTrWt+5gslVzdOnPDiLdaKO04eM1wLg4cuv8AaddgvGViyvnyizfg9QVK4z8fQ1vFVbmGL62LdHXyIaPHsTgmKRvcBux37eg9VqrplW+FfaS8v0JV11d6U7O8PRLyvuZPx7rjy5UtsSju6Bmm7/ZVmdlZ0LPhxfj6fwWmBg9NtqVkk+/1/kB8JOhBK0npsjoP3UOGT1CUlHfn/b/BLn0/pMYuWvH+7+T1DUbHMXW5IiQNgB+jv6K4p6Y1c7cpp/Z+36Ip7eqRjjqnDi0vqt+fPuebVu5YnirUIZYvvG+JNNF925vqGnr1U+WZ8V8av1+xW140aofEuXZ+F9TaIcdFDEwy7c+AOLdPJA2dn+QW6NcK5OUPUgSvsnBVt9kYq9lXTiYhxZC1nMwPAB5gFiNr3Js911baSRuvsZwMBxEXFdpsv2xejkhlc7ygRiTQAb9GNO1QW2ytlyl5OurqhVHhDwdKWs9hAEAQBAEAQBAEAQBAEAQBAEAQBAeJY2SxPjkG2PaWuHxBQNb7HLuKMFZ4cc2agAcU5zWsibt8jDrZJ2O3f1VtiZe/kmc7nYCrfOHgxQysPcNl/Qf3VpwKngY3Oinla8TLEb3CGTxGgnWiN/ArVdVW47s8Ik4srYT1X69i2r4rL5eAHBz1KwHU+970R2I6NPXao7OuKK1Uml9df8l7V0Np7u019G/+ETLwrxlDGXyZbBgAf9fX/wBa0/121+v9kSF0bH3+X+7MczAVZw21lzDNeHV0kUjg067aHT+ShXZdl9jb9S0pxKserS9DZsVdmsUIsfI9ooVz4kMZGiHEnfX8yuj6fiuiHJvv9Dkep534mXy/l+p7v3OTcbDogeZ2hrSsYx9SrSMRisTPxZxFWpY9zGHF2Ybdh87iGuZsdGaB2e/fSquo5EZv4a8o6LpmNOH+M/DX/wBO/lwjYXOOmjqSfRVZa+DF/wAS4b/mNc/R4WeLPDtgvUyFW5Wtt5qtiKYevI8HX6LDWj0pKXhldYPQQEoCEAQBAEAWQSsAhAEAQBAEAQBAeJY2yxujeNtcNEfELIa2tM53xV7N3vpM/g+SClb5xzm3I9zCz4dQ7qpEMq2D3FkJ9Px35j/c0+lwvlrOS+w8pNUfeqkSzv2RG6PfZum73o/ALRn5yupVUvzJ73+5tw8P8Pc7Y/la0Z3N4/KYSwyvg7FWvjS5rIo5QXua53UklwJ1v5ql+VvuW8FyKs3CXEGS5Is1cxtiuxwcGx8zTv6hg9NrK0vBhTj7FPJcIYWjFM412texhcz/AFEnfWx3K8qckzH51r0NGmvPx1GKaeCadjnEckDNub8yunw+qpLjZt/sc/ldFny5VNJfqXeHqZDi6rZdjGPowVo/FndciIE8fXbWEA9eh+C25XUudequ37GMPpfC1O3v49/c84O4eFMhTmxL3Vo5JWsnA8/NHzbI82/mudhZNz7ep099Vca+/oZi7xRmuJLr5IJn1aUrGtZXI/CdnZJ19P0XQ4+HyW2chldQaeq3rR5ocP0q1SKAxAuY3Xle7X81PhTGMUinsvlOTk/Uu8fZscM3hboO5az3N94jaA4vjb115gdevVa8jGhOHb0JOHlyqn9DrmIvsyeMrXomOjZPGHhr9bAP0VHKPF6Z1Fc1OCkvUvFg9hAEAQBAEAQBAEAQBAEBKAhAEAQBAcvy+UGJ9pV6V1SzaElWNnLWYHFvbzH5KvyVubJNcdwLri7MUzSoPbOxx98j21sjSQPiRvt81HimzbDcW9myHI0i1zhdqnv2mb/dY7mpJmnZe3HxFlvcqMoaKzmSySOLSyRnq1pG+qfl7s2xbijDZ6m2vLPHC2SOIs00neu3xKzBkiL2jdeEDE32cNqQzRyzx05OZkTuZ2zzeg6qyg916IU1q7b8bONZR9iTKwUnQT1zBM3xDNEWh4I7DfVecOEfiw5erR66jZJ0TUfRM2WhIa8rWsdyscRzb+C7RxSifPmtl4+exbkdHQmEXhHT3vaC1/0KjNyl4GoxW5AzOkpzwTg+IxvK5xGg86P4V6iuXysNaaaNh9jeUv3vturbtPlqUZ2RVY3Afdt0em9bPp3VDkpK6SXuddi/5EPsdKWgkBAEAQBAEAQBAEAQBAEAQBAEAQGOzeWrYem6zZfodmtHUuPwC2VVStlxiarro0x5SZzTFZh83GVrJ5SPwIp63hgu8je403Z9VF6njOmzt3XbuesDKjkVeVy2+xc8XcOYhlavLSgjZK6zG2R4e53Mz1GtqujLsWUeUn3M+zhTBNhLIaLeTRA1K/X/ANLzs8fEmu2zU8tiHcN2xZxTxDG5zWvjYOYvaOpHm33WU99mbYtSXYoZfKfbFJjIak0buvR3XW9j0Cn4XTbcjb8L3e+5Ay+o1Ya7/M36LQ9n2Sfw3lZ2Xo5HQWhHGx+uVsfU7JJ9Ov7KwXTLKd99/YgPrVd3GGtfsYj2kmb+La1qIO90tW/u5gNslHKPwu7H8loxK1+LTkvVE/NtTwfkfoy2yplbjrRrtJlEZ5A1uzv6eq6m/l8KWvOjj8dRdsefjZOBuzDHwjxh7wI2icaG2u12I9F4x2pVRT8pGcqpRtbS+X0PWXs3Z67oaZdLkHMPu0UbOZ7yO/K3XVecq1VVNp6Z6w8f4lq3Ha9TsHAuBqYbCxSQVHV7dyNktzmLtul5epIJ6H5DS52UnKTkzqYxUIqMfBsi8noIAgCAIAgJQEIAgCAIAgCAIAgBQHNuOiJeKGQzOLmisHNYT0HXqQrrpzXwu3nZzvV3JW/QwOVqG5WEbZQwteHgkb7L1m47yauCeiL0/LWJd8RrfoYibK38k4V32JIXMIkBdo/0C5Cyl0y4zWmd5VZXdHlX49y8j4hzlUCAW55GNPWTygfy9F44o98UvKPF3NuuD/U3vGO9jeu/6L3TBOyO122ebWoVSlH2Ze4sNNWOYAB7x1Px6ldvUoRilBaXsfOr7J2zcrHtlW7GySq/xAHcrTrfp0Wxd+zNUfJqlnMNlljqZh4jr0HapeM4AD48v+FQofAhdJzSWvBb/wDkTpiqpNrXdexUhyMFuRsGMkZcuSdIq0TxzSHvoKTZm0wi5Jps014F05qLi0vc90+EOK8nmq8EGLt4KGw5xs23sbIN62CRsfDX5qoszXvdXy78/UuqsFJat+bXj6HUeDOAIsDKbWWtR5a/HJzVrT4OR0A1ogdT8/1Uay6dr3N7JVVNdS+Ra2bsB0Ws2BAEAQBAEAQEoCEAQBAEAQBAEAQAoDlvtcq+424M5WtSPumMQR0AQ0SN35nb+WwpWLZOufKK2Qc2qmyGrHowEuRkkiAa3kJO9h210KgjluOmYfIyQVoDPLOK/p4mu/yVf1HEpthym+L9y46Zm30z4wXJe2+xV4Zr5/OYRl2jh32onF4D/EbpxBPTqQuVlRLl28HXxyI8e5StcMcazx8kPCDq7v8Ae2xGP6rfHH4vezRO5TWmipw9euUOfFZFrvfqgDbET3bLDvf0XS4Nishx9Ucf1DGcLHJLSZkrF58zQ0AsHY6PdT1HRAUdGCm+y2cW8PnNNr/Z5nd7x44HIRr/AIt+m9Kq6okuL+5edH/1/od0o8I8N0bUdujg8fXsRnccsVdrXN+hAVQXRnNIAgCAIAgCAIAgCAIAgJQEIAgCAIAgCAaQGm8e8N28ny5HFxNs34mCJlaZ4bG5pOyST6rfTe6vCIeThxyGm3o1CrwVxSzGWLk1Kocl4gZFUE4MZj15nF3x32Clf1GzlvRF/pFetcmTjfZLYzUJscV2ZqkwlHLUqSh8ZYNaJ2O5O+3ppRr8id0tsnY+NCiPGP7nWadSvSrtgqQxwxN7MY0ABRyQV0Byv2ucNzuu0eIabRFUqBzsm6Po5zPLpxA/FrRW6iz4die+xoyK/iVSil39DSmX2W68+QoB02LpvaLs5jcHRNd0BDdbPz+Ct59SrTjx/X6FLX0u3g+XZ+h4jxOR42q3I+Gqle1DEfDfLO7w3M31GgfoomTmxsjxS2SsLBsqfOb19DvnD9aalgsfVsjU0NeON43vqGgHqq0tzIIAgCAIAgJQBAEBCAIAgCAIAgCAIAgCAIAgCAIAgCAhzWvBa5ocD0II3tAU21oWtc1sUYa78QDQAUB6ihji34UbGA9+VoCA9oAgCAIAgCAIAgCAIAgCAICfRAQgCAIAgCAIAgCAIAsgLAAQBZACwCUBCAFAEAQBAEAQBAEAQH//2Q==")
const bulbasoar5 = new PokeMon('bulbasoar', 'grass', 'data:image/png;base64,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')
const charmander5 = new PokeMon('charmander','fire', 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQziXLj-1WhksbZiw3SDOqmKm3BZLh1L6gl8A&usqp=CAU')
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
const forestEnemies = test1
const caveEnemies = test2
const glacierEnemies = test3
const skyEnemies = test4
const forest = new Room('Forest', forestEnemies, 'lightgreen')
const cave = new Room('Cave', caveEnemies, 'lightslategrey')
const glacier = new Room('Glacier', glacierEnemies,'skyblue' )
const victoryRoad = new Room('Victory Road', skyEnemies, 'darkred')
const rooms = [forest, cave, glacier, victoryRoad]
const chuey = new User('user')
chuey.addPoke(squirtle)
chuey.addPoke(bulbasoar)
chuey.addPoke(charmander)
test1.currentRoom = forest
test2.currentRoom = cave
test3.currentRoom = glacier
test4.currentRoom = victoryRoad
// console.log(test2.isDefeated())
// console.log(test2.pokemon)








function roomBattle() {
      chuey.battle()
      if(chuey.currentRoom.isCleared()) {
         chuey.advanceRoom()
      }
      
}
function play() {
    chuey.battle()
   
}
// console.log(chuey.currentRoom.isCleared(
    // squirtle.currentHp = 0
    // charmander.currentHp = 0
    // bulbasoar.currentHp = 0

function endGame() {
    let container = document.querySelector('.container')
    container.style.display = 'none'
    let gameOverScreen = document.querySelector('.game-over')
    gameOverScreen.style.display = 'block'
    let resetButton = document.querySelector('#reset')
    resetButton.addEventListener('click', () => {
        location.reload()
    })
}



play()