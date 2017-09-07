/*
space war units, smuggler AI.

 */

var swai_smug = function (v) {

    var s = this;

    v.delta = 1;

    // no target? try to get one
    if (!v.target) {

        v.findTarget(s.enemys);

    }

    // got a target? yeah
    if (v.target) {

        v.updateTarget();

        // far away? move to the target
        v.followTarget();

        // safe
        if (v.dtt > 1000) {

            v.delta = 0;

        }

        // always shoot for now
        //v.shoot();

    }

};
