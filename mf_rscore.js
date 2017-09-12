/*
 *
 *   red space core game logic

done:
 * enemy's purged if to far away from the player
 * create a new project called mf_swunits (space war units)
 * create a new project called mf_swai (space war ai)
 * one or more ai scripts that can be used with mf_swunits
 * fixed bug where a shots axis value defaults to -16 when given a value of 0.
 * size of shot taken into account when position a new shot
 * min enemy count that goes up with hellPer
 * death animations
 * maxDelta ship value
 * special abilities

todo:

 * tweak enemy max turn in a way that still gives the player a chance to out turn them
 * 'jump' event (lost mechanic)
 * better ship graphics

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
            //delta : Math.floor(3.5 * api.d.hellPer + .5),
            fireRate : 1000,
            mt : 1 + 9 * api.d.hellPer,
            ai_script : api.d.hellPer < .2 ? swai_smug : swai_stumpy,
            maxHP : 1 + Math.floor(9 * api.d.hellPer),
            maxD : Math.floor(3.5 * api.d.hellPer + .5),
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
        d.hellPer = (d.d - d.safeDist) / d.hellDist;
        //d.hellPer = 1;

        // hell percent rules
        if (d.hellPer < 0) {
            d.hellPer = 0;
        }
        if (d.hellPer > 1) {
            d.hellPer = 1;
        }

        // spawn rate effected by hell percent
        d.spawnRate = Math.floor(10000 - 9000 * d.hellPer);

        // spawn?
        if (new Date() - d.lastSpawn >= d.spawnRate) {

            // spawn roll
            roll = _.r();

            // find min enemy count
            this.me = Math.floor(5 * d.hellPer);

            // if roll is less than hell percent
            if (roll < d.hellPer) {

                eSpawn(pl);

            }

            if (this.es.units.length < this.me) {

                eSpawn(pl);

            }

            this.d.lastSpawn = new Date();

        }

    },

    // check all enemy units
    eCheck = function () {

        // for all enemy's
        rs.es.units.forEach(function (e) {

            // death if player is in safe zone
            if (rs.d.hellPer === 0) {

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

        // new player ship
        NPS : function () {

            rs.ps.addShip({

                delta : 0,
                a : Math.PI * 1.5,
                ai_script : swai_stumpy

            });

        },

        // distance object
        d : {

            safeDist : 1000, // safe distance
            hellDist : 3000, // the distance at witch the game is at max difficulty
            spawnRate : 10000, // how often an enemy spawn might happen
            lastSpawn : new Date()

        },

        // abilities object
        a : {

            sp : 0, // skill points
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

                _.l('player kill: ');
                _.l(e);

                this.sp += e.maxHP;
                this.norm();
                this.fr(); // find options

            },

            // find ready options
            fr : function () {

                this.ready = [];

                for (var prop in this.opt) {

                    if (this.sp >= this.opt[prop].c) {

                        this.ready.push(this.opt[prop].c + ' : ' + this.opt[prop].disp);

                    }

                }

                _.l(this.ready);

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

                        _.l('boost!');
                        pl.boost += 20;

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

                        _.l('heal!');

                        pl.hp += 1;

                    }

                }

            }

        },

        me : 0, // min enemy count
        //sp : 0, // skill points
        ps : {}, // player ship collection
        es : {}, // enemy ship collection

        //        cp : {}, // current planet

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
            this.d.hellDist = 10000;

            // the New Player Ship Collection that will replace playerObj, and pShots
            this.ps = new ShipCollection({
                    faction : 'p',
                    //ai : true,
                    max : 1
                });

            // enemy ships collection
            this.es = new ShipCollection({
                    faction : 'e',
                    ai : true,
                    max : 5
                });

            // set enemy collections for each collection
            this.ps.enemys = this.es;
            this.es.enemys = this.ps;

        },

        tick : function () {

            // player object
            //var obj = this.ps.units[0];


            pl = rs.ps.units[0];

            if (pl === undefined) {

                // player dead
                main.chState('p_die');

            } else {

                distTick.call(this, pl);

                // center viewport over player object
                vp.x = pl.x - vp.w / 2;
                vp.y = pl.y - vp.h / 2;

                kc.s(['W', 'S', 'A', 'D', 'L', '1', '2'], function (keys) {

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

                        pl.a += Math.PI / 20;

                    }

                    // D
                    if (keys[3]) {

                        pl.a -= Math.PI / 20;
                    }

                    // L
                    if (keys[4]) {

                        pl.shoot();

                    }

                    // 1
                    if (keys[5]) {

                        rs.a.buy('b');

                    }

                    // 2
                    if (keys[6]) {

                        rs.a.buy('h');

                    }

                    if (pl.delta > 3) {

                        pl.delta = 3;

                    }

                    if (pl.delta < 0) {

                        pl.delta = 0;

                    }

                });

                pl.step();
                /*
                if (kc.keys[49]) {

                this.ps.ai = true;

                }

                if (kc.keys[50]) {

                this.ps.ai = false;

                }
                 */
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
