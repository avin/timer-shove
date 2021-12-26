class Config {
  routes = {
    init: '/',
    fail: '/fail',
    sbol: '/sbol',
    smsCode: '/sms',
    reInit: '/reInit',
    payment: '/payment',
    finish: '/finish',
    logout: '/logout',
    expired: '/expired',
    dispatcher: '/dispatcher',
    bindingCvc: '/bindingCvc',
    paymentBinding: '/paymentBinding',
    inactiveSession: '/inactiveSession',
    bindingSbrfSpasiboLoyalty: '/bindingSbrfSpasiboLoyalty',
  };

  /**
   * Extend config params
   * @param newConfigParams
   */
  extendConfig(newConfigParams: Partial<Config>) {
    Object.assign(this, newConfigParams);
  }
}

const config = new Config();

export default config;
