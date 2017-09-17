/*
 *
 *   red space core game logic

0.5.x - New Weapons

 * fillStyle added for player, and fill style changed for enemy's (quick fix for platforms that do not render the ships correctly)



todo:


// app
 * make a title screen
 * more than one game mode such as inverted?
 * hellPercent multipliers (difficulty does not stop at 1, but goes to 2x, 3x, so forth)

// rendering
 * maybe make a new canvas project that makes use of more than one canvas element
 * have a load state and use spreadsheets maybe?
 * batter ship designs

// ships
 * more than one enemy ship type
 * level property

// ship AI
 * revisit swai_sidewind ai script and make it more true to its name

// ship weapons
 * Weapon Objects
 * More than one Weapon in the game

// animations
 * cool start game animation state
 * define an animation for shots
 * cooler animation for player death
 * new animations for enemy deaths

// sound
 * some classic sounding pew pew effects
 * cool music deal when the game starts

 */

var rs = (function () {

    //var x = 0,
    //y = 0,

    var pl,

    // enemy spawn
    eSpawn = function () {

        var r = _.r(pl.a - .5, pl.a + .5);

        // spawn an enemy
        api.es.addShip({

            x : Math.cos(r) * 500 + pl.x,
            y : Math.sin(r) * 500 + pl.y,
            //delta : Math.floor(3.5 * api.d.p + .5),
            fr : 1000 - 900 * api.d.p,
            mt : 1 + 9 * api.d.p,
            ai_script : swai_side, //swai_stumpy, //api.d.p < .2 ? swai_smug : swai_stumpy,
            maxHP : 1 + Math.floor(9 * api.d.p),
            maxD : Math.floor(3.5 * api.d.p + .5),
            onk : function () {

                // start death animation
                dp.start({

                    key : 'pl_d',
                    unit : {

                        x : this.x,
                        y : this.y

                    }

                });

                // if killed by the player
                if (this.killedBy) {

                    rs.a.kill(this);
                    rs.score += this.maxHP * 100;

                }

            }

        });
    },

    // update all things distance.
    distTick = function (obj) {

        var roll,
        d = this.d,
        r,
        per;

        // update distance
        d.d = _.d(0, 0, pl.x + pl.w / 2, pl.y + pl.w / 2);

        // find hell percent
        d.p = (d.d - d.sd) / d.hd;
        //d.p = 1;

        // hell percent rules
        if (d.p < 0) {
            d.p = 0;
        }
        if (d.p > 1) {
            d.p = 1;
        }

        // spawn rate effected by hell percent
        d.spawnRate = Math.floor(10000 - 9000 * d.p);

        // spawn?
        if (new Date() - d.lastSpawn >= d.spawnRate) {

            // spawn roll
            roll = _.r();

            // find min enemy count
            this.me = Math.floor(4 * d.p) + 1;

            // if roll is less than hell percent
            if (roll < d.p) {

                eSpawn(pl);

            }

            if (this.es.units.length < this.me) {

                eSpawn(pl);

            }

            this.d.lastSpawn = new Date();

        }

        // restore to half health restored if in safe zone
        if (this.d.d < this.d.sd && pl.hp < pl.maxHP / 2) {

            pl.hp = pl.maxHP / 2;

        }

    },

    // check all enemy units
    eCheck = function () {

        // for all enemy's
        rs.es.units.forEach(function (e) {

            // death if player is in safe zone
            if (rs.d.p === 0) {

                e.hp = 0;
            }

            // death if far away
            if (e.dtt > 1250) {

                e.hp = 0;

            }

        });

    };

    // public api
    api = {

        score : 0,

        // new player ship
        NPS : function () {

            rs.ps.addShip({
                //yaw : -1
                delta : 0,
                mt : 10,
                //fr : 30,
                a : _.pi * 1.5,
                ai_script : swai_side,
                weapon : {

                    fr : 60,
                    shotDelta : 6,
                    shotCount : 1,
                    shotDist : (function () {

                        var d = 0,
                        b = true;

                        return function (i, sh) {

                            d += b ? -4 : 4;

                            if (d == -16 || d == 16) {

                                b = !b;

                            }

                            return sh.a + _.pi / 180 * d;

                        };

                    }
                        ())

                }

            });

            // start off with 50
            api.a.sp = 50;
            api.a.fr();

        },

        // distance object
        d : {

            // p (hell percent)
            sd : 1000, // safe distance
            hd : 3000, // the distance at witch the game is at max difficulty
            spawnRate : 10000, // how often an enemy spawn might happen
            lastSpawn : new Date()

        },

        // abilities object
        a : {

            sp : 50, // skill points
            msp : 100, // max skill points
            cd : 500, // cool down in ms
            lt : new Date(),
            ready : [], // list of ready options

            // normalize skill points
            norm : function () {

                if (this.sp > this.msp) {

                    this.sp = this.msp;

                }

            },

            // player killed the given enemy
            kill : function (e) {

                this.sp += e.maxHP;
                this.norm();
                this.fr(); // find options

            },

            // find ready options
            fr : function () {

                var a,
                i = 1;

                this.ready = [];

                for (var prop in this.opt) {

                    a = this.opt[prop];

                    if (this.sp >= a.c) {

                        this.ready.push(i + ' : ' + a.disp + ' (' + a.c + 'sp)');

                    }

                    i++;

                }

            },

            // buy a power up with the given key
            buy : function (key) {

                var p = this.opt[key],
                now = new Date();

                if (now - this.lt >= this.cd) {

                    if (this.sp >= p.c && p.con()) {

                        this.sp -= p.c;
                        p.onuse();

                    }

                    this.lt = now;
                    this.fr(); // find options

                }

            },

            // options
            opt : {

                // speed up
                b : {

                    c : 1,
                    disp : 'boost',
                    con : function () {
                        return true;
                    },
                    onuse : function () {

                        pl.boost += 30;

                    }

                },

                h : {

                    c : 5,
                    disp : 'heal',
                    con : function () {

                        if (pl.hp < pl.maxHP) {

                            return true;

                        }

                        return false;

                    },
                    onuse : function () {

                        pl.hp += 1;

                    }

                },

                w : {

                    c : 25,
                    disp : 'weapon',
                    con : function () {

                        if (pl.fr > 100) {

                            return true;

                        }

                        return false;

                    },
                    onuse : function () {

                        // fire rate reduced
                        pl.fr /= 1.5;

                    }

                }

            }

        },

        me : 0, // min enemy count
        ps : {}, // player ship collection
        es : {}, // enemy ship collection

        // set things up
        init : function () {

            // view port
            vp.w = 640;
            vp.h = 480;

            // canvas
            C.canvas.width = 640;
            C.canvas.height = 480;
            C.cls();

            // set hell dist
            this.d.hd = 10000;

            // the New Player Ship Collection that will replace playerObj, and pShots
            this.ps = new ShipCollection({
                    faction : 'p',
                    max : 1
                });

            // enemy ships collection
            this.es = new ShipCollection({
                    faction : 'e',
                    ai : true,
                    max : 12
                });

            // set enemy collections for each collection
            this.ps.enemys = this.es;
            this.es.enemys = this.ps;

            api.a.fr();

        },

        tick : function () {

            // player object
            //var obj = this.ps.units[0];


            pl = rs.ps.units[0];

            if (pl === undefined) {

                // player dead
                main.chState('p_die');

            } else {

                //pl.yaw = 0;
                kc.s(['W', 'S', 'A', 'D', 'J', 'K', 'L', '1', '2', '3'], function (keys) {

                    // W
                    if (keys[0]) {

                        pl.delta += .1;

                    }

                    // S
                    if (keys[1]) {

                        pl.delta -= .1;
                    }

                    // A
                    if (keys[2]) {

                        pl.a += pl.mt; //_.pi / 180 * 10;

                    }

                    // D
                    if (keys[3]) {

                        pl.a -= pl.mt; //_.pi / 180 * 10;
                    }

                    //J
                    if (keys[4]) {

                        //pl.shoot();
                        pl.yaw += .5;
                    }

                    // K
                    if (keys[5]) {

                        pl.shoot();

                    }

                    // L
                    if (keys[6]) {

                        //pl.shoot();
                        pl.yaw -= .5;

                    }

                    // 1
                    if (keys[7]) {

                        rs.a.buy('b');

                    }

                    // 2
                    if (keys[8]) {

                        rs.a.buy('h');

                    }

                    // 3
                    if (keys[9]) {

                        rs.a.buy('w');

                    }

                    if (pl.delta > 3) {

                        pl.delta = 3;

                    }

                    if (pl.delta < 0) {

                        pl.delta = 0;

                    }

                });

                distTick.call(this, pl);

                // center viewport over player object
                vp.x = pl.x - vp.w / 2;
                vp.y = pl.y - vp.h / 2;

                pl.step();

                // run enemy checks
                eCheck();

                this.es.update();
                this.ps.update();

                dp.tick();

            }

        }

    };

    return api;

}
    ());
