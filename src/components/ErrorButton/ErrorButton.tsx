import { Component, ReactNode } from 'react';

interface ErrorButtonState {
  shouldThrow: boolean;
}

class ErrorButton extends Component<object, ErrorButtonState> {
  constructor(props: object) {
    super(props);
    this.state = { shouldThrow: false };
  }

  handleClick = (): void => {
    this.setState({ shouldThrow: true });
  };

  render(): ReactNode {
    const { shouldThrow } = this.state;

    if (shouldThrow) {
      throw new Error('Test error triggered by user');
    }

    return (
      <button
        className="error-trigger-btn"
        type="button"
        onClick={this.handleClick}
      >
        Throw Error
      </button>
    );
  }
}

export default ErrorButton;
