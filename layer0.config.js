module.exports = {
  connector: '@layer0/next',
  prerenderConcurrency: 1,
  backends: {
    plausible: {
      domainOrIp: 'plausible.io',
      hostHeader: 'plausible.io',
    },
  },
};
