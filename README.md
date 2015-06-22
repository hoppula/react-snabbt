# react-snabbt

React wrapper for excellent [snabbt.js](http://daniel-lundin.github.io/snabbt.js/) animation library.

### require('react-snabbt')

When you require `react-snabbt` directly, all styles go through React state handling, so the performance will take a small hit. It's not far off from direct DOM `.style` manipulation though and it's fine for single element animations. Use this if you want React to have total control over the DOM.

### require('react-snabbt/dom')

When animating large amount of elements, it's recommended to require `react-snabbt/dom` instead. This component bypasses React state handling and applies CSS transforms directly to DOM elements. When using this component, remember to not use `opacity` or `transform` in your React inline styles as they're handled by snabbt.js.

## &lt;Snabbt&gt;

You can animate one or multiple child components with `Snabbt` component. Use `options` prop for setting the animation options. If you pass an array of animation options to `options` prop, `react-snabbt` will chain the animations.

You can start the animation by passing a truthy value in `animate` prop.
You can stop the animation by passing a truthy value in `stop` prop. There's currently no way to continue stopped animation.

If you want to be notified when animation finishes, pass a callback function as `onComplete` prop, it will be called only once even when animating multiple elements.

There's also support for attention animations, just add `attention` prop with truthy value.

### Example usage
```javascript
import Snabbt from 'react-snabbt';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      animate: false
    };
    this.animate = this.animate.bind(this);
  }

  animate() {
    this.setState({animate: true});
  }

  onComplete() {
    console.log( "Animation completed!" );
  }

  render() {
    const buttonStyles = {
      width: "200px",
      height: "40px",
      background: "#ddd",
      borderRadius: "5px"
    };
    const options = {
      position: [100, 0, 0],
      rotation: [Math.PI, 0, 0],
      easing: 'ease'
    };
    return (
      <div>
        <Snabbt options={options} animate={this.state.animate} onComplete={this.onComplete}>
          <button style={buttonStyles} onClick={this.animate}>Button</button>
        </Snabbt>
      </div>
    );
  }
}

export default App;
```

## &lt;Toggle&gt;

With `react-snabbt/toggle` component you can animate back and forth between initial state and `options`. You can initialize the animation to `options` prop state by passing `animate` prop with truthy value. You should set the `animate` prop to falsey value once the animation finishes. You can then initiate the animation back to initial state by setting `animate` to a truthy value again.

### Condensed example

```javascript
  <Toggle options={options} animate={this.state.animate} onComplete={this.onComplete}>
    <Snabbt>
      <button style={buttonStyles} onClick={this.toggle}>Button</button>
    </Snabbt>
  </Toggle>

```

## License
MIT
