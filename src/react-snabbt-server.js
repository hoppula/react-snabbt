import React from 'react';

class SnabbtServer extends React.Component {
  render() {
    if (Array.isArray(this.props.children)) {
      return (
        <div className="react-snabbt-container">
          {
            React.Children.map(this.props.children, (child) => {
              return React.cloneElement(child);
            })
          }
        </div>
      );
    } else {
      const component = React.Children.only(this.props.children);
      return React.cloneElement(component);
    }
  }
}

export default SnabbtServer;
