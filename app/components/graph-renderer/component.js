import get from 'ember-metal/get';
import observer from 'ember-metal/observer';
import CanvasRenderer from '../canvas-renderer/component';

const {PI} = Math;
const TAU = PI * 2;
const STEPS = 5000;

function frac(x) {
  return x - Math.floor(x);
}

function sin(amplitude, period, phase) {
  return function(x) {
    return amplitude * Math.sin(x / period + phase);
  }
}

function saw(amplitude, period, phase) {
  return function(x) {
    return amplitude * frac(x / period + phase);
  }
}

const rotation = function(time) {
  return time * TAU;// + Math.sin(time / 7) * PI / 2;
};

export default CanvasRenderer.extend({

  counter: 0,
  counter2: 0,

  erase: observer('segments.@each.{length,period}', function() {
    this.clear();
  }),

  draw() {
    this.clear();
    const {innerWidth: cx, innerHeight: cy} = window;
    this.canvas.save();
    this.canvas.translate(cx / 2, cy / 2);
    this.drawDots();
    this.drawSegments();
    this.canvas.restore();
  },

  pointsFor(counter) {
    return get(this, 'segments').reduce((points, segment, index) => {
      let {x, y} = points[points.length - 1];
      const length = get(segment, 'length');
      const period = get(segment, 'period');
      const angle = (index + 1) * rotation(counter / period);
      x += length * Math.cos(angle);
      y += length * Math.sin(angle);
      points.push({x, y});
      return points;
    }, [{x: 0, y: 0}]);
  },

  drawSegments() {
    const points = this.pointsFor(this.incrementProperty('counter2'));
    this.canvas.beginPath();
    this.canvas.moveTo(0, 0);
    points.forEach(({x, y}) => this.canvas.lineTo(x, y));
    this.canvas.stroke();
  },

  drawDots() {
    this.canvas.beginPath();
    const counter = this.incrementProperty('counter', 300);
    const points = this.pointsFor(counter);
    const {x, y} = points[points.length - 1];
    this.canvas.moveTo(x, y);
    for(let i = 0; i < STEPS; i++) {
      const points = this.pointsFor(counter + i);
      const {x, y} = points[points.length - 1];
      this.canvas.lineTo(x, y);
    }
    this.canvas.stroke();
  }

});
