/*jslint browser this */
/*global _, player */

(function (global) {
    "use strict";

    var computer = _.assign({}, player, {
        grid: [],
        tries: [],
        fleet: [],
        game: null,
        ship: null,
        lastHit: [],
        play: function () {
            if(this.game.difficulty == 0){
                var self = this;
                let x = Math.floor(Math.random() * 10);
                let y = Math.floor(Math.random() * 10);
                setTimeout(function () {
                    self.game.fire(this, x, y, function (hasSucced) {
                        self.tries[x][y] = hasSucced;
                    });
                    
                }, 2000);
            }else if(this.game.difficulty == 1){
                console.log(this.lastHit);
                if(this.lastHit[3] == null){
                    this.lastHit[3] = false;
                }
                if(this.lastHit[4] == null){
                    this.lastHit[4] = 0;
                }
                if(this.lastHit[4] == 5 || this.lastHit[4] > 1 && this.lastHit[5] == "checked" && this.lastHit[6] == "checked"){
                    this.lastHit = [];
                    this.lastHit[0] = null;
                    this.lastHit[1] = null;
                    this.lastHit[2] = null;
                    this.lastHit[4] = 0;
                    this.lastHit[5] = null;
                    this.lastHit[6] = null;

                    this.lastHit[3] = false;
                }else if(this.lastHit[4] == 5 || this.lastHit[4] == 1 && this.lastHit[5] == "checked" && this.lastHit[6] == "checked"){
                    this.lastHit[5] = null
                    this.lastHit[6] = null
                    this.lastHit[4] = 0;
                    this.lastHit[3] = true
                }
                if(this.lastHit[0] == null){
                    
                    var self = this;
                    
                    var x = Math.floor(Math.random() * 10);
                    var y = Math.floor(Math.random() * 10);
                setTimeout(function () {
                    self.game.fire(this, x, y, function (hasSucced) {
                        self.tries[y][y] = hasSucced;
                        if(hasSucced == true){
                            self.lastHit[0] = x;
                            self.lastHit[1] = y;
                            self.lastHit[4] +=1;
                        }
                       
                    });
                }, 2000);
                }else if(this.lastHit[2] == null){
                    
                    var self = this;
                    if(self.lastHit[0] > 0){
                        var x = self.lastHit[0] - 1;
                        var y = self.lastHit[1]
                        self.lastHit[2] = "left";
                    }else if(self.lastHit[0] < 9){
                        var x = self.lastHit[0] + 1;
                        var y = self.lastHit[1]
                        self.lastHit[2] = "right";
                    }else if(self.lastHit[1] > 0){
                        var y = self.lastHit[1] - 1
                        var x = self.lastHit[0]
                        self.lastHit[2] = "up";
                    }else if(self.lastHit[1] < 9){
                        var y = self.lastHit[1] + 1
                        var x = self.lastHit[0]
                        self.lastHit[2] = "down";
                    }
                    setTimeout(function () {
                        self.game.fire(this, x, y, function (hasSucced) {
                            self.tries[x][y] = hasSucced;
                            if(hasSucced == true){
                                self.lastHit[0] = x;
                                self.lastHit[1] = y;
                                self.lastHit[3] = true;
                                self.lastHit[4] +=1;
                            }
                           
                        });
                    }, 2000);
                }else if(this.lastHit[2] == "left"){
                  
                    var self = this;
                    var y = this.lastHit[1];
                    if(this.lastHit[0] > 0 && this.lastHit[3] == true){
                        var x = this.lastHit[0] - 1;
                    }else{
                        var x = this.lastHit[0] + this.lastHit[4];
                        self.lastHit[5] = "checked"
                        self.lastHit[2] = "right";
                    }
                    setTimeout(function () {
                        self.game.fire(this, x, y, function (hasSucced) {
                            self.tries[x][y] = hasSucced;
                            if(hasSucced == true){
                                self.lastHit[0] = x;
                                self.lastHit[1] = y;
                                self.lastHit[3] = true;
                                self.lastHit[4] +=1;
                            }else{
                                self.lastHit[3] = false
                                
                            }
                          
                        });
                    }, 2000);
                }else if(this.lastHit[2] == "right"){
                 
                    var self = this;
                    var y = this.lastHit[1];
                    var x = this.lastHit[0];
                    if(this.lastHit[0] < 9 && this.lastHit[3] == true){
                        var x = this.lastHit[0] + 1;
                    }else{
                        self.lastHit[2] = "up"
                        self.lastHit[6] = "checked"
                    }
                        setTimeout(function () {
                            self.game.fire(this, x, y, function (hasSucced) {
                                self.tries[x][y] = hasSucced;
                                if(hasSucced == true){
                                    self.lastHit[0] = x;
                                    self.lastHit[1] = y;
                                    self.lastHit[3] = true;
                                    self.lastHit[4] +=1;
                                }
                                
                            });
                        }, 2000);
                    
                }else if(this.lastHit[2] == "up"){
                  
                    var self = this;
                    var x = this.lastHit[0];
                    if(this.lastHit[1] > 0 && this.lastHit[3] == true){
                        var y = this.lastHit[1] - 1;
                    }else{
                        var y = this.lastHit[1] + 1 + this.lastHit[4];
                        self.lastHit[5] = "checked"
                        self.lastHit[2] = "down";
                    }
                    setTimeout(function () {
                        self.game.fire(this, x, y, function (hasSucced) {
                            self.tries[x][y] = hasSucced;
                            if(hasSucced == true){
                                self.lastHit[0] = x;
                                self.lastHit[1] = y;
                                self.lastHit[3] = true;
                                self.lastHit[4] +=1;
                            }else{
                                self.lastHit[3] = false
                                
                            }
                          
                        });
                    }, 2000);
                }else if(this.lastHit[2] == "down"){
                 
                    var self = this;
                    var y = this.lastHit[1];
                    var x = this.lastHit[0];
                    if(this.lastHit[0] < 9 && this.lastHit[3] == true){
                        var y = this.lastHit[1] + 1;
                    }else{
                        self.lastHit[2] = "up"
                        self.lastHit[6] = "checked"
                    }
                        setTimeout(function () {
                            self.game.fire(this, x, y, function (hasSucced) {
                                self.tries[x][y] = hasSucced;
                                if(hasSucced == true){
                                    self.lastHit[0] = x;
                                    self.lastHit[1] = y;
                                    self.lastHit[3] = true;
                                    self.lastHit[4] +=1;
                                }else{
                                    self.lastHit[3] = false
                                   
                                }
                                
                            });
                        }, 2000);
                    
                }
                }
                
        },
        setGame: function (game) {
            this.game = game;
        },
        isShipOk: function (callback, number = 0) {
            var ship = this.fleet[number];
            if(ship == undefined){
                return
            }
            let k = 0;
                var CompOris =  Math.random();
                if(CompOris < 0.5){
                    var i = Math.floor(Math.random() * 10);
                    var j = Math.floor(Math.random() * 6);
                
                    if(this.grid[i][j] != 0 || this.grid[i][j + 1] != 0 || this.grid[i][j + 2] != 0 || this.grid[i][j + 3] != 0){
                        this.isShipOk(callback, number);
                        return null;
                    }else{
                        while (k < ship.life) {
                        this.grid[i][j] = ship.getId();
                        k += 1;
                        j += 1;

                    }
                }
            if(number < 3){
                this.isShipOk(callback, number + 1);
                
            }else{
                setTimeout(function () {
                    callback();
                }, 500);

            }
            
        }else{
            var i = Math.floor(Math.random() * 6);
                    var j = Math.floor(Math.random() * 10);
                    if(this.grid[i][j] != 0 || this.grid[i + 1][j] != 0 || this.grid[i + 2][j] != 0 || this.grid[i + 3][j] != 0){
                        this.isShipOk(callback, number);
                        return null;
                    }else{
                        while (k < ship.life) {
                            this.grid[i][j] = ship.getId();
                            k += 1;
                            i += 1;      
                        }

                    }
        if(number < 3){
            this.isShipOk(callback, number + 1);
            
        }else{
            setTimeout(function () {
                callback();
            }, 500);

        }
        }

        }
    });

    global.computer = computer;

}(this));