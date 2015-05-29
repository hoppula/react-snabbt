# react-snabbt

React wrapper for excellent [snabbt.js](http://daniel-lundin.github.io/snabbt.js/) animation library.

All style changes go through React state handling, so the performance will take a small hit, but should not be far off from direct DOM `.style` manipulation.

## &lt;Snabbt&gt;

You can pass `Snabbt` component one or many child components to be animated. Use `options` prop for setting the animation options. If you pass an array of animation options to `options` prop, `react-snabbt` will chain the animations.

You can start the animation by passing `animate` prop as truthy value.
You can stop the animation by passing `stop` prop as truthy value. There's currently no way to continue stopped animation.

If you want to be notified when animation finishes, pass a callback function as `onComplete` prop, it will be called only once even when animating multiple elements.

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
