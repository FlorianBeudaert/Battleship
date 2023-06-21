/*jslint browser this */
/*global _, player, computer, utils */

(function () {
    "use strict";

    var game = {
        PHASE_INIT_PLAYER: "PHASE_INIT_PLAYER",
        PHASE_INIT_OPPONENT: "PHASE_INIT_OPPONENT",
        PHASE_PLAY_PLAYER: "PHASE_PLAY_PLAYER",
        PHASE_PLAY_OPPONENT: "PHASE_PLAY_OPPONENT",
        PHASE_GAME_OVER: "PHASE_GAME_OVER",
        PHASE_WAITING: "waiting",

        currentPhase: "",
        phaseOrder: [],
        // garde une référence vers l'indice du tableau phaseOrder qui correspond à la phase de jeu pour le joueur humain
        playerTurnPhaseIndex: 2,

        // l'interface utilisateur doit-elle être bloquée ?
        waiting: false,
        difficulty: null,
        // garde une référence vers les noeuds correspondant du dom
        grid: null,
        miniGrid: null,

        // liste des joueurs
        players: [],
        ship:null,
        ori:0,
        currentShipLife : 0,

        // lancement du jeu
        init: function () {

            // initialisation
            this.grid = document.querySelector('.board .main-grid');
            this.miniGrid = document.querySelector('.board .mini-grid');

            // défini l'ordre des phase de jeu
            this.phaseOrder = [
                this.PHASE_INIT_PLAYER,
                this.PHASE_INIT_OPPONENT,
                this.PHASE_PLAY_PLAYER,
                this.PHASE_PLAY_OPPONENT,
                this.PHASE_GAME_OVER,
                this.PLAYER_WIN,
                this.PLAYER_LOSE
            ];
            this.playerTurnPhaseIndex = 2;

            // initialise les joueurs
            this.setupPlayers();

            // ajoute les écouteur d'événement sur la grille
            this.addListeners();

            // c'est parti !
            this.goNextPhase();
        },
        setupPlayers: function () {
            // donne aux objets player et computer une réference vers l'objet game
            player.setGame(this);
            computer.setGame(this);

            // todo : implémenter le jeu en réseaux
            this.players = [player, computer];

            this.players[0].init();
            this.players[1].init();
        },
        goNextPhase: function () {
            // récupération du numéro d'index de la phase courante
            var ci = this.phaseOrder.indexOf(this.currentPhase);
            var self = this;
            
            if (ci !== this.phaseOrder.length - 1) {
                this.currentPhase = this.phaseOrder[ci + 1];
            } else {
                this.currentPhase = this.phaseOrder[0];
            }

            switch (this.currentPhase) {
            case this.PLAYER_WIN:
                this.wait();
                utils.info("Partie terminée : vous avez gagné !");
                break;
            case this.PLAYER_LOSE:
                
            case this.PHASE_GAME_OVER:
               console.log(this.gameIsOver())
                // detection de la fin de partie
                if (this.gameIsOver() == false) {
                    // le jeu n'est pas terminé on recommence un tour de jeu
                  
                    utils.info("A vous de jouer, choisissez une case !")
                    this.currentPhase = this.phaseOrder[2];
                }else if(this.gameIsOver() == 1){
                    // le jeu est terminé
                    this.currentPhase = this.phaseOrder[5];
                    break;
                    
                }else if(this.gameIsOver() == 2){
                    this.currentPhase = this.phaseOrder[6];
                    break;
                }
                case this.PHASE_PLAY_PLAYER:
                
                
                utils.info("A vous de jouer, choisissez une case !");
                let help = document.createElement("button");
            help.innerHTML = "Help";
            let helpPlacement = document.querySelector('.game-info');
            helpPlacement.appendChild(help);
            help.addEventListener('click',()=>{
                self.help();
            })
                break;
            case this.PHASE_PLAY_OPPONENT:
                utils.info("A votre adversaire de jouer...");
                this.players[1].play();
                break;
            case this.PHASE_INIT_PLAYER:
                this.wait();
                utils.info("Choisissez votre difficulté");
                let gameInfo = document.querySelector('.game-info');
                let easy = document.createElement('button');
                let normal = document.createElement('button')
                let hard = document.createElement('button');
                easy.innerHTML = "easy";
                normal.innerHTML = "normal";
                hard.innerHTML= "hard";
                gameInfo.appendChild(easy);
                gameInfo.appendChild(normal);
                gameInfo.appendChild(hard);
                easy.addEventListener('click', ()=>{
                    self.difficulty = 0;
                    utils.info("Placez vos bateaux");
                    self.stopWaiting()
                })
                normal.addEventListener('click',()=>{
                    self.difficulty = 1;
                    utils.info("Placez vos bateaux");
                    self.stopWaiting()
                })
                hard.addEventListener('click',()=>{
                    self.difficulty = 2;
                    utils.info("Placez vos bateaux");
                    self.stopWaiting()
                });

                break;
                
            case this.PHASE_INIT_OPPONENT:
                this.wait();
                utils.info("En attente de votre adversaire");
                this.players[1].isShipOk(function () {
                    
                    utils.info('Qui commence ?');
                    let gameInfo = document.querySelector('.game-info');
                    let playerbtn = document.createElement('button');
                    let computerbtn = document.createElement('button')
                    let random = document.createElement('button');
                    random.innerHTML = "Random";
                    playerbtn.innerHTML = "Player";
                    computerbtn.innerHTML= "Computer";
                    gameInfo.appendChild(playerbtn);
                    gameInfo.appendChild(random);
                    gameInfo.appendChild(computerbtn);
                    random.addEventListener('click', ()=>{
                        let rdm = Math.random();
                        if(rdm>0.5){
                            self.currentPhase = self.phaseOrder[2];
                          
                            utils.info("A vous de jouer, choisissez une case !")
                            self.stopWaiting();
                        }else{
                            self.currentPhase = self.phaseOrder[3];
                            utils.info("A votre adversaire de jouer...");
                            console.log(self.currentPhase)
                            self.players[1].play();
                            self.stopWaiting();
                        }
                    })
                    computerbtn.addEventListener('click',()=>{
                            self.currentPhase = self.phaseOrder[3];
                            utils.info("A votre adversaire de jouer...");
                            console.log(self.currentPhase)
                            self.players[1].play();
                            self.stopWaiting();
                    })
                    playerbtn.addEventListener('click',()=>{
                        self.currentPhase = self.phaseOrder[2];
                            console.log(self.currentPhase)
                            utils.info("A vous de jouer, choisissez une case !")
                            let help = document.createElement("button");
                            help.innerHTML = "Help";
                            let helpPlacement = document.querySelector('.game-info');
                            helpPlacement.appendChild(help);
                            help.addEventListener('click',()=>{
                            self.help();
                            })
                            self.stopWaiting();
                    });
                });
                break;
            
            }

        },
        help: function(){
            let hint = [];
                for(let i = 0; i < 10; i++){
                    for (let v = 0; v < 10; v++){
                        if(this.players[1].grid[i][v] != 0){
                            hint["y"] = i;
                            hint["x"] = v;
                        }
                    }
                }
                let i = 0;
                let v = 0;
                document.querySelectorAll('.main-grid .row').forEach(function (row) {
                    Array.from(row.children).forEach(function (cell) {
                        if(hint["y"] == i && hint["x"] == v){
                            cell.style.backgroundColor = "orange";
                            setTimeout(() => {
                                cell.style.backgroundColor = "";
                            }, 700);
                        }
                        v++;
                    });
                    v = 0;
                    i++;
                });
            
        },
        gameIsOver: function () {
            var totalLife = 0;
            var totalLife2 = 0;
            for(let i = 0; i < this.players[0].fleet.length; i++){
                totalLife += this.players[0].fleet[i].getLife();
            }
            for(let i = 0; i < this.players[1].fleet.length; i++){
                totalLife2 += this.players[1].fleet[i].getLife();
            }
            console.log(totalLife, totalLife2);
            if(totalLife == 0){
                
                this.wait();
                utils.info("Partie terminée : vous avez perdu !");
                console.log("lose")
            }else if(totalLife2 == 0){
                this.wait();
                utils.info("Partie terminée : vous avez gagné !");
                console.log("win")
               
            }
            else{
                return false;
            }
        },
        getPhase: function () {
            if (this.waiting) {
                return this.PHASE_WAITING;
            }
            return this.currentPhase;
        },
        // met le jeu en mode "attente" (les actions joueurs ne doivent pas être pris en compte si le jeu est dans ce mode)
        wait: function () {
            this.waiting = true;
        },
        // met fin au mode mode "attente"
        stopWaiting: function () {
            this.waiting = false;
        },
        addListeners: function () {
            // on ajoute des acouteur uniquement sur la grid (délégation d'événement)
            this.grid.addEventListener('mousemove', _.bind(this.handleMouseMove, this));
            this.grid.addEventListener('mousedown', _.bind(this.handleClick, this));   
        },
        handleMouseMove: function (e) {
            // on est dans la phase de placement des bateau
            if (this.getPhase() === this.PHASE_INIT_PLAYER && e.target.classList.contains('cell')) {
                this.ship = this.players[0].fleet[this.players[0].activeShip];
                var ship = this.ship;
                // si on a pas encore affiché (ajouté aux DOM) ce bateau
                if (!ship.dom.parentNode) {
                    this.grid.appendChild(this.ship.dom);
                    // passage en arrière plan pour ne pas empêcher la capture des événements sur les cellules de la grille
                    ship.dom.style.zIndex = -1;
                }

                // décalage visuelle, le point d'ancrage du curseur est au milieu du bateau
                ship.dom.style.top = "" + (utils.eq(e.target.parentNode)) * utils.CELL_SIZE - (600 + this.players[0].activeShip * 60) + "px";
                ship.dom.style.left = "" + utils.eq(e.target) * utils.CELL_SIZE - Math.floor(ship.getLife() / 2) * utils.CELL_SIZE + "px";
                //make the display working for vertical and horizontal
                if (this.ori % 2 == 1) {
                    ship.dom.style.transform = "rotate(90deg)";
                    if(this.players[0].activeShip == 2){
                        ship.dom.style.top = "" + (utils.eq(e.target.parentNode)) * utils.CELL_SIZE - (600 + this.players[0].activeShip * 60) - 30 + "px";
                        ship.dom.style.left = "" + utils.eq(e.target) * utils.CELL_SIZE - Math.floor(ship.getLife() / 2) * utils.CELL_SIZE + 30 + "px";
                    }
                }
                else {
                    ship.dom.style.transform = "rotate(0deg)";
                }
 
            }
        },
        handleClick: function (e) {
            // self garde une référence vers "this" en cas de changement de scope
            var self = this;
            var ship = this.players[0].fleet[this.players[0].activeShip];
            // si on a cliqué sur une cellule (délégation d'événement)
            if (e.target.classList.contains('cell')) {
                // si on est dans la phase de placement des bateau
                if (this.getPhase() === this.PHASE_INIT_PLAYER) {
                    // on enregistre la position du bateau, si cela se passe bien (la fonction renvoie true) on continue
                    if (this.players[0].setActiveShipPosition(utils.eq(e.target), utils.eq(e.target.parentNode), e)) {
                        // et on passe au bateau suivant (si il n'y en plus la fonction retournera false)
                        if (!this.players[0].activateNextShip()) {
                            this.wait();
                            utils.confirm("Confirmez le placement ?", function () {
                                // si le placement est confirmé
                                self.stopWaiting();
                                self.renderMiniMap();
                                self.players[0].clearPreview();
                                self.goNextPhase();
                            }, function () {
                                self.stopWaiting();
                                // sinon, on efface les bateaux (les positions enregistrées), et on recommence
                                self.players[0].resetShipPlacement();
                            });
                        }
                    }
                // si on est dans la phase de jeu (du joueur humain)
                } else if (this.getPhase() === this.PHASE_PLAY_PLAYER) {
                    this.players[0].play(utils.eq(e.target), utils.eq(e.target.parentNode));
                }
            }
        },
        // fonction utlisée par les objets représentant les joueurs (ordinateur ou non)
        // pour placer un tir et obtenir de l'adversaire l'information de réusssite ou non du tir
        fire: function (from, col, line, callback) {
            this.wait();
            var self = this;
            var msg = "";

            // determine qui est l'attaquant et qui est attaqué
            var target = this.players.indexOf(from) === 0
                ? this.players[1]
                : this.players[0];

            if (this.currentPhase === this.PHASE_PLAY_OPPONENT) {
                msg += "Votre adversaire a... ";
            }

            // on demande à l'attaqué si il a un bateaux à la position visée
            // le résultat devra être passé en paramètre à la fonction de callback (3e paramètre)
            target.receiveAttack(col, line, function (hasSucceed) {
                let hitShip = self.players[0].grid[line][col];
                let hitShip2 = self.players[1].grid[line][col];
                
                var songs = new Audio();
                songs.src= '../chips/fire.mp3'
                songs.play();
                if (hasSucceed) {
                    var song = new Audio();
                    song.src = '../chips/touche.mp3';
                  
                    if (self.currentPhase == self.PHASE_PLAY_OPPONENT) {
                            msg += "Touché !";
                            self.players[0].fleet[hitShip].life -= 1;           
                            song.play()
                            document.querySelectorAll(".mini-grid .row")[line].children[col].style.filter = "opacity(60%)";
                    }else{
                        if(document.querySelectorAll(".main-grid .row")[line].children[col].style.backgroundColor == "red"){
                            msg += "Vous avez déjà touché ce bateau ici !"
                            setTimeout(function songPlay(){
                                song.play()
                            }, 1500)
                        }else{
                            msg += "Touché !";
                            self.players[1].fleet[hitShip2].life -= 1;
                            setTimeout(function songPlay(){
                                song.play()
                                document.querySelectorAll(".main-grid .row")[line].children[col].style = "background-color:red;";
                                document.querySelectorAll(".main-grid .row")[line].children[col].removeChild(anim)
                            }, 1500)
                            let anim = document.createElement('div');
                            anim.classList.add('hit');
                            document.querySelectorAll(".main-grid .row")[line].children[col].appendChild(anim);
                        }
                    }
                } else {
                    var song = new Audio();
                    song.src = "../chips/plouf.mp3"
                    if (self.currentPhase == self.PHASE_PLAY_OPPONENT) {                      
                        msg += "Manqué...";
                        setTimeout(function songPlay(){
                            song.play()
                        }, 1500)
                    }else{
                        if(document.querySelectorAll(".main-grid .row")[line].children[col].style.backgroundColor == "grey"){
                            msg += "C'est encore manqué ! Voilà quelqu'un de borné !";
                            song.play()
                        }else{
                            msg += "Manqué...";
                            let anim = document.createElement('div');
                            anim.classList.add('miss');
                            document.querySelectorAll(".main-grid .row")[line].children[col].appendChild(anim);
                            setTimeout(function songPlay(){
                                song.play()
                                document.querySelectorAll(".main-grid .row")[line].children[col].removeChild(anim)
                                document.querySelectorAll(".main-grid .row")[line].children[col].style.backgroundColor = "grey";
                            }, 1000)
                            
                        }
                    }
                }
                for(let i = 3; i <= 3; i++){
                    if(self.players[0].fleet[i].life <= 0){
                        self.players[0].activeShip -= 1
                    }else if(self.players[1].fleet[i].life <= 0){
                        self.players[1].activeShip -= 1
                    }
                }
                if(self.players[0].fleet[0].life <= 0){
                    document.querySelector('.battleship').classList.add("sunk");
                }
                if(self.players[0].fleet[1].life <= 0){
                    document.querySelector('.destroyer').classList.add("sunk");
                }
                if(self.players[0].fleet[2].life <= 0){
                    document.querySelector('.submarine').classList.add("sunk");
                }
                if(self.players[0].fleet[3].life <= 0){
                    document.querySelector('.small-ship').classList.add("sunk");
                }
                utils.info(msg);

                // on invoque la fonction callback (4e paramètre passé à la méthode fire)
                // pour transmettre à l'attaquant le résultat de l'attaque
            
                callback(hasSucceed);
                // on fait une petite pause avant de continuer...
                // histoire de laisser le temps au joueur de lire les message affiché
                setTimeout(function () {
                    self.stopWaiting();
                    if(self.gameIsOver() == false){
                        self.goNextPhase();
                    }
                }, 1000);
            });

        },
        renderMap: function () {
            this.players[0].renderTries(this.grid);
        },
        renderMiniMap: function () {
            let i = 0;
            let v = 0;
            document.querySelectorAll('.mini-grid .row').forEach(function (row) {
                Array.from(row.children).forEach(function (cell) {
                    if(player.grid[i][v] == 1){
                        cell.style.backgroundColor = "red";
                        cell.classList.add("zero");
                    }
                    if(player.grid[i][v] == 2){
                        cell.style.backgroundColor = "blue";
                        cell.classList.add("one");
                    }
                    if(player.grid[i][v] == 3){
                        cell.style.backgroundColor = "green";
                        cell.classList.add("two");
                    }
                    if(player.grid[i][v] == 4){
                        cell.style.backgroundColor = "black";
                        cell.classList.add("three");
                    }
                    v++;
                });
                v = 0;
                i++;
            });
        }
    };

    // point d'entrée
    document.addEventListener('DOMContentLoaded', function () {
        game.init();
    });

}());