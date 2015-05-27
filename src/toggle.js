import React from 'react';

class Toggle extends React.Component {

  constructor(props) {
    super(props);
    this.onComplete = this.onComplete.bind(this);
    this.state = {
      active: props.active
    }
  }

  onComplete() {
    this.setState({active: !this.state.active});
    if (this.props.onComplete) {
      this.props.onComplete();
    }
  }

  render() {
    const options = this.state.active
      ? this.props.options[0]
      : this.props.options[1];

    const component = React.Children.only(this.props.children);
    return React.cloneElement(component, {animate: this.props.animate, options: options, onComplete: this.onComplete});
  }
}

export default Toggle;


// Usage (not tested yet):

// import Animate from 'react-snabbt';
// import Toggle from 'react-snabbt/toggle';

// class App extends React.Component {

//   constructor(props) {
//     super(props);
//     this.state = {
//       active: false,
//       animate: false
//     };
//   }

//   toggle() {
//     this.setState({active: !this.state.active, animate: true});
//   }

//   endAnimation() {
//     console.log( "Animation completed!" );
//     this.setState({animate: false});
//   }

//   render() {
//     const buttonStyles = {
//       width: "200px",
//       height: "40px",
//       background: "#ddd",
//       borderRadius: "5px"
//     };
//     const inactive = {
//       position: [100, 0, 0],
//       rotation: [Math.PI, 0, 0],
//       easing: 'ease'
//     };
//     const active = {
//       position: [0, 0, 0],
//       rotation: [-Math.PI, 0, 0],
//       easing: 'ease'
//     };
//     return (
//       <div>
//         <Toggle options={[inactive, active]} animate={this.state.animate} active={this.state.active} onComplete={this.endAnimation}>
//           <Animate>
//             <button style={buttonStyles} onClick={this.toggle.bind(this)}>Button</button>
//           </Animate>
//         </Toggle>
//       </div>
//     );
//   }
// }

// export default App;
