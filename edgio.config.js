module.exports = {
  connector: '@edgio/next',
  prerenderConcurrency: 1,
  backends: {
    plausible: {
      domainOrIp: 'plausible.io',
      hostHeader: 'plausible.io',
    },
  },
};
