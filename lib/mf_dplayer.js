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
        this.mf = 75; // max frame of 50 for now

        this.p = 0;
        this.b = 0;

        this.dr = []; // drawings
        this.bx = []; // boxes

        this.unit = obj.unit || {}; // a unit associated with the animation
        this.onk = obj.onk || function () {};

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
                ani.b = 1 - Math.abs(.5 - ani.p) / .5;

                load[ani.key].ff.call(ani);

                ani.f++;

            });

            // bring out your dead
            i = this.stack.length;
            while (i--) {

                ani = this.stack[i];

                if (ani.f >= ani.mf) {

                    // call on kill method
                    ani.onk();

                    this.stack.splice(i, 1);

                }

            }

        },

        start : function (obj) {

            var ani;

            if (obj.key in load) {

                ani = new ANI(obj);

                load[obj.key].ini.call(ani);

                this.stack.push(ani);

            }

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

        var i = 0,
        s = this;
        while (i < 4) {

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
                i : 3,

                Y : Math.floor(i / 2),
                X : i % 2,
                he : _.r(_.tau)

            });

            i++;
        }

    },

    // for frame method
    ff : function () {

        var s = this,
        x,
        y;

        s.bx.forEach(function (bx, i) {

            bx.a = bx.he;
            bx.x = s.unit.x + bx.X * bx.w + Math.cos(bx.he) * (50 * s.p);
            bx.y = s.unit.y + bx.Y * bx.h + Math.sin(bx.he) * (50 * s.p);
            bx.f = 'rgba(0,255,128,' + (1 - s.p) + ')';
            bx.s = 'rgba(255,255,255,' + (1 - s.p) + ')';

        });

    }
});
