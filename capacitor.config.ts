import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.hidayawear.app',
  appName: 'Hidaya Wear',
  webDir: 'out',
  server: {
    url: 'https://my-store-iota-blush.vercel.app',
    cleartext: false,
  },
  android: {
    allowMixedContent: false,
  },
};

export default config;
