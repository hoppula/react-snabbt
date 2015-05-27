# react-snabbt

React wrapper for excellent [snabbt.js](http://daniel-lundin.github.io/snabbt.js/).

## Example usage

```javascript
import Animate from 'react-snabbt';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      animate: false
    };
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
        <Animate options={options} animate={this.state.animate} onComplete={this.onComplete}>
          <button style={buttonStyles} onClick={this.animate.bind(this)}>Button</button>
        </Animate>
      </div>
    );
  }
}

export default App;
```

## Note

Very WIP, server side rendering support is still broken, needs better control flow.