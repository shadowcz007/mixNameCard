function getWordcloud(_width,_color,cb) {
    var love = {
        list: (function generateLoveList() {
            var list = ['12 Love'];
            var nums = [8, 7, 6, 5, 3];
            // This list of the word "Love" in language of the world was taken from
            // the Language links of entry "Love" in English Wikipedia, with duplicate
            // spelling removed.
            var words = (
                'Liebe,ፍቅር,Lufu,حب,Aimor,Amor,Heyran,ভালোবাসা,Каханне,Любоў,Любов,བརྩེ་དུང་།,' +
                'Ljubav,Karantez,Юрату,Láska,Amore,Cariad,Kærlighed,Armastus,Αγάπη,Amo,Amol,Maitasun,' +
                'عشق,Pyar,Amour,Leafde,Gràdh,愛,爱,પ્રેમ,사랑,Սեր,Ihunanya,Cinta,ᑕᑯᑦᓱᒍᓱᑉᐳᖅ,Ást,אהבה,' +
                'ಪ್ರೀತಿ,სიყვარული,Махаббат,Pendo,Сүйүү,Mīlestība,Meilė,Leefde,Bolingo,Szerelem,' +
                'Љубов,സ്നേഹം,Imħabba,प्रेम,Ái,Хайр,အချစ်,Tlazohtiliztli,Liefde,माया,मतिना,' +
                'Kjærlighet,Kjærleik,ପ୍ରେମ,Sevgi,ਪਿਆਰ,پیار,Miłość,Leevde,Dragoste,' +
                'Khuyay,Любовь,Таптал,Dashuria,Amuri,ආදරය,Ljubezen,Jaceyl,خۆشەویستی,Љубав,Rakkaus,' +
                'Kärlek,Pag-ibig,காதல்,ప్రేమ,ความรัก,Ишқ,Aşk,محبت,Tình yêu,Higugma,ליבע').split(
                ',');

            nums.forEach(function (n) {
                words.forEach(function (w) {
                    list.push(n + ' ' + w);
                });
            });

            return list.join('\n');
        })(),
        option: '{\n' +
            '  gridSize: Math.round(24 * canvas.width / 1024),\n' +
            '  weightFactor: function (size) {\n' +
            '    return Math.pow(size, 2.3) *canvas.width / 1024;\n' +
            '  },\n' +
            '  fontFamily: \'Times, serif\',\n' +
            '  color: function (word, weight) {\n' +
            '    return (weight>=8) ? \'#f02222\' : \'#c09292\';\n' +
            '  },\n' +
            '  rotateRatio: 0.5,\n' +
            '  rotationSteps: 2,\n' +
            '  backgroundColor: \'rgba(0,0,0,0)\'\n' +
            '}'
    };

    function run(_w, _c) {
        var canvas = document.createElement('canvas');

        // Set the width and height
        var width = _w;
        var height = Math.floor(width * 16 / 9);

        canvas.width = width;
        canvas.height = height;


        // Set the options object
        var options = eval('(' + love.option + ')');
        options.list = [];

        options.color = function (word, weight) {
            return (weight >= 8) ? _c || 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.5)';
        };


        var list = love.list.split('\n');


        for (let i = 0; i < list.length; i++) {
            var l = list[i].split(' ');
            options.list.push([l[1], l[0]]);
        }

        WordCloud([canvas], options);

        canvas.addEventListener('wordcloudstop', function () {
            //document.body.appendChild(canvas);
            cb(canvas);
        });
    };

    run(_width,_color);
};