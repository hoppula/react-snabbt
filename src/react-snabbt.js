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

  static propTypes = {
    animate: React.PropTypes.bool,
    before: React.PropTypes.func,
    children: React.PropTypes.node,
    onComplete: React.PropTypes.func,
    options: React.PropTypes.oneOfType([React.PropTypes.array, React.PropTypes.object]),
    stop: React.PropTypes.func
  }

  constructor(props) {
    super(props);
    this.state = {
      children: [],
      styles: [],
      completed: false
    };
    this.animate = this.animate.bind(this);
    this.complete = this.complete.bind(this);
  }

  complete(props, options) {
    this.setState({completed: true});
    if (props.onComplete) {
      props.onComplete.call(this, options);
    }
  }

  animate(props) {
    // styles returned from before callback will be applied just before animation runs
    // example use case: display: "none" -> "block"
    const beforeStyles = props.before
      ? props.before()
      : null;

    if (beforeStyles) {
      if (Array.isArray(props.children)) {
        this.setState({
          styles: props.children.map((child, i) => {
            return {...this.state.styles[i], ...beforeStyles};
          })
        });
      } else {
        this.setState({
          styles: [{...this.state.styles[0], ...beforeStyles}]
        });
      }
    }

    const completeCallback = Array.isArray(props.children)
      ? "allDone"
      : "complete";

    if (Array.isArray(props.options)) {
      props.options.map(reduceOptions).reduce((snabbtContext, opts, i) => {
        if (i === 0) {
          return snabbt.call(snabbtContext, this.state.children, opts);
        } else {
          const options = {
            ...opts,
            [completeCallback]: () => {
              this.complete.call(this, props, opts);
            }
          };
          return snabbtContext.snabbt.call(snabbtContext, options);
        }
      }, snabbt);
    } else {
      const options = {
        ...reduceOptions(props.options),
        [completeCallback]: () => {
          this.complete.call(this, props, {...reduceOptions(props.options)});
        }
      };
      snabbt(this.state.children, options);
    }
  }

  stop() {
    snabbt(this.state.children, "stop");
  }

  updateStyle(attribute, value, index) {
    if (!this.state.completed) {
      const styles = this.state.styles;
      styles[index][attribute] = value;
      this.setState({styles: styles});
    }
  }

  componentDidMount() {
    // actions will run in setState callback
    function actions() {
      if (this.props.animate) {
        this.animate(this.props);
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
          return child.props.style || {};
        })
      }, actions);
    } else {
      this.setState({
        children: [
          {style: new Style(this, 0)}
        ],
        styles: [
          this.props.children.props.style || {}
        ]
      }, actions);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.animate && !this.props.animate) {
      this.setState({completed: false});
      this.animate(nextProps);
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
              return React.cloneElement(child, {
                style: {...child.props.style, ...this.state.styles[i]}
              });
            })
          }
        </div>
      );
    } else {
      const component = React.Children.only(this.props.children);
      return React.cloneElement(component, {
        style: {...component.props.style, ...this.state.styles[0]}
      });
    }
  }
}

export default Snabbt;
