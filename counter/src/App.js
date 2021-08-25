import Counter from './Counter.js';

class App {
  constructor($app) {
    this.$app = $app;
    this.state = [
      { id: 1, value: 0 },
      { id: 2, value: 0 },
    ];

    this.counter = new Counter({
      $app,
      initialState: this.state,
      onIncrease: (selectedId) => {
        const nextState = this.state.map((nowState) => {
          if (nowState.id === selectedId) {
            return {
              ...nowState,
              value: nowState.value + 1,
            };
          }

          return nowState;
        });

        this.setState(nextState);
      },
      onDecrease: (selectedId) => {
        const nextState = this.state.map((nowState) => {
          if (nowState.id === selectedId) {
            return {
              ...nowState,
              value: nowState.value - 1,
            };
          }

          return nowState;
        });

        this.setState(nextState);
      },
    });
  }

  setState(nextState) {
    this.state = nextState;
    this.counter.setState(this.state);
  }
}

export default App;
