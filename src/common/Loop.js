class Loop {
  infinity(fn, delay) {
    const callIt = async () => {
      await fn();
      setTimeout(callIt, delay);
    };
    callIt();
  }
}

module.exports = Loop;
