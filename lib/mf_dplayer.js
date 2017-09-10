/*
mf_dplayer.js
a deterministic animation player

 */

var dp = (function () {

    // current load of animations
    var load = {},

    // animation instance constructor
    ANI = function (obj) {

        // must know the animation
        this.key = obj.key;

        this.f = 0; // start at frame 0
        this.mf = 50; // max frame of 50 for now

        this.p = 0;
        this.b = 0;

        this.dr = []; // drawings
        this.bx = []; // boxes

        this.unit = obj.unit || {}; // a unit associated with the animation

    };

    return {

        // current stack of animations
        stack : [],

        // what to do on each tick
        tick : function () {

            var ani,
            i;

            // update animations
            this.stack.forEach(function (ani) {

                ani.p = ani.f / ani.mf;
                ani.b = 1-Math.abs(.5 - ani.p) / .5;

                load[ani.key].ff.call(ani);

                ani.f++;

            });

            // bring out your dead
            i = this.stack.length;
            while (i--) {

                ani = this.stack[i];

                if (ani.f >= ani.mf) {

                    this.stack.splice(i, 1);

                }

            }

        },

        start : function (obj) {

            var ani;

            if (obj.key in load) {

                ani = new ANI(obj);

                load[obj.key].ini.call(ani)

                this.stack.push(ani);

            }

            _.l(this.stack);

        },

        // define an animation
        def : function (aniObj) {

            // just ref it in for now
            load[aniObj.key] = aniObj;

        }

    };

}
    ());

dp.def({

    key : 'pl_d', // player death

    ini : function () {

        this.bx.push({

            // standard box values
            x : 0,
            y : 0,
            a : 0,
            w : 16,
            h : 16,
            hw : 8,
            hh : 8,
            s : '#ffffff',
            f : '#00ffff',
            i : 3

        });

    },

    // for frame method
    ff : function () {

        var s = this;

        s.bx.forEach(function (bx,i) {

            bx.x = 100 * s.p;

        });

    }
});
