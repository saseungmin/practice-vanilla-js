class Nodes {
  constructor({
    $app, initialState, onClick, onBackClick,
  }) {
    this.$app = $app;
    this.state = initialState;
    this.$target = document.createElement('div');
    this.$target.className = 'Nodes';
    this.handleClick = onClick;
    this.handleBackClick = onBackClick;

    this.$app.appendChild(this.$target);
    this.render();
    this.bindClickEvent();
  }

  bindClickEvent() {
    this.$target.addEventListener('click', (e) => {
      const $node = e.target.closest('.Node');

      if (!$node) {
        return;
      }

      const { id } = $node.dataset;

      if (!id) {
        this.handleBackClick();
      }

      const selectNode = this.state.nodes.find((node) => node.id === id);

      this.handleClick(selectNode);
    });
  }

  setState(nextState) {
    this.state = nextState;
    this.render();
  }

  render() {
    const nodeTemplate = this.state.nodes.map(({ id, type, name }) => {
      const imagePath = type === 'DIRECTORY' ? './assets/directory.png' : './assets/file.png';

      return `
          <div class="Node" data-id="${id}" >
            <img src="${imagePath}" />
            <div>${name}</div>
          </div>
        `;
    }).join('');

    if (this.state.isRoot) {
      this.$target.innerHTML = nodeTemplate;
    } else {
      this.$target.innerHTML = `
        <div class="Node" data-id="">
          <img src="./assets/prev.png">
        </div>
        ${nodeTemplate}
      `;
    }
  }
}

export default Nodes;
