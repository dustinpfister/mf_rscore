var jsmin = require('jsmin').jsmin,
fs = require('fs');

var files = [
    'lib/mf_shell_0_3_2',
    'lib/mf_kc_hack',
    'lib/mf_canvas_hack',
    'lib/mf_vp_hack',
    'lib/mf_swunits',
    //'lib/mf_swai_smug',
    //'lib/mf_swai_stumpy',
    'lib/mf_swai_sidewind',
    'lib/mf_dplayer',
    'mf_rscore',
    'mf_rscore_canvas',
    'mf_rscore_main'
],
minname = '../game.js',
buildFile = '',
i = 0;

var build = function () {

    if (i < files.length) {

        fs.readFile('../' + files[i] + '.js', 'utf8', function (e, data) {

            buildFile += jsmin(data, 3);

            i += 1;

            build();

        });

    } else {

        console.log(buildFile);

        fs.writeFile(minname, buildFile, 'utf8', function (e) {

            if (e) {

                console.log('error');
                console.log(e);

            } else {

                console.log('build file done');

            }

        });

    }

};

build();
