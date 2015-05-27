import snabbt from 'snabbt.js';
import React from 'react';

const validOptions = [
  "position",
  "rotation",
  "scale",
  "rotationPost",
  "width",
  "height",
  "opacity",
  "duration",
  "delay",
  "loop",
  "fromPosition",
  "fromRotation",
  "fromScale",
  "fromRotationPost",
  "fromWidth",
  "fromHeight",
  "fromOpacity",
  "springConstant",
  "springDeceleration",
  "springMass",
  "transformOrigin",
  "easing"
];

function reduceOptions(options) {
  return Object.keys(options).reduce((obj, option) => {
    if (validOptions.indexOf(option) !== -1) {
      obj[option] = options[option];
    }
    return obj;
  }, {});
}

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

class Snabbt extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      children: [],
      styles: []
    };
    this.animate = this.animate.bind(this);
    this.complete = this.complete.bind(this);
  }

  complete() {
    if (this.props.onComplete) {
      this.props.onComplete.call(this);
    }
  }

  animate() {
    const completeCallback = Array.isArray(this.props.children)
      ? "allDone"
      : "complete";

    if (Array.isArray(this.props.options)) {
      this.props.options.map(reduceOptions).reduce((snabbtContext, opts, i) => {
        if (i === 0) {
          return snabbt.call(snabbtContext, this.state.children, {...opts, [completeCallback]: this.complete});
        } else {
          return snabbtContext.snabbt.call(snabbtContext, opts);
        }
      }, snabbt);
    } else {
      const options = {
        ...reduceOptions(this.props.options),
        [completeCallback]: this.complete
      };

      snabbt(this.state.children, options);
    }
  }

  stop() {
    snabbt(this.state.children, "stop");
  }

  updateStyle(attribute, value, index) {
    const styles = this.state.styles;
    styles[index][attribute] = value;
    this.setState({styles: styles});
  }

  componentDidMount() {
    function actions() {
      if (this.props.animate) {
        this.animate();
      }
      if (this.props.stop) {
        this.stop();
      }
    }

    if (Array.isArray(this.props.children)) {
      this.setState({
        children: this.props.children.map((child, i) => {
          return {style: new Style(this, i)};
        }),
        styles: this.props.children.map((child) => {
          return child.props.style;
        })
      }, actions);
    } else {
      this.setState({children: [{style: new Style(this, 0)}], styles: [this.props.children.props.style]}, actions);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.animate && !this.props.animate) {
      this.animate();
    }
    if (nextProps.stop && !this.props.stop) {
      this.stop();
    }
  }

  render() {
    if (Array.isArray(this.props.children)) {
      return (
        <div className="react-snabbt-container">
          {
            React.Children.map(this.props.children, (child, i) => {
              return React.cloneElement(child, {style: this.state.styles[i]})
            })
          }
        </div>
      );
    } else {
      const component = React.Children.only(this.props.children);
      return React.cloneElement(component, {style: this.state.styles[0]});
    }
  }
}

export default Snabbt;
