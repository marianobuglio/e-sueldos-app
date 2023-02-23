import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'e-Sueldos',
  webDir: 'www',
  bundledWebRuntime: false,
  server: {
    androidScheme: "http",
    cleartext: true,
    allowNavigation: [
      "http://e07c-201-190-175-17.ngrok.io/api/*"
    ]
  }
};

export default config;
