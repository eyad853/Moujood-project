import { Preferences } from '@capacitor/preferences';
import { Device } from '@capacitor/device';

export const getDeviceInfo = async () => {
  const deviceToken = (await Preferences.get({ key: 'pushToken' }))?.value;
  const deviceId = (await Device.getId()).identifier;
  return { deviceToken, deviceId };
};
