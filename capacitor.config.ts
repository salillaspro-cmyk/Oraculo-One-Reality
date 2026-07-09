import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ohara.onepiece.oracle',
  appName: 'Oráculo de Ohara',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
