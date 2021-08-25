import Counter from './Counter.js';

import { setIncrease, setDecrease } from './utils.js';

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
        this.setState(setIncrease(this.state, selectedId));
      },
      onDecrease: (selectedId) => {
        this.setState(setDecrease(this.state, selectedId));
      },
    });
  }

  setState(nextState) {
    this.state = nextState;
    this.counter.setState(this.state);
  }
}

export default App;
