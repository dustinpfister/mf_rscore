/*

changes from 0.1.2

 * fixed rotation problem with C.dBx
 * commented out unused code for mf_rscore
 * added a draw grid method

 */
var C = (function () {

    var canvas = document.createElement('canvas'),
    ctx = canvas.getContext('2d');

    canvas.width = 320;
    canvas.height = 240;

    document.body.appendChild(canvas);

    // api
    return {

        // ref to canvas if needed
        canvas : canvas,

        cls : function (style) {

            ctx.fillStyle = style || '#000000';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

        },

        hiDraw : function (draw) {

            draw.call(this, ctx, canvas)

        },

        drawGrid : function (offX, offY, w, h, pw, ph) {

            w = w || 8;
            h = h || 8;
            pw = pw || 32;
            ph = ph || 32;
            offX = offX || 0;
            offY = offY || 0;

            ctx.strokeStyle = 'rgba(255,255,255,.2)';
            ctx.lineWidth = 3;

            var y = -ph * 2,
            x;
            while (y < h * ph) {

                x = -pw * 2;
                while (x < w * pw) {

                    ctx.strokeRect(x + offX, y + offY, pw, ph);

                    x += pw;

                }

                y += ph;

            }

        },

        drawInfo : function (messArray, x, y, dy, font, style) {

            x = x || 10;
            y = y || 10;
            dy = dy || 15;
            font = font || '15px courier';
            style = style || '#ffffff';

            ctx.fillStyle = style;
            ctx.font = font;
            messArray.forEach(function (mess, i) {

                ctx.fillText(mess, x, y + dy * i);

            });

        },
        /*
        // draw debug overay for a 'standard_box'
        dBX_debug : function (obj) {

        ctx.save();
        ctx.translate(obj.x, obj.y);
        ctx.rotate(obj.a);

        ctx.strokeStyle = '#ffff00';
        ctx.beginPath();
        ctx.arc(-obj.hw, -obj.hh, 5, 0, Math.PI * 2);
        ctx.closePath();
        ctx.stroke();

        ctx.strokeStyle = '#00ff00';
        ctx.beginPath();
        ctx.arc(0, 0, 5, 0, Math.PI * 2);
        ctx.closePath();
        ctx.stroke();

        ctx.restore();

        this.drawInfo([

        'box info: ',
        'x,y : ' + Math.floor(obj.x) + ',' + Math.floor(obj.y),
        'w,h : ' + obj.w + ',' + obj.h,
        'a : ' + obj.a.toFixed(2)

        ], obj.x - obj.hw, obj.y - obj.hh);

        },
         */
        // draw an 'standard_box'
        dBX : function (obj) {

            ctx.fillStyle = obj.f;
            ctx.strokeStyle = obj.s;
            ctx.lineWidth = obj.i;

            ctx.save();

            //if (cr) {

            // draw center relative
            //    ctx.translate(obj.x, obj.y);

            //} else {

            ctx.translate(obj.x + obj.hw, obj.y + obj.hh);

            //}

            ctx.rotate(obj.a);

            ctx.fillRect(-obj.hw, -obj.hh, obj.w, obj.h);
            ctx.strokeRect(-obj.hw, -obj.hh, obj.w, obj.h);

            ctx.restore();
            /*
            if (debug) {

            this.dBX_debug(obj);

            }
             */
        },

        // draw standard drawing
        dDr : function (obj) {

            ctx.fillStyle = obj.f;
            ctx.strokeStyle = obj.s;
            ctx.lineWidth = obj.i;

            ctx.save();
            ctx.translate(obj.x, obj.y);
            ctx.rotate(obj.a);

            var i = 2,
            l = obj.p.length;
            ctx.beginPath();
            ctx.moveTo(obj.p[0], obj.p[1]);
            while (i < l) {

                ctx.lineTo(obj.p[i], obj.p[i + 1]);

                i += 2;
            };

            if (obj.c) {

                ctx.closePath();

            }

            ctx.stroke();

            if (obj.l) {
                ctx.fill();
            }

            ctx.restore();

        }
/*
        boxRel : function (e) {

            var points = [],
            bx = e.target.getBoundingClientRect();

            // if touch event
            if (e.touches) {

                [].forEach.call(e.touches, function (touch) {

                    points.push({

                        x : touch.clientX - bx.left,
                        y : touch.clientY - bx.top

                    });

                });

            } else {

                // else assume mouse

                points = [{

                        x : e.clientX - bx.left,
                        y : e.clientY - bx.top

                    }
                ];

            }

            return points;

        }
*/
    };

}
    ());

C.cls();
