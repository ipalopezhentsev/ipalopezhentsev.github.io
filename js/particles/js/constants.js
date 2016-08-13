//"use strict";

/**
 * Created by ipalopezhentsev on 13/08/16.
 */
var CANVAS_WIDTH = 0;
var CANVAS_HEIGHT = 0;
const NUM_RANDOM_PARTICLES = 30000|0;
const TWO_PI = Math.PI * 2.0;
const MAX_SPEED = 100.0; //pixels per second
const TEXT_BRIGHTNESS_THRESHOLD = 450|0;
const MAX_DT = 7E-1; //if dt from frame to frame is higher than this threshold, no frame is drawn - otherwise due to gc skips
//particle system will get unstable
const EPS_CLOSE = 25;
