
var basicShip = function (obj, ctx) {

    ctx.save();
    ctx.translate(obj.x + obj.hw, obj.y + obj.hh);
    ctx.rotate(obj.a);

    ctx.beginPath();
    ctx.moveTo(-10, 0);
    ctx.lineTo(-25, -18);
    ctx.lineTo(20, 0);
    ctx.lineTo(-25, 18);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.restore();

},

drawHome = function (ctx) {

    var pos = vp.makeVPRel({
            x : 0,
            y : 0
        });

    ctx.fillStyle = '#0000ff';
    ctx.beginPath();

    ctx.arc(pos.x, pos.y, rs.d.safeDist, 0, _.tau);
    ctx.fill();

}

// draw method
var rscore_canvas = function () {

    var x,
    obj,
    y,
    w,
    h;

    C.cls('rgba(' + Math.floor(255 * rs.d.hellPer) + ',0,0,1)');

    // draw ships
    C.hiDraw(function (ctx) {

        var pw = 640 / 8,
        ph = 480 / 8;

        drawHome(ctx);
        C.drawGrid(pw - vp.x % pw, ph - vp.y % ph, 8, 8, pw, ph);

        // player ships
        rs.ps.units.forEach(function (ship) {

            var obj = _.c(ship),

            pos = vp.makeVPRel(obj);

            obj.x = pos.x;
            obj.y = pos.y;
            //C.dBX(obj);

            ctx.strokeStyle = '#00ffff';
            basicShip(obj, ctx);

        });

        // enemy ships
        rs.es.units.forEach(function (ship) {

            var obj = _.c(ship),

            pos = vp.makeVPRel(obj);

            obj.x = pos.x;
            obj.y = pos.y;

            //C.dBX(obj);
            ctx.strokeStyle = '#ff0000';
            ctx.fillStyle = '#000000';
            basicShip(obj, ctx);

        });

        //});

        // draw shots
        //C.hiDraw(function (ctx) {

        // player shots
        rs.ps.shots.units.forEach(function (sh) {

            var obj = vp.makeVPRel(sh);

            ctx.fillStyle = '#00afff';
            ctx.fillRect(obj.x, obj.y, obj.w, obj.h);

        });

        // enemy shots
        rs.es.shots.units.forEach(function (sh) {

            var obj = vp.makeVPRel(sh);

            ctx.fillStyle = '#ffffff';
            ctx.fillRect(obj.x, obj.y, obj.w, obj.h);

        });

        // RED bar
        ctx.fillStyle = '#afafaf';
        ctx.fillRect(220, 10, 200, 20);
        ctx.fillStyle = '#ff0000';
        ctx.fillRect(220, 10, rs.d.hellPer * 200, 20);

        ctx.fillStyle = '#ffffff';
        ctx.textBaseline = 'top';
        ctx.textAlign = 'center';
        ctx.fillText('RED', 320, 10);

        var obj = rs.ps.units[0];
        if (obj === undefined) {
            obj = {}

        }
        ctx.textAlign = 'left';
        C.drawInfo([

                'hp: ' + (obj.hp ? obj.hp + '/' + obj.maxHP : 'dead')
                //'skill points: ' + rs.a.sp

            ].concat(rs.a.ready), 10, 10, 20, '20px courier', '#00ff00');

        C.drawInfo([

                'skill points: ' + rs.a.sp

            ], 450, 20, 15, '15px courier', '#00ff00');

        dp.stack.forEach(function (ani) {

            ani.bx.forEach(function (bx) {

                var obj = _.c(bx),

                pos = vp.makeVPRel(obj);

                obj.x = pos.x;
                obj.y = pos.y;
                C.dBX(obj);

            });

        });
        /*
        ctx.textAlign = 'left';
        C.drawInfo([

        'D : ' + rs.d.d.toFixed(2),
        'map pos: ' + vp.x + ',' + vp.y,
        'player hp: ' + obj.hp + '/' + obj.maxHP,
        'hellDist: ' + rs.d.hellDist,
        'hellPer: ' + rs.d.hellPer,
        'nextSpawn: ' + (rs.d.spawnRate - (new Date() - rs.d.lastSpawn)),
        'spawnRate: ' + rs.d.spawnRate

        ], 10, 100);
         */

    });

};
