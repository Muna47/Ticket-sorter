const logger = (...args) => {
  console.log(new Date().toISOString(), ...args);
};

module.exports = logger;
