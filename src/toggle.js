import React from 'react';

const fromOptions = {
  position: "fromPosition",
  rotation: "fromRotation",
  scale: "fromScale",
  rotationPost: "fromRotationPost",
  width: "fromWidth",
  height: "fromHeight",
  opacity: "fromOpacity"
};

function convertToFromOptions(options) {
  return Object.keys(options).reduce((obj, key) => {
    const option = fromOptions[key] ? fromOptions[key] : key;
    obj[option] = options[key];
    return obj;
  }, {});
}

class Toggle extends React.Component {

  constructor(props) {
    super(props);
    this.onComplete = this.onComplete.bind(this);
    this.state = {
      active: false,
      lastOptions: null
    }
  }

  onComplete(options) {
    const lastOptions = !this.state.active
      ? convertToFromOptions(options)
      : null;

    this.setState({active: !this.state.active, lastOptions: lastOptions});

    if (this.props.onComplete) {
      this.props.onComplete.call(this, lastOptions);
    }
  }

  render() {
    const options = [this.state.active ? {} : this.props.options];
    if (this.state.lastOptions) {
      options.unshift(this.state.lastOptions);
    }
    const component = React.Children.only(this.props.children);
    return React.cloneElement(component, {animate: this.props.animate, options: options, onComplete: this.onComplete});
  }
}

export default Toggle;
