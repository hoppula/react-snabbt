import snabbt from 'snabbt.js';
import React from 'react';

import reduceOptions from './reduce-options';

class SnabbtDOM extends React.Component {

  static propTypes = {
    after: React.PropTypes.func,
    animate: React.PropTypes.bool,
    before: React.PropTypes.func,
    children: React.PropTypes.node,
    onComplete: React.PropTypes.func,
    options: React.PropTypes.oneOfType([React.PropTypes.array, React.PropTypes.object]),
    stop: React.PropTypes.func
  }

  constructor(props) {
    super(props);
    this.state = {};
    this.animate = this.animate.bind(this);
    this.complete = this.complete.bind(this);
  }

  complete(props, options) {
    if (props.onComplete) {
      props.onComplete.call(this, options);
    }
  }

  setBefore(props, element) {
    // styles returned from before callback will be applied just before animation runs
    // example use case: display: "none" -> "block"
    const beforeStyles = props.before
      ? props.before()
      : null;

    if (beforeStyles) {
      Object.keys(beforeStyles).map((key) => {
        if (Array.isArray(element)) {
          element.map((child) => {
            child.style[key] = beforeStyles[key];
          });
        } else {
          element.style[key] = beforeStyles[key];
        }
      });
    }
  }

  setAfter(props, element) {
    // styles returned from after callback will be applied just after animation ends
    // example use case: display: "block" -> "none"
    const afterStyles = props.after
      ? props.after()
      : null;

    if (afterStyles) {
      Object.keys(afterStyles).map((key) => {
        if (Array.isArray(element)) {
          element.map((child) => {
            child.style[key] = afterStyles[key];
          });
        } else {
          element.style[key] = afterStyles[key];
        }
      });
    }
  }

  animate(props) {
    const element = Array.isArray(props.children)
      ? React.findDOMNode(this).children
      : React.findDOMNode(this);

    this.setBefore(props, element);

    const completeCallback = Array.isArray(props.children)
      ? "allDone"
      : "complete";

    const attention = props.attention ? "attention" : null;

    if (Array.isArray(props.options)) {
      props.options.map(reduceOptions).reduce((snabbtContext, opts, i) => {
        if (i === 0) {
          const args = [snabbtContext, element, attention, opts].filter(Boolean);
          return snabbt.call(...args);
        } else {
          const options = {
            ...opts,
            [completeCallback]: () => {
              this.setAfter(props, element);
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
          this.setAfter(props, element);
          this.complete.call(this, props, {...reduceOptions(props.options)});
        }
      };
      const args = [element, attention, options].filter(Boolean);
      snabbt(...args);
    }
  }

  stop() {
    const element = Array.isArray(this.props.children)
      ? React.findDOMNode(this).children
      : React.findDOMNode(this);

    snabbt(element, "stop");
  }

  componentDidMount() {
    if (this.props.animate) {
      this.animate(this.props);
    }
    if (this.props.stop) {
      this.stop();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.animate && !this.props.animate) {
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
            React.Children.map(this.props.children, child => React.cloneElement(child))
          }
        </div>
      );
    } else {
      const component = React.Children.only(this.props.children);
      return React.cloneElement(component);
    }
  }
}

export default SnabbtDOM;
