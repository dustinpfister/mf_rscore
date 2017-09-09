
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

        C.drawGrid(pw - vp.x % pw, ph - vp.y % ph, 8, 8, pw, ph);

        // player ships
        rs.ps.units.forEach(function (ship) {

            var obj = _.c(ship),

            pos = vp.makeVPRel(obj);

            obj.x = pos.x;
            obj.y = pos.y;
            obj.f = '#00af88';
            //C.drawInfo([obj.a], 50, 20);
            C.dBX(obj);

        });

        // enemy ships
        rs.es.units.forEach(function (ship) {

            var obj = _.c(ship),

            pos = vp.makeVPRel(obj);

            obj.x = pos.x;
            obj.y = pos.y;
            obj.s = '#000000';
            obj.f = '#af0000';
            C.dBX(obj);

        });

    });

    // draw shots
    C.hiDraw(function (ctx) {

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

        // hell bar
        ctx.fillStyle = '#afafaf';
        ctx.fillRect(220, 10, 200, 20);
        ctx.fillStyle = '#ff0000';
        ctx.fillRect(220, 10, rs.d.hellPer * 200, 20);

        ctx.fillStyle = '#ffffff';
        ctx.textBaseline = 'top';
        ctx.textAlign = 'center';
        ctx.fillText('Hell', 320, 10);

        var obj = rs.ps.units[0];
        if (obj === undefined) {
            obj = {}

        }
        ctx.textAlign = 'left';
        C.drawInfo([

                'e count: ' + rs.es.units.length

            ], 10, 100);
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
