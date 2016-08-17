"use strict";

/**
 * Created by ipalopezhentsev on 12/08/16.
 */
function ParticleSystem() {
    var NUM_PARTICLE_PROPERTIES_RANDOM = 4;
    var IDX_X_RANDOM = 0;
    var IDX_Y_RANDOM = 1;
    var IDX_VX_RANDOM = 2;
    var IDX_VY_RANDOM = 3;
    var NUM_COLORS_PER_PARTICLE = 4;
    var IDX_COLOR_R = 0;
    var IDX_COLOR_G = 1;
    var IDX_COLOR_B = 2;
    var IDX_COLOR_A = 3;

    var nParticles;
    var particlesProps = new Float64Array(100);
    var particlesColors = new Uint8ClampedArray(100);

    this.generateParticles_random = function (numParticles) {
        nParticles = numParticles;
        particlesProps = new Float64Array(numParticles * NUM_PARTICLE_PROPERTIES_RANDOM);
        for (var idxParticle = 0; idxParticle < numParticles; idxParticle++) {
            var idxRaw = idxParticle * NUM_PARTICLE_PROPERTIES_RANDOM;
            particlesProps[idxRaw + IDX_X_RANDOM] = Math.random() * CANVAS_WIDTH;
            particlesProps[idxRaw + IDX_Y_RANDOM] = Math.random() * CANVAS_HEIGHT;
            var rndAngle = Math.random() * TWO_PI;
            var rndMagnitude = Math.random() * MAX_SPEED;
            particlesProps[idxRaw + IDX_VX_RANDOM] = rndMagnitude * Math.cos(rndAngle);
            particlesProps[idxRaw + IDX_VY_RANDOM] = rndMagnitude * Math.sin(rndAngle);
        }

        particlesColors = new Uint8ClampedArray(numParticles * NUM_COLORS_PER_PARTICLE);
        for (var idxParticle = 0; idxParticle < numParticles; idxParticle++) {
            var idxRaw = idxParticle * NUM_COLORS_PER_PARTICLE;
            var rnd = Math.floor(Math.random() * 130);
            particlesColors[idxRaw + IDX_COLOR_R] = rnd;
            particlesColors[idxRaw + IDX_COLOR_G] = rnd;
            particlesColors[idxRaw + IDX_COLOR_B] = rnd;
            particlesColors[idxRaw + IDX_COLOR_A] = 255;
        }
        //console.log("random particles count: " + particles.length / NUM_PARTICLE_PROPERTIES);
    };

    this.updateParticles = function (dt) {
        var len = nParticles * NUM_PARTICLE_PROPERTIES_RANDOM;
        for (var idxRaw = 0; idxRaw < len; idxRaw += NUM_PARTICLE_PROPERTIES_RANDOM) {
            var x = particlesProps[idxRaw + IDX_X_RANDOM];
            var y = particlesProps[idxRaw + IDX_Y_RANDOM];
            var vx = particlesProps[idxRaw + IDX_VX_RANDOM];
            var vy = particlesProps[idxRaw + IDX_VY_RANDOM];
            x += dt * vx;
            y += dt * vy;
            if (x < 0 || x >= CANVAS_WIDTH) {
                vx = -vx;
                x += dt * vx;
                x += dt * vx;
            }
            if (y < 0 || y >= CANVAS_HEIGHT) {
                vy = -vy;
                y += dt * vy;
                y += dt * vy;
            }
            particlesProps[idxRaw + IDX_X_RANDOM] = x;
            particlesProps[idxRaw + IDX_Y_RANDOM] = y;
            particlesProps[idxRaw + IDX_VX_RANDOM] = vx;
            particlesProps[idxRaw + IDX_VY_RANDOM] = vy;
        }
    };

    this.drawParticles = function(backBuffer) {
        var lenPropsRaw = nParticles * NUM_PARTICLE_PROPERTIES_RANDOM;
        var outData = backBuffer.data;
        for (var idxPropsRaw = 0|0, idxColorRaw = 0|0; idxPropsRaw < lenPropsRaw;) {
            var x = Math.round(particlesProps[idxPropsRaw++]);
            var y = Math.round(particlesProps[idxPropsRaw++]);
            idxPropsRaw += 2;
            if (x < 0 || x >= CANVAS_WIDTH || y < 0 || y >= CANVAS_HEIGHT) {
                //TODO: i see some particles have negative coords....
                idxColorRaw+=NUM_COLORS_PER_PARTICLE;
                continue;
            }
            var idxOutBufferRaw = (CANVAS_WIDTH * y + x) << 2|0;
            outData[idxOutBufferRaw++] = particlesColors[idxColorRaw++];
            outData[idxOutBufferRaw++] = particlesColors[idxColorRaw++];
            outData[idxOutBufferRaw++] = particlesColors[idxColorRaw++];
            outData[idxOutBufferRaw] = particlesColors[idxColorRaw++];
        }
    };
}