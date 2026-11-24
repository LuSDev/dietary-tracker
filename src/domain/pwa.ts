export type InstallPlatform =
  | 'ios-safari'
  | 'ios-other'
  | 'android-chrome'
  | 'android-other'
  | 'desktop-chromium'
  | 'desktop-safari'
  | 'desktop-other';

/**
 * Returns true when the app is running as an installed PWA (home screen / standalone window)
 * rather than inside a regular browser tab.
 */
export function isStandalonePWA(): boolean {
  if (typeof window === 'undefined') return false;

  const isStandaloneMedia = window.matchMedia('(display-mode: standalone)').matches;
  const isIOSStandalone =
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
  const isAndroidTWA = document.referrer.startsWith('android-app://');

  return isStandaloneMedia || isIOSStandalone || isAndroidTWA;
}

/**
 * Detects the current OS and browser family to display tailored PWA installation steps.
 */
export function detectInstallPlatform(): InstallPlatform {
  if (typeof window === 'undefined') return 'desktop-other';

  const ua = window.navigator.userAgent;
  const platform = window.navigator.platform ?? '';
  const maxTouchPoints = window.navigator.maxTouchPoints ?? 0;

  const isIOS =
    /iPad|iPhone|iPod/.test(ua) || (platform === 'MacIntel' && maxTouchPoints > 1);
  const isAndroid = /Android/i.test(ua);

  const isFirefox = /Firefox|FxiOS/i.test(ua);
  const isEdge = /Edg|EdgiOS|EdgA/i.test(ua);
  const isOpera = /OPR|OPiOS/i.test(ua);
  const isSamsung = /SamsungBrowser/i.test(ua);
  const isChrome = (/Chrome|CriOS/i.test(ua) && !isEdge && !isOpera && !isSamsung);
  const isSafari = /Safari/i.test(ua) && !isChrome && !isFirefox && !isEdge && !isOpera && !isSamsung;

  if (isIOS) {
    return isSafari ? 'ios-safari' : 'ios-other';
  }

  if (isAndroid) {
    return isChrome || isEdge || isSamsung || isOpera ? 'android-chrome' : 'android-other';
  }

  if (isChrome || isEdge || isOpera) {
    return 'desktop-chromium';
  }

  if (isSafari) {
    return 'desktop-safari';
  }

  return 'desktop-other';
}
