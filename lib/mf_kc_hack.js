/*
This is a new project that has to do with just keeping and maintaining an array of keyboard
key states. It might become part of my mf_ collection.

 */

var kc = (function () {

    var keys = [],
    lt = new Date(),
    rate = 60;

    window.addEventListener('keydown', function (e) {

        //_.l(e);
        _.l(e.key.charCodeAt(0, 1))

        //keys[e.key.charCodeAt(0, 1)] = true;
        keys[e.keyCode] = true;

    });

    window.addEventListener('keyup', function (e) {

        //keys[e.key.charCodeAt(0, 1)] = false;
        keys[e.keyCode] = false;

    });

    return {

        keys : keys,

        s : function (k, cb) {

            var n = new Date(),
            r = []; // results

            if (n - lt >= rate) {

                lt = n;

                k.forEach(function (c, i) {

                    var d = c.charCodeAt(0, 1);

                    if (keys[d]) {

                        r[i] = (keys[d]);

                    }

                });

            }

            cb(r);
        },

        // get current radian direction (wsad)
        /*
        d : function () {

        var r = 0,
        c = 0;

        if (this.s('W')) {

        r += Math.PI * 1.5;
        c += 1;

        }

        if (this.s('S')) {

        r += Math.PI * .5;
        c += 1;

        }

        if (this.s('A')) {

        r += Math.PI;
        c += 1;

        }

        if (this.s('D')) {

        // two key fix
        if (c === 1 && this.s('W')) {

        r += Math.PI * 2;

        }

        c += 1;

        }

        return String(r / c) === 'NaN' ? -1 : r / c;

        }
         */

    };

}
    ());
