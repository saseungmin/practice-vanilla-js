class Breadcrumb {
  constructor({ $app, initialState, onClick }) {
    this.$app = $app;
    this.state = initialState;
    this.$target = document.createElement('div');
    this.$target.className = 'Breadcrumb';
    this.handleClick = onClick;

    this.$app.appendChild(this.$target);
    this.render();
    this.bindClickEvent();
  }

  bindClickEvent() {
    this.$target.addEventListener('click', (e) => {
      const $naveItem = e.target.closest('.nave-item');

      if ($naveItem) {
        const { index } = $naveItem.dataset;

        this.handleClick(index ? parseInt(index, 10) : null);
      }
    });
  }

  setState(nextState) {
    this.state = nextState;
    this.render();
  }

  render() {
    const breadcrumb = this.state.map(({ name }, index) => `
        <div class="nave-item" data-index="${index}">${name}</div>
      `).join('');

    this.$target.innerHTML = `
      <div class="nave-item" data-index="" >root</div>
      ${breadcrumb}
    `;
  }
}

export default Breadcrumb;
