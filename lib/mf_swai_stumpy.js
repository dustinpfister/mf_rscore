/*
space war units, smuggler AI.

 */

var swai_stumpy = function (v) {

    var s = this;

    v.delta = 3;

    // no target? try to get one
    if (!v.target) {

        v.findTarget(s.enemys);

    }

    // got a target? yeah
    if (v.target) {

        v.updateTarget();

        // far away? move to the target
        v.followTarget();

        // slow down if close
        if (v.dtt < 50) {

            v.delta = v.dtt / 50 * 3;

            // full stop if very close
            if (v.dtt < 50) {

                v.delta = 0;

            }

        }

        // always shoot for now
        v.shoot();

    }

};
