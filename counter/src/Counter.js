class Counter {
  constructor({
    $app, initialState, onIncrease, onDecrease,
  }) {
    this.state = initialState;
    this.$app = $app;
    this.$target = document.createElement('div');
    this.$target.className = 'counters';
    this.handleIncrease = onIncrease;
    this.handleDecrease = onDecrease;

    this.$app.appendChild(this.$target);
    this.render();
    this.bindClickEvent();
  }

  bindClickEvent() {
    this.$target.addEventListener('click', (e) => {
      const $counter = e.target.closest('.counter');

      const { id } = $counter.dataset;
      const { className } = e.target;

      const selectedId = parseInt(id, 10);

      if (className === 'up-button') {
        this.handleIncrease(selectedId);
      }

      if (className === 'down-button') {
        this.handleDecrease(selectedId);
      }
    });
  }

  setState(nextState) {
    this.state = nextState;
    this.render();
  }

  render() {
    const counterTemplate = this.state.map(({ id, value }) => `
      <div class="counter" data-id="${id}">
        <input class="input" value="${value}" />
        <button class="up-button">🔼</button>
        <button class="down-button">🔽</button>
      </div>
    `).join('');

    this.$target.innerHTML = counterTemplate;
  }
}

export default Counter;
