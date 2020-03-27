import React from "react";

class TryCatch extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <h3>
          Something went wrong: {this.props.message || ""} Please refresh the
          page and try again.
        </h3>
      );
    }

    return this.props.children;
  }
}

export default TryCatch;
