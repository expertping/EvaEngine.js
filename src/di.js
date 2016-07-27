import {
  RuntimeException
} from './exceptions';
import { ServiceProvider } from './services/providers';
import constitute from 'constitute';

let container = new constitute.Container();
let bound = {};

export default class DI {
  static getContainer() {
    return container;
  }

  static getBound() {
    return bound;
  }

  static get(service) {
    if (typeof service !== 'string') {
      return container.constitute(service);
    }

    if (!bound[service]) {
      throw new RuntimeException(`Service ${service} not bound yet`);
    }
    return container.constitute(bound[service]);
  }

  static bindClass(...args) {
    bound[args[0]] = args[1];
    return container.bindClass(...args);
  }

  static bindValue(...args) {
    bound[args[0]] = args[1];
    return container.bindValue(...args);
  }

  static bindMethod(...args) {
    bound[args[0]] = args[1];
    return container.bindMethod(...args);
  }

  static reset() {
    container = new constitute.Container();
    bound = {};
  }

  /**
   * @param {Array} providers
   * @param {EvaEngine} engine
   */
  static registerServiceProviders(providers = [], engine) {
    for (const providerClass of providers) {
      DI.registerService(providerClass, engine);
    }
  }

  /**
   * @param {constructor} ProviderClass
   * @param {EvaEngine} engine
   */
  static registerService(ProviderClass, engine) {
    const provider = new ProviderClass(engine);
    if (!(provider instanceof ServiceProvider)) {
      throw new RuntimeException(`Input provider ${provider.name} not service provider`);
    }
    provider.register();
  }

  static registerMockedProviders(providers, configPath) {
    const mockEngine = {
      getMeta: () => ({
        configPath
      })
    };
    DI.registerServiceProviders(providers, mockEngine);
  }
}
