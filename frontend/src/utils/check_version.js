import { App } from '@capacitor/app';
import { fetchAppVersion } from '../api/app';

const getAppVersion = async () => {
  const info = await App.getInfo();
  return info.version; // e.g., "1.0.0"
};

const isUpdateRequired = (installed, latest) => {
  const a = installed.split('.').map(Number);
  const b = latest.split('.').map(Number);

  for (let i = 0; i < b.length; i++) {
    if ((a[i] || 0) < (b[i] || 0)) return true;
    if ((a[i] || 0) > (b[i] || 0)) return false;
  }

  return false;
};

export const checkForAppUpdate = async () => {
  try {
    const installedVersion = await getAppVersion();
    const serverData = await fetchAppVersion();

    if (!serverData) return { update: false };

    const needsUpdate = isUpdateRequired(
      installedVersion,
      serverData
    );

    return {
      update: needsUpdate,
      androidUrl: import.meta.env.ANDROIDURL,
    };
  } catch (err) {
    console.log(err);
    return { update: false };
  }
};