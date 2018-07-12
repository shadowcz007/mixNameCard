const qrCode = [
    [1, 1, 0, 1, 1],
    [1, 0, 0, 0, 1],
    [0, 0, 0, 0, 0],
    [1, 0, 0, 1, 1],
    [1, 1, 1, 1, 1]
];

const PREDICTIONNUM = 3;



var rects = [{
        w: 2,
        h: 8
    },
    {
        w: 3,
        h: 7
    },
    {
        w: 4,
        h: 6
    },
    {
        w: 5,
        h: 5
    },
    {
        w: 6,
        h: 4
    }, {
        w: 7,
        h: 3
    },
    {
        w: 8,
        h: 2
    }
];


const size = qrCode.length;


function qrCodeForImage(_img) {


    let w = _img.naturalWidth,
        h = _img.naturalHeight;

    //padding
    let paddingNum = ~~(w * 0.1);
    w = w - paddingNum * 2;
    h = h - paddingNum * 2;

    //     console.log(w, h)

    let ws = Math.ceil(w / size),
        hs = Math.ceil(h / size);

    let res = [],
        sum = 0;

    for (let i = 0; i < size; i++) {

        let x = i * ws + paddingNum;
        res[i] = [];

        for (let j = 0; j < size; j++) {

            let y = j * hs + paddingNum;


            let rect = {
                x: x,
                y: y,
                w: ws,
                h: hs,
                maxW: _img.naturalWidth,
                maxH: _img.naturalHeight,
                id: 'code_' + sum,
                display: qrCode[i][j]
            };

            res[i][j] = rect;
            sum = sum + 1;



        };

    };

    // console.log(res);

    return res;

};




async function start(img, cb) {

    let crops = [];


    faceDetectionTracking(img, async function (boost) {
        console.log(boost, '!!!!');


        let qrCodeRects = qrCodeForImage(img);

        let res = [];

        let count = {};

        for (let j = 0; j < rects.length; j++) {

            let cropResult = await cropImg(img, rects[j]);
            crops.push(cropResult);
        };


        for (let r = 0; r < crops.length; r++) {
            let c = crops[r];

            // console.log(q, qrCodeRects)
            //2D collision

            for (let i = 0; i < qrCodeRects.length; i++) {
                let targets = qrCodeRects[i];

                for (let j = 0; j < targets.length; j++) {
                    const target = targets[j];
                    //   console.log('target', target)
                    var isC = isCollision(c, target);

                    if (!isC) {
                        if (boost.length) {
                            //face is collision
                            for (let f = 0; f < boost.length; f++) {
                                var face = boost[f];
                                face.w = face.width;
                                face.h = face.height;
                                var isF = isCollision(face, target);
                                if (!isF) {
                                    res.push({
                                        qrCode: target,
                                        main: c,
                                        faces: boost,
                                        id: target.id
                                    });

                                    count[target.id] = count[target.id] ? (count[target.id] + 1) : 1;

                                };
                            };
                        } else {

                            res.push({
                                qrCode: target,
                                main: c,
                                faces: boost,
                                id: target.id
                            });

                            count[target.id] = count[target.id] ? (count[target.id] + 1) : 1;

                        };


                    };
                }


            };

        };


        //排序，对结果进行排序----------------------------------------------------------------

        console.log(count);
        let ks = Object.keys(count),
            nums = {},
            sum = 0;

        let res_new = [],
            res_key = {};

        for (let i = 0; i < ks.length; i++) {
            //console.log(nums[count[ks[i]]])
            sum = sum + count[ks[i]];
            nums[count[ks[i]]] ? nums[count[ks[i]]].push(ks[i]) : nums[count[ks[i]]] = [ks[i]];

        };

        console.log(sum);
        for (let i = 0; i < ks.length; i++) {
            for (let j = 0; j < res.length; j++) {
                let r = res[j];
                let id = ks[i];
                //console.log(r,id)
                if (r.id == id) {
                    //  console.log(res_key[id],'~~~')

                    if (!res_key[id]) {

                        res[j].score = (count[id] + res[j].qrCode.display * sum * 2) / sum;
                        res_new.push(res[j]);
                        res_key[id] = 1;
                    };

                };
            };
        };

        console.log(res_new);

        var compare = function (prop) {
            return function (obj1, obj2) {
                var val1 = obj1[prop];
                var val2 = obj2[prop];
                if (val1 > val2) {
                    return -1;
                } else if (val1 < val2) {
                    return 1;
                } else {
                    return 0;
                }
            }
        };

        res_new = res_new.sort(compare("score"));


        //排序，对结果进行排序----------------------------------------------------------------


        cb(res_new.slice(0, PREDICTIONNUM));


    });




};





