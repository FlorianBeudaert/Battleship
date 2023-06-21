/*jslint browser this */
/*global _, shipFactory, player, utils */

(function (global) {
    "use strict";

    var ship = {dom: {parentNode: {removeChild: function () {}}}};

    var player = {
        grid: [],
        tries: [],
        fleet: [],
        game: null,
        activeShip: 0,
        init: function () {
            // créé la flotte
            this.fleet.push(shipFactory.build(shipFactory.TYPE_BATTLESHIP));
            this.fleet.push(shipFactory.build(shipFactory.TYPE_DESTROYER));
            this.fleet.push(shipFactory.build(shipFactory.TYPE_SUBMARINE));
            this.fleet.push(shipFactory.build(shipFactory.TYPE_SMALL_SHIP));

            // créé les grilles
            this.grid = utils.createGrid(10, 10);
            this.tries = utils.createGrid(10, 10);
        },
        play: function (col, line) {
            // appel la fonction fire du game, et lui passe une calback pour récupérer le résultat du tir
            
            this.game.fire(this, col, line, _.bind(function (hasSucced) {
                this.tries[line][col] = hasSucced;
            }, this));
        },
        // quand il est attaqué le joueur doit dire si il a un bateaux ou non à l'emplacement choisi par l'adversaire
        receiveAttack: function (col, line, callback) {
            var succeed = false;

            if (this.grid[line][col] !== 0) {
                succeed = true;
                this.grid[line][col] = 0;
            }
            callback.call(undefined, succeed);
        },
        setActiveShipPosition: function (x, y, e) {
            e.preventDefault();
            var ship = this.fleet[this.activeShip];
            if(e.which == 1){
                if(this.game.ori == 0){
                    if(ship.getLife() === 3){
                        var i = -1;
                        var i2 = i + ship.getLife() - 1;
                        if(this.grid[y][x + i] == 0 && this.grid[y][x + i2] == 0 && this.grid[y][x + i2 - 1] == 0){
                            while (i < ship.getLife() - 1) {
                                this.grid[y][x + i] = ship.getId();
                                i += 1;
                                
                            }
                            
                            this.game.ori = 0;
                            return true;
                        }
                      else{return false;}
                      
                    }
                    else{
                        var i = -2;
                        var i2 = i + ship.getLife() - 1;
                        if(this.grid[y][x + i] == 0 && this.grid[y][x + i2] == 0 && this.grid[y][x + i2 - 1] == 0 && this.grid[y][x + i2 - 2] == 0 && this.grid[y][x + i2 - 3] == 0){
        
                            while (i < ship.getLife() - 2) {
                                this.grid[y][x + i] = ship.getId();
                                i += 1;
                                
                            }
                            
                            this.game.ori = 0;
                            return true;
                        }
                        else{
                            return false;
                        }
                    }
                }else{
                    if(ship.getLife() === 3){
                        var i = -1;
                        var i2 = i + ship.getLife() - 1;
                        if(this.grid[y + i][x] == 0 && this.grid[y + i2][x] == 0 && this.grid[y + i2 - 1][x] == 0){
                            while (i < ship.getLife() - 1) {
                                this.grid[y + i][x] = ship.getId();
                                i += 1;
                                
                            }
                            
                            this.game.ori = 0;
                            return true;
                        }
                      else{
                        return false;
                    }
                      
                    }
                    else{
                        var i = -2;
                        var i2 = i + ship.getLife() - 1;
                        if(this.grid[y + i][x] == 0 && this.grid[y + i2][x] == 0 && this.grid[y + i2 - 1][x] == 0 && this.grid[y + i2 - 2][x] == 0 && this.grid[y + i2 - 3][x] == 0){
        
                            while (i < ship.getLife() - 2) {
                                this.grid[y + i][x] = ship.getId();
                                i += 1;
                                
                            }
                            
                            this.game.ori = 0;
                            return true;
                        }
                        else{
                            return false;
                        }
                    }

                }
        }else{
            this.game.currentShipLife = ship.getLife();
            this.game.ori += 1;
            this.game.handleMouseMove(e);
            let h = this.game.ship.dom.style.height;
            let w = this.game.ship.dom.style.width;
            console.log(this.game.ori);
            
        }
        },
        clearPreview: function () {
            this.fleet.forEach(function (ship) {
                if (ship.dom.parentNode) {
                    ship.dom.parentNode.removeChild(ship.dom);
                }
            });
        },
        setGame: function (game) {
            this.game = game;
        },
        resetShipPlacement: function () {
            this.clearPreview();

            this.activeShip = 0;
            this.grid = utils.createGrid(10, 10);
        },
        isShipOk: function () {
            this.clearPreview();
        },
        activateNextShip: function () {
            if (this.activeShip < this.fleet.length - 1) {
                this.activeShip += 1;
                return true;
            } else {
                return false;
            }
        },
        renderTries: function (grid) {
            this.tries.forEach(function (row, rid) {
                row.forEach(function (val, col) {
                    var node = grid.querySelector('.row:nth-child(' + (rid + 1) + ') .cell:nth-child(' + (col + 1) + ')');

                    if (val === true) {
                        node.style.backgroundColor = '#e60019';
                    } else if (val === false) {
                        node.style.backgroundColor = '#aeaeae';
                    }
                });
            });
        },
        renderShips: function (grid) {
        }
    };

    global.player = player;

}(this));