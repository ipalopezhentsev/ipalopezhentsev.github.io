/**
 * Created by ipalopezhentsev on 15/08/16.
 */
"use strict";

function Image(filename, scale_src) {
    var tmpCanvas = document.createElement("canvas");
    var tmpImg = document.createElement("img");
    var srcImgDataObj;
    var parseImgData = function () {
        tmpCanvas.width = tmpImg.width;
        tmpCanvas.height = tmpImg.height;
        var tmpCtx = tmpCanvas.getContext("2d");
        tmpCtx.drawImage(tmpImg, 0, 0, tmpImg.width * scale_src, tmpImg.height * scale_src);

        srcImgDataObj = tmpCtx.getImageData(0, 0, tmpCanvas.width, tmpCanvas.height);
    };
    tmpImg.addEventListener("load", parseImgData);
    tmpImg.src = filename;

    this.draw = function(ctx) {
        if (srcImgDataObj) {
            ctx.putImageData(srcImgDataObj, 0, 0);
        }
    };

    this.drawToImgData = function(trgImgData) {
        if (srcImgDataObj) {
            var srcW = srcImgDataObj.width;
            var srcH = srcImgDataObj.height;
            var maxSrcX = Math.min(srcW, CANVAS_WIDTH);
            var maxSrcY = Math.min(srcH, CANVAS_HEIGHT);
            var outData = trgImgData.data;

            for (var trgX = 0, trgY = 0;trgX<maxSrcX && trgY < maxSrcY;) {
                var idxTrgBufferRaw = ((srcW|0) * trgY + trgX) << 2|0;
                if (curX == imgDataObj.width) {
                    curX = 0;
                    curY++;
                }
                outData[idxOutBufferRaw++] = particlesColors[idxColorRaw++]|0;
                outData[idxOutBufferRaw++] = particlesColors[idxColorRaw++]|0;
                outData[idxOutBufferRaw++] = particlesColors[idxColorRaw++]|0;
                outData[idxOutBufferRaw] = particlesColors[idxColorRaw++]|0;

            }

            var lenPropsRaw = (nParticles * NUM_PARTICLE_PROPERTIES_IMAGE) | 0;
            for (var idxPropsRaw = 0|0, idxColorRaw = 0|0; idxPropsRaw < lenPropsRaw;) {
                var x = (particlesProps[idxPropsRaw++])|0;
                var y = (particlesProps[idxPropsRaw])|0;
                idxPropsRaw += 5|0;
                if (x < 0|0 || x >= CANVAS_WIDTH|0 || y < 0|0 || y >= CANVAS_HEIGHT|0) {
                    idxColorRaw += NUM_COLORS_PER_PARTICLE|0;
                    continue;
                }
                var idxOutBufferRaw = ((CANVAS_WIDTH|0) * y + x) << 2|0;
                outData[idxOutBufferRaw++] = particlesColors[idxColorRaw++]|0;
                outData[idxOutBufferRaw++] = particlesColors[idxColorRaw++]|0;
                outData[idxOutBufferRaw++] = particlesColors[idxColorRaw++]|0;
                outData[idxOutBufferRaw] = particlesColors[idxColorRaw++]|0;
            }
        }
    }
}