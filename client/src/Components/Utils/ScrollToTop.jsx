import React from "react";

import { Button } from "react-bootstrap";
import { ChevronUp } from "react-bootstrap-icons";

class ScrollToTopButton extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      intervalId: 0,
      hasScrolled: false
    };
  }

  componentDidMount() {
    window.addEventListener("scroll", this.onScroll.bind(this));
  }

  onScroll() {
    if (
      window.pageYOffset > (this.props.depth || 500) &&
      !this.state.hasScrolled
    ) {
      this.setState({ ...this.state, hasScrolled: true });
    } else if (
      window.pageYOffset < (this.props.depth || 500) &&
      this.state.hasScrolled
    ) {
      this.setState({ ...this.state, hasScrolled: false });
    }
  }

  scrollStep() {
    if (window.pageYOffset === 0) {
      clearInterval(this.state.intervalId);
    }
    window.scroll(0, window.pageYOffset - (this.props.step || 150));
  }

  scrollToTop() {
    let intervalId = setInterval(
      this.scrollStep.bind(this),
      this.props.delay || 16.66
    );
    this.setState({ ...this.state, intervalId: intervalId });
  }

  render() {
    return (
      <>
        {this.state.hasScrolled && (
          <Button
            variant="info"
            className="scroll-button"
            onClick={this.scrollToTop.bind(this)}
          >
            <ChevronUp />
          </Button>
        )}
      </>
    );
  }
}

export default ScrollToTopButton;
