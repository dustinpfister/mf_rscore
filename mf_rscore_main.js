
var main = (function () {

    var cs = 'newgame',

    api = {

        chState : function (state) {

            cs = state;

        },

        start : function () {

            loop();
        }

    },

    states = {

        p_die : function () {

            dp.start({

                key : 'pl_d',
                unit : {

                    x : vp.x + vp.w / 2,
                    y : vp.y + vp.h / 2

                },
                onk : function () {

                    main.chState('newgame');

                }

            });

            main.chState('p_die_ani');

        },

        p_die_ani : function () {

            _.l('ani tick');

            dp.tick();

            rscore_canvas();

        },

        newgame : function () {

            // new player ship
            rs.NPS();
            main.chState('game');

        },

        game : function () {

            rs.tick();

            rscore_canvas();
        }

    },

    loop = function () {

        requestAnimationFrame(loop);

        //rs.tick();
        states[cs]();

    };

    rs.init();

    return api;

}
    ());

main.start();
