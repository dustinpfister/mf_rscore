/*

This is a hacked over version of mf_vp for mf_game1


 */

var vp = {


    w : 320, // current width and height
    h : 240,

    //x : -160, // upper left corner of the view port
    //y : -120,

    // just make a map relative object view port relative
    makeVPRel : function (obj) {

        return {

            x : obj.x - this.x,
            y : obj.y - this.y,
            w : obj.w,
            h : obj.h

        };

    }

};
