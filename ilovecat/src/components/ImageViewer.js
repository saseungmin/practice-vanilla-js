const IMAGE_PATH_PREFIX = 'https://fe-dev-matching-2021-03-serverlessdeploymentbuck-t3kpj3way537.s3.ap-northeast-2.amazonaws.com/public';

class ImageViewer {
  constructor({ $app, initialState }) {
    this.$app = $app;
    this.state = initialState;
    this.$target = document.createElement('div');
    this.$target.className = 'Modal ImageViewer';

    this.$app.appendChild(this.$target);

    this.render();
    this.bindClickEvent();
  }

  bindClickEvent() {
    // FIXME - 수정 필요.
    this.$target.addEventListener('click', (e) => {
      if (this.state && this.$target === e.target) {
        this.$target.style.display = 'none';
      }
    });
  }

  setState(nextState) {
    this.state = nextState;
    this.render();
  }

  render() {
    const imgTemplate = this.state ? `<img src="${IMAGE_PATH_PREFIX}${this.state}">` : '';

    this.$target.innerHTML = `
      <div class="content">
        ${imgTemplate}
      </div>
    `;

    this.$target.style.display = this.state ? 'block' : 'none';
  }
}

export default ImageViewer;
