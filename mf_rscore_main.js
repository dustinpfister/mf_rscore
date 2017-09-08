
loop = function () {

    requestAnimationFrame(loop);

    rs.tick();

    rscore_canvas();

};

rs.init();
loop();
