import { Preferences } from '@capacitor/preferences';
import { Device } from '@capacitor/device';

const waitForPushToken = (timeoutMs = 10000) => {
  return new Promise((resolve) => {
    const interval = setInterval(async () => {
      const result = await Preferences.get({ key: 'pushToken' });
      if (result?.value) {
        clearInterval(interval);
        clearTimeout(timeout);
        resolve(result.value);
      }
    }, 500);

    // Give up after timeout — resolve with null so flow continues
    const timeout = setTimeout(() => {
      clearInterval(interval);
      resolve(null); 
    }, timeoutMs);
  });
};

export const getDeviceInfo = async () => {
  const deviceId = (await Device.getId()).identifier;

  // Try immediately first
  let deviceToken = (await Preferences.get({ key: 'pushToken' }))?.value;

  // If not ready yet, poll for up to 10 seconds
  if (!deviceToken) {
    deviceToken = await waitForPushToken(10000);
  }

  return { deviceToken, deviceId };
};

