export const setIncrease = (state, id) => state.map((nowState) => {
  if (nowState.id === id) {
    return {
      ...nowState,
      value: nowState.value + 1,
    };
  }

  return nowState;
});

export const setDecrease = (state, id) => state.map((nowState) => {
  if (nowState.id === id) {
    return {
      ...nowState,
      value: nowState.value - 1,
    };
  }

  return nowState;
});
