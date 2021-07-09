class App {
  constructor($target) {
    this.$target = $target;
  }

  render() {
    const $div = document.createElement('div');

    $div.innerText = '테스트입니다.';
    this.$target.appendChild($div);
  }
}

export default App;