function isCollision(_rect1, _rect2) {



    let x1 = _rect1.x,
        y1 = _rect1.y,
        w1 = _rect1.w,
        h1 = _rect1.h,
        x2 = _rect2.x,
        y2 = _rect2.y,
        w2 = _rect2.w,
        h2 = _rect2.h;


    let res = (x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && y1 + h1 > y2);



    return res;
};




async function drawAll(img) {

    start(img, function (res) {
        for (let j = 0; j < res.length; j++) {
            let r = res[j];
            drawImageAndQrCode(img, r);
        };
    });

};

function drawImageAndQrCode(_img, _all) {
    let canvas = document.createElement('canvas');
    let ctx = canvas.getContext('2d');


    let _rect = _all.qrCode;
    let _main = _all.main;
    let _faces = _all.faces;

    //  console.log(_faces)

    canvas.width = _rect.maxW;
    canvas.height = _rect.maxH;

    ctx.drawImage(_img, 0, 0, canvas.width, canvas.height);

    /*
    ctx.lineWidth = 12;
    ctx.strokeStyle = "red";

    ctx.strokeRect(_rect.x, _rect.y, _rect.w, _rect.h);
*/
    var qrCode = new Image();

    qrCode.onload = function () {

        ctx.drawImage(qrCode, _rect.x, _rect.y, _rect.w, _rect.w);

        resultEl.style.display = 'block';
        resultEl.appendChild(canvas);
        loadingEl.style.display = "none";
    };

    qrCode.src = qrcodeImg.src;

    /*
   ctx.strokeStyle = "blue";
    ctx.strokeRect(_main.x, _main.y, _main.w, _main.h);
    canvas.setAttribute('data', JSON.stringify(_rect));

    for (let i = 0; i < _faces.length; i++) {
        var _face = _faces[i];
        ctx.strokeRect(_face.x, _face.y, _face.width, _face.height);
    };

*/

};


function prescaleImage(image, maxDimension, callback) {
    // tracking.js is very slow on big images so make sure the image is reasonably small
    var width = image.naturalWidth || image.width;
    var height = image.naturalHeight || image.height;
    if (width < maxDimension && height < maxDimension)
        return callback(image, 1);
    var scale = Math.min(maxDimension / width, maxDimension / height);
    var canvas = document.createElement('canvas');
    canvas.width = ~~(width * scale);
    canvas.height = ~~(height * scale);
    canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
    var result = document.createElement('img');
    result.onload = function () {
        callback(result, scale);
    };
    result.src = canvas.toDataURL();
};

function faceDetectionTracking(img, callback) {
    prescaleImage(img, 768, function (img, scale) {
        var tracker = new tracking.ObjectTracker('face');
        tracking.track(img, tracker);
        tracker.on('track', function (event) {
            console.log(
                'tracking.js detected ' + event.data.length + ' faces',
                event.data
            );
            var boost = event.data.map(function (face) {
                return {
                    x: face.x / scale,
                    y: face.y / scale,
                    width: face.width / scale,
                    height: face.height / scale,
                    weight: 1.0
                };
            });

            callback(boost);
        });
    });
}






async function cropImg(_img, _rect) {

    let w = _rect.w,
        h = _rect.h;

    var options = {
        width: _img.naturalWidth * w * 0.1,
        height: _img.naturalHeight * h * 0.1,
        minScale: 0.3
    };

    let result_max = await smartcrop.crop(_img, options);

    var selectedCrop = result_max.topCrop;

    //  console.log(selectedCrop, 'RESULT');

    let xCrop = selectedCrop.x,
        yCrop = selectedCrop.y,
        widthCrop = selectedCrop.width,
        heightCrop = selectedCrop.height;

    let res = {
        x: xCrop,
        y: yCrop,
        w: widthCrop,
        h: heightCrop
    };

    return res
};