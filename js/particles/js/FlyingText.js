/**
 * Created by ipalopezhentsev on 13/08/16.
 */
"use strict";

function FlyingText(text, start_x, start_y, start_vx, start_vy) {
    var x = start_x;
    var y = start_y;

    var vx = start_vx;
    var vy = start_vy;

    var width;
    var height = 60;

    this.update = function (dt) {
        x += vx * dt;
        y += vy * dt;

        if (x < 0 || x + width >= CANVAS_WIDTH) {
            vx = -vx;
            x += dt * vx;
            x += dt * vx;
        }
        if (y < 0 || y >= CANVAS_HEIGHT) {
            vy = -vy;
            y += dt * vy;
            y += dt * vy;
        }
    };

    this.draw = function (ctx) {
        if (!width) {
            width = ctx.measureText(text).width;
        }
        ctx.font = "bold 84px sans-serif";
        ctx.lineWidth = 2;
        ctx.fillStyle = "red";
        //ctx.fillText(text, x, y);
        wrapText(ctx, text, x, y, 500, height);
    };

    function wrapText(context, text, x, y, maxWidth, lineHeight) {
        var cars = text.split("\n");

        for (var ii = 0; ii < cars.length; ii++) {

            var line = "";
            var words = cars[ii].split(" ");

            for (var n = 0; n < words.length; n++) {
                var testLine = line + words[n] + " ";
                var metrics = context.measureText(testLine);
                var testWidth = metrics.width;

                if (testWidth > maxWidth) {
                    context.fillText(line, x, y);
                    line = words[n] + " ";
                    y += lineHeight;
                }
                else {
                    line = testLine;
                }
            }

            context.fillText(line, x, y);
            y += lineHeight;
        }
    }
}
