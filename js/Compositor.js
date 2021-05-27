export default class Compositor {
    constructor() {
      this.layers = [];
    }
    draw(context, display) {
      this.layers.forEach((layer) => {
        layer(context, display);
      });
    }
  }