/* eslint-disable prefer-destructuring */
/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
(() => {
  let yOffset = 0; // window.pageYOffset 대신 쓸 변수
  let prevScrollHeight = 0; // 현재 스크롤 위치(yOffset)보다 이전에 위치한 스크롤 섹션들의 스크롤 높이값의 합
  let currentScene = 0; // 현재 활성화된(눈 앞에 보고있는) 씬(scroll-section)
  let startNewScene = false; // 새로운 scene이 시작된 순간 true

  const sceneInfo = [
    {
      type: 'sticky',
      heightNum: 5, // 브라우저 높이의 5배로 scrollHeight 세팅
      scrollHeight: 0,
      objs: {
        container: document.querySelector('#scroll-section-0'),
        messageA: document.querySelector('#scroll-section-0 .main-message.a'),
        messageB: document.querySelector('#scroll-section-0 .main-message.b'),
        messageC: document.querySelector('#scroll-section-0 .main-message.c'),
        messageD: document.querySelector('#scroll-section-0 .main-message.d'),
      },
      values: {
        messageAOpacityIn: [0, 1, { start: 0.1, end: 0.2 }],
        messageATranslateYIn: [20, 0, { start: 0.1, end: 0.2 }],
        // messageBOpacityIn: [0, 1, { start: 0.3, end: 0.4 }],
        messageAOpacityOut: [1, 0, { start: 0.25, end: 0.3 }],
        messageATranslateYOut: [0, -20, { start: 0.25, end: 0.3 }],
        // messageBOpacityOut: [0, 1, { start: 0.3, end: 0.4 }],
        // messageCOpacity: [0, 1, { start: 0.3, end: 0.4 }],
        // messageDOpacity: [0, 1, { start: 0.3, end: 0.4 }],
      },
    },
    {
      type: 'normal',
      heightNum: 5, // 브라우저 높이의 5배로 scrollHeight 세팅
      scrollHeight: 0,
      objs: {
        container: document.querySelector('#scroll-section-1'),
      },
    },
    {
      type: 'sticky',
      heightNum: 5, // 브라우저 높이의 5배로 scrollHeight 세팅
      scrollHeight: 0,
      objs: {
        container: document.querySelector('#scroll-section-2'),
      },
    },
    {
      type: 'sticky',
      heightNum: 5, // 브라우저 높이의 5배로 scrollHeight 세팅
      scrollHeight: 0,
      objs: {
        container: document.querySelector('#scroll-section-3'),
      },
    },
  ];

  const setLayout = () => {
    // 각 스크롤 섹션 높이 세팅
    sceneInfo.forEach((scene) => {
      scene.scrollHeight = scene.heightNum * window.innerHeight;
      scene.objs.container.style.height = `${scene.scrollHeight}px`;
    });

    yOffset = window.pageYOffset;
    let totalScrollHeight = 0;

    for (let i = 0; i < sceneInfo.length; i++) {
      totalScrollHeight += sceneInfo[i].scrollHeight;

      if (totalScrollHeight >= yOffset) {
        currentScene = i;
        break;
      }
    }

    document.body.setAttribute('id', `show-scene-${currentScene}`);
  };

  function calcValues(values, currentYOffset) {
    let rv;
    const { scrollHeight } = sceneInfo[currentScene];
    // 현재 씬(스크롤 섹션)에서 스크롤 된 범위를 비율로 구하기
    const scrollRatio = currentYOffset / scrollHeight;

    if (values.length === 3) {
      // start ~ end 사이에 애니메이션 실행
      const partScrollStart = values[2].start * scrollHeight;
      const partScrollEnd = values[2].end * scrollHeight;
      const partScrollHeight = partScrollEnd - partScrollStart;

      if (currentYOffset >= partScrollStart && currentYOffset <= partScrollEnd) {
        rv = (currentYOffset - partScrollStart) / partScrollHeight * (values[1] - values[0]) + values[0];
      } else if (currentYOffset < partScrollStart) {
        rv = values[0];
      } else if (currentYOffset > partScrollEnd) {
        rv = values[1];
      }
    } else {
      // 비율을 Opacity의 범위에 따라 비율을 구하기
      // 만약 Opacity가 200에서 900이라면 values[200, 900]
      // values[0]을 더해주는 이유는 초기값 설정 때문. 스크롤 움직임에 따라 200 ~ 900으로 나타난다.
      // 현재 씬(스크롤 섹션)에 스크롤이 움직일 때마다 해당 위치의 구할 수 있다.
      // 이걸 Opacity 설정해준다.
      rv = scrollRatio * (values[1] - values[0]) + values[0];
    }

    return rv;
  }

  function playAnimation() {
    const { objs, values, scrollHeight } = sceneInfo[currentScene];
    // 현재 씬의 yOffset: yOffset - 이미 지나간 스크롤 높이
    const currentYOffset = yOffset - prevScrollHeight;
    // currentYOffset / 현재 씬의 scrollHeight;
    const scrollRatio = currentYOffset / scrollHeight;

    switch (currentScene) {
      case 0:
        if (scrollRatio <= 0.22) {
          // fade in
          objs.messageA.style.opacity = calcValues(values.messageAOpacityIn, currentYOffset);
          objs.messageA.style.transform = `translateY(${calcValues(values.messageATranslateYIn, currentYOffset)}%)`;
        } else {
          // fade out
          objs.messageA.style.opacity = calcValues(values.messageAOpacityOut, currentYOffset);
          objs.messageA.style.transform = `translateY(${calcValues(values.messageATranslateYOut, currentYOffset)}%)`;
        }
        break;
      case 1:
        break;
      case 2:
        break;
      case 3:
        break;
    }
  }

  function scrollLoop() {
    startNewScene = false;
    prevScrollHeight = 0;

    for (let i = 0; i < currentScene; i++) {
      prevScrollHeight += sceneInfo[i].scrollHeight;
    }

    if (yOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
      startNewScene = true;
      currentScene++;
      document.body.setAttribute('id', `show-scene-${currentScene}`);
    }

    if (yOffset < prevScrollHeight) {
      startNewScene = true;

      if (currentScene === 0) { // 브라우저 바운스 효과로 인해 마이너스가 되는 것을 방지(모바일)
        return;
      }

      currentScene--;
      document.body.setAttribute('id', `show-scene-${currentScene}`);
    }

    if (startNewScene) {
      return;
    }

    playAnimation();
  }

  window.addEventListener('resize', setLayout);
  window.addEventListener('scroll', () => {
    yOffset = window.pageYOffset;
    scrollLoop();
  });
  window.addEventListener('load', setLayout);
})();
