/*
Copyright (c) 2018 shadow
URL: https://shadowcz007.github.io/mixNameCard/index.html

微信公众号Design-AI-Lab

Licensed under the MIT license
*/



function MixColor(_color) {
    //array
    this.color = _color;
   


    this.toString = function () {
        return 'rgb(' + this.color.toString() + ')';
    };

    this.getLuminance = function (_color_array) {

        //http://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef
        var rgb = _color_array;
        var RsRGB, GsRGB, BsRGB, R, G, B;
        RsRGB = rgb[0] / 255;
        GsRGB = rgb[1] / 255;
        BsRGB = rgb[2] / 255;

        if (RsRGB <= 0.03928) {
            R = RsRGB / 12.92;
        } else {
            R = Math.pow(((RsRGB + 0.055) / 1.055), 2.4);
        }
        if (GsRGB <= 0.03928) {
            G = GsRGB / 12.92;
        } else {
            G = Math.pow(((GsRGB + 0.055) / 1.055), 2.4);
        }
        if (BsRGB <= 0.03928) {
            B = BsRGB / 12.92;
        } else {
            B = Math.pow(((BsRGB + 0.055) / 1.055), 2.4);
        }
        return (0.2126 * R) + (0.7152 * G) + (0.0722 * B);

    };


    // Take input from [0, n] and return it as [0, 1]
    function normalization(n, max) {

        n = Math.min(max, Math.max(0, parseFloat(n)));

        // Handle floating point rounding errors
        if ((Math.abs(n - max) < 0.000001)) {
            return 1;
        };

        // Convert into [0, 1] range if it isn't already
        return (n % max) / parseFloat(max);
    };

    this.rgb2hsl=function(_color_array) {

        var r = normalization(_color_array[0], 255);
        var g = normalization(_color_array[1], 255);
        var b = normalization(_color_array[2], 255);

        var max = Math.max(r, g, b),
            min = Math.min(r, g, b);

        var h, s, l = (max + min) / 2;

        if (max == min) {
            h = s = 0;

        } else {
            var d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r:
                    h = (g - b) / d + (g < b ? 6 : 0);
                    break;
                case g:
                    h = (b - r) / d + 2;
                    break;
                case b:
                    h = (r - g) / d + 4;
                    break;
            }

            h /= 6;
        }

        return {
            h: h,
            s: s,
            l: l
        };

    };

    this.hslToRgb=function(_hsl) {
        var r, g, b;
        var h=_hsl.h,s=_hsl.s,l=_hsl.l;
        /*
        h = normalization(h, 360);
        s = normalization(s, 100);
        l = normalization(l, 100);
*/
 

        function hue2rgb(p, q, t) {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        }

        if (s === 0) {
            r = g = b = l; // achromatic
        } else {
            var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            var p = 2 * l - q;
            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        };

        

        return [r * 255, g * 255, b * 255];
    };


    

    this.hsl=this.rgb2hsl(this.color);

    this.luminance = this.getLuminance(this.color);

    

}

function MixImage(_img) {
    this.img = _img;

    this.colors = getColorsFromImage(this.img);


    function getColorsFromImage(_img) {
        var _num = 3;
        var colorThief = new ColorThief();
        var mainColor = new MixColor(colorThief.getColor(_img));
        var colors = colorThief.getPalette(_img, _num);
        //colors.push(mainColor);

        var res = [mainColor];

        for (let i = 0; i < colors.length; i++) {
            var c = new MixColor(colors[i]);
            res.push(c);
        };

        res.sort(function (a, b) {
            return a.luminance - b.luminance
        });


        var mainLum = mainColor.luminance;

        var isDark = false,
            invertColor;

        for (let i = 0; i < res.length; i++) {

            if (res[i].luminance == mainLum) {
                if (i <= 1) {
                    isDark = true;
                    invertColor = res[3];
                       
                } else {
                    isDark = false;
                    invertColor = res[0];
                    
                };
            };

        };

       if (isDark) {
        invertColor.hsl.l+=(invertColor.hsl.l*0.2);   
        invertColor.color=invertColor.hslToRgb(invertColor.hsl);
        mainColor.hsl.l-=mainColor.hsl.l*0.6;
        mainColor.color=mainColor.hslToRgb(mainColor.hsl);
           return {
            isDark: isDark,
            bgColor: invertColor,
            res: res,
            mainColor:mainColor,
            frontColor: mainColor
        }
       }else{
        invertColor.hsl.l-=(invertColor.hsl.l*0.2);   
        invertColor.color=invertColor.hslToRgb(invertColor.hsl);
        mainColor.hsl.l+=mainColor.hsl.l*0.2;
        mainColor.color=mainColor.hslToRgb(mainColor.hsl);
        return {
            isDark: isDark,
            bgColor:mainColor,
            res: res,
            mainColor:mainColor,
            frontColor: invertColor
        }
       }

         
    };


};