import React, {Children, Component, PropTypes, cloneElement} from 'react';
import snabbt from 'snabbt.js';

const propTypes = {
  translate: PropTypes.array,
  rotateX: PropTypes.number,
  rotateY: PropTypes.number,
  rotateZ: PropTypes.number,
  scale: PropTypes.array,
  skew: PropTypes.array
};

function transformProperty() {
  // Find which vendor prefix to use
  var styles = window.getComputedStyle(document.documentElement, '');
  var vendorPrefix = (Array.prototype.slice
      .call(styles)
      .join('')
      .match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['', 'o'])
    )[1];

  return vendorPrefix === 'webkit'
    ? 'WebkitTransform'
    : 'transform';
}

function applyOperations(matrix, operations={}) {
  const keys = Object.keys(operations);
  return keys.reduce((matrixRef, op, i) => {
    return matrixRef[op](...Array.isArray(operations[op]) ? operations[op] : [operations[op]]);
  }, matrix);
}

class Matrix extends Component {

  static propTypes = propTypes;

  render() {
    const operations = Object.keys(this.props).reduce((ops, prop) => {
      return propTypes[prop]
        ? {...ops, [prop]: this.props[prop]}
        : ops;
    }, {});
    let style = {
      [transformProperty()]: applyOperations(snabbt.createMatrix(), operations).asCSS()
    };

    if (typeof this.props.children === "function") {
      return this.props.children({...style});
    } else {
      const component = Children.only(this.props.children);
      return cloneElement(component, {
        style: {...component.props.style, ...style}
      });
    }

  }
}

export default Matrix;
