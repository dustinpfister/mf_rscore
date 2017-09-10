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

todo:

 * tweak enemy max turn in a way that still gives the player a chance to out turn them

 * special abilities
 * 'jump' event (lost mechanic)
 * death animations
 * better ship graphics
 * maxDelta ship value

 */

var rs = (function () {

    var x = 0,
    y = 0,

    // enemy spawn
    eSpawn = function (obj) {

        var r = _.r(obj.a - .5, obj.a + .5);

        // spawn an enemy
        api.es.addShip({

            x : Math.cos(r) * 500 + obj.x,
            y : Math.sin(r) * 500 + obj.y,
            //delta : Math.floor(3.5 * api.d.hellPer + .5),
            fireRate : 1000,
            mt : 1 + 9 * api.d.hellPer,
            ai_script : api.d.hellPer < .2 ? swai_smug : swai_stumpy,
            maxHP : 1 + Math.floor(9 * api.d.hellPer),
            maxD : Math.floor(3.5 * api.d.hellPer + .5),
            onk : function () {

			    _.l('killed enemy')
			
                dp.start({

                    key : 'pl_d',
                    unit : {

                        x : this.x,
                        y : this.y

                    }

                });

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
        d.d = _.d(0, 0, obj.x + obj.w / 2, obj.y + obj.w / 2);

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

                eSpawn(obj);

            }

            if (this.es.units.length < this.me) {

                eSpawn(obj);

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

    /*
    // new player ship
    NPS = function () {

    rs.ps.addShip({

    delta : 0,
    a : Math.PI * 1.5,

    });

    };
     */

    api = {

        NPS : function () {

            rs.ps.addShip({

                delta : 0,
                a : Math.PI * 1.5,

            });

        },

        d : {

            safeDist : 1000, // safe distance
            hellDist : 3000, // the distance at witch the game is at max difficulty
            spawnRate : 10000, // how often an enemy spawn might happen
            lastSpawn : new Date()

        }, // the current distance data
        me : 0, // min enemy count
        ps : {},
        es : {},
        cp : {}, // current planet

        init : function () {

            _.l('rw-core: init...');

            // view port
            vp.w = 640;
            vp.h = 480;

            // canvas
            C.canvas.width = 640;
            C.canvas.height = 480;
            C.cls();

            // set hell dist based on sections

            this.d.hellDist = 10000;

            // the New Player Ship Collection that will replace playerObj, and pShots
            this.ps = new ShipCollection({
                    faction : 'p',
                    //ai : true,
                    max : 1
                });

            // add the single player ship
            //this.ps.addShip();

            //this.NPS();

            // enemy ships collection
            this.es = new ShipCollection({
                    faction : 'e',
                    ai : true,
                    max : 5
                });

            // set enemy collections for each collection
            this.ps.enemys = this.es;
            this.es.enemys = this.ps;
            /*
            // spawn an enemy
            this.es.addShip({

            x : this.ps.units[0].x + 200,
            y : this.ps.units[0].y,
            a : Math.PI * .5,
            delta : 0,
            fireRate : 1000,
            mt : 2,
            ai_script : swai_smug

            });
             */
            /*
            dp.start({

            key : 'pl_d',
            unit : this.ps.units[0]

            });
             */
        },

        tick : function () {

            // player object
            var obj = this.ps.units[0];

            if (obj === undefined) {

                _.l('player dead');

                // add the single player ship
                //this.ps.addShip();
                //NPS();

                main.chState('p_die');

                /*
                dp.start({

                key : 'pl_d',
                unit : {

                x : vp.x,
                y : vp.y

                }

                });
                 */

            } else {

                distTick.call(this, obj);

                // center viewport over player object
                vp.x = obj.x - vp.w / 2;
                vp.y = obj.y - vp.h / 2;

                kc.s(['W', 'S', 'A', 'D', 'L'], function (keys) {

                    // W
                    if (keys[0]) {

                        obj.delta += .1;

                    }

                    // S
                    if (keys[1]) {

                        obj.delta -= .1;
                    }

                    // A
                    if (keys[2]) {

                        _.l(obj.maxTurn);
                        obj.a += Math.PI / 20;

                    }

                    // D
                    if (keys[3]) {

                        obj.a -= Math.PI / 20;
                    }

                    // ;
                    if (keys[4]) {

                        obj.shoot();

                    }

                    if (obj.delta > 3) {

                        obj.delta = 3;

                    }

                    if (obj.delta < 0) {

                        obj.delta = 0;

                    }

                });

                obj.step();

                if (kc.keys[49]) {

                    this.ps.ai = true;

                }

                if (kc.keys[50]) {

                    this.ps.ai = false;

                }

                // run enemy checks
                eCheck();

                this.ps.update();
                this.es.update();

				dp.tick();
				
            }

        }

    };

    return api;

}
    ());
