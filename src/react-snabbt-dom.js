import snabbt from 'snabbt.js';
import React from 'react';

import reduceOptions from './reduce-options';

class SnabbtDOM extends React.Component {

  static propTypes = {
    animate: React.PropTypes.bool,
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

  animate(props) {
    const completeCallback = Array.isArray(props.children)
      ? "allDone"
      : "complete";

    var element = Array.isArray(props.children)
      ? React.findDOMNode(this).children
      : React.findDOMNode(this);

    if (Array.isArray(props.options)) {
      props.options.map(reduceOptions).reduce((snabbtContext, opts, i) => {
        if (i === 0) {
          return snabbt.call(snabbtContext, element, opts);
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
      snabbt(element, options);
    }
  }

  stop() {
    var element = Array.isArray(props.children)
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
