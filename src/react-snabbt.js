import snabbt from 'snabbt.js';
import React from 'react';

import reduceOptions from './reduce-options';
import Style from './style';

class Snabbt extends React.Component {

  static propTypes = {
    after: React.PropTypes.func,
    animate: React.PropTypes.bool,
    before: React.PropTypes.func,
    children: React.PropTypes.oneOfType([React.PropTypes.node, React.PropTypes.func]),
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

  setBefore(props) {
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
  }

  setAfter(props) {
    // styles returned from after callback will be applied just after animation ends
    // example use case: display: "block" -> "none"
    const afterStyles = props.after
      ? props.after()
      : null;

    if (afterStyles) {
      if (Array.isArray(props.children)) {
        this.setState({
          styles: props.children.map((child, i) => {
            return {...this.state.styles[i], ...afterStyles};
          })
        });
      } else {
        this.setState({
          styles: [{...this.state.styles[0], ...afterStyles}]
        });
      }
    }
  }

  animate(props) {
    this.setBefore(props);

    const completeCallback = Array.isArray(props.children)
      ? "allDone"
      : "complete";

    const attention = props.attention ? "attention" : null;

    if (Array.isArray(props.options)) {
      props.options.map(reduceOptions).reduce((snabbtContext, opts, i) => {
        if (i === 0) {
          const args = [snabbtContext, this.state.children, attention, opts].filter(Boolean);
          return snabbt.call(...args);
        } else {
          const options = {
            ...opts,
            [completeCallback]: () => {
              this.setAfter(props);
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
          this.setAfter(props);
          this.complete.call(this, props, {...reduceOptions(props.options)});
        }
      };
      const args = [this.state.children, attention, options].filter(Boolean);
      snabbt(...args);
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
          typeof this.props.children === "object" ? this.props.children.props.style || {} : {}
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
    } else if (typeof this.props.children === "function") {
      return this.props.children({...this.state.styles[0]});
    } else {
      const component = React.Children.only(this.props.children);
      return React.cloneElement(component, {
        style: {...component.props.style, ...this.state.styles[0]}
      });
    }
  }
}

export default Snabbt;
