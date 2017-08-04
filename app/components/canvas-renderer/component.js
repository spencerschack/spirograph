import Component from 'ember-component';
import get from 'ember-metal/get';
import on from 'ember-evented/on';
import set from 'ember-metal/set';

export default Component.extend({

  tagName: 'canvas',

  canvas: null,
  animationFrameRequest: null,

  setup: on('willInsertElement', function() {
    this.canvas = this.element.getContext('2d');
    this.fitElement = this.fitElement.bind(this);
    this.fitElement();
    window.addEventListener('resize', this.fitElement);
  }),

  teardown: on('willDestroyElement', function() {
    window.removeEventListener('resize', this.fitElement);
    window.cancelAnimationFrame(get(this, 'animationFrameRequest'));
  }),

  fitElement() {
    const ratio = window.devicePixelRatio || 1;
    const {innerWidth: width, innerHeight: height} = window;
    this.element.width  =  width * ratio;
    this.element.height = height * ratio;
    this.canvas.scale(ratio, ratio);
  },

  clear() {
    const {width, height} = this.element;
    this.canvas.clearRect(0, 0, width, height);
  },

  requestFrame: on('didInsertElement', function() {
    const request = window.requestAnimationFrame(() => this.requestFrame());
    set(this, 'animationFrameRequest', request);
    const time = window.performance.now();
    this.draw(time);
  }),

  draw() {}

});
