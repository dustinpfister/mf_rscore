/*
 *
 *   red space core game logic

todo:

 * tweek enemy max turn in a way that still gives the player a chance to out turn them
 * enemy's purged if to far away from the player
 * create a new project called mf_swunits (space war units)
 * create a new project called mf_swai (space war ai)
 * one or more ai scripts that can be used with mf_swunits


 */

var rs = (function () {

    var x = 0,
    y = 0;

    // update all things distance.
    var distTick = function (obj) {

        var roll,
        d = this.d,
        per;

        // update distance
        d.d = _.d(0, 0, obj.x + obj.w / 2, obj.y + obj.w / 2);

        // find hell percent
        d.hellPer = (d.d - d.safeDist) / d.hellDist;

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

            // if roll is less than hell percent
            if (roll < d.hellPer) {

                // spawn an enemy
                this.es.addShip({

                    x : this.ps.units[0].x + 200,
                    y : this.ps.units[0].y,
                    delta : Math.floor(3.5 * d.hellPer + .5),
                    fireRate : 1000,
                    mt : 1 + 9 * d.hellPer,
                    ai_script : swai_stumpy

                });

            }

            this.d.lastSpawn = new Date();

        }

    };

    api = {

        d : {

            safeDist : 1000, // safe distance
            hellDist : 3000, // the distance at witch the game is at max difficulty
            spawnRate : 10000, // how often an enemy spawn might happen
            lastSpawn : new Date()

        }, // the current distance data
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
            this.ps.addShip();

            // enemy ships collection
            this.es = new ShipCollection({
                    faction : 'e',
                    ai : true,
                    max : 5
                });

            // set enemy collections for each collection
            this.ps.enemys = this.es;
            this.es.enemys = this.ps;

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

        },

        tick : function () {

            // player object
            var obj = this.ps.units[0];

            if (obj === undefined) {

                _.l('player dead');

                // add the single player ship
                this.ps.addShip();

            } else {

                distTick.call(this, obj);

                var d = kc.d();

                if (d >= 0) {

                    // new _.asd method works great
                    if (_.asd(obj.a, d) == -1) {

                        obj.a -= Math.PI / 100;

                    } else {

                        obj.a += Math.PI / 100;
                    }

                    obj.step();
                }

                //vp.lookAt(x, y);

                vp.x = obj.x - vp.w / 2;
                vp.y = obj.y - vp.h / 2;

                //S.ls(vp.x, vp.y, vp.w, vp.h);

                // fire shots
                if (kc.keys[186]) {

                    obj.shoot();

                }

                if (kc.keys[49]) {

                    this.ps.ai = true;

                }

                if (kc.keys[50]) {

                    this.ps.ai = false;

                }


                this.ps.update();
                this.es.update();

            }

        }

    };

    return api;

}
    ());
