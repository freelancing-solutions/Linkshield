// Mock for until-async to avoid ES module syntax issues
module.exports = {
  until: async function(condition, options = {}) {
    const { timeout = 5000, interval = 50 } = options;
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
      if (await condition()) {
        return;
      }
      await new Promise(resolve => setTimeout(resolve, interval));
    }
    
    throw new Error('until condition was not met within timeout');
  }
};