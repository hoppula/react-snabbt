class Style {
  constructor(component, index) {
    this.component = component;
    this.index = index;
  }

  set transform(transform) {
    this.component.updateStyle("transform", transform, this.index);
  }

  set webkitTransform(transform) {
    this.component.updateStyle("WebkitTransform", transform, this.index);
  }

  set opacity(opacity) {
    this.component.updateStyle("opacity", opacity, this.index);
  }

  set width(width) {
    this.component.updateStyle("width", width, this.index);
  }

  set height(height) {
    this.component.updateStyle("height", height, this.index);
  }
}

export default Style;
