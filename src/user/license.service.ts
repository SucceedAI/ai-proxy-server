/**
 * @copyright   (c) Pierre-Henry Soria <https://ph7.me>
 * @license     MIT <https://opensource.org/license/mit>
 */

import axios from 'axios';
import { config } from '../config/index.ts';
import { axiosError } from '../logger/axios-error.helper.ts';
import { LicenseStatus } from './license.type.ts';

// License Service communicating directly with Licensing LemonSqueezy's user account
const apiUrl = 'https://api.lemonsqueezy.com/v1/license-keys/';

export const isUserLicenseKeyValid = async (licenseId: string, licenseKey: string): Promise<boolean> => {
  if (!/^\d+$/.test(licenseId) || !licenseKey.length) {
    return false;
  }

  try {
    const response = await axios.get(apiUrl + licenseId, {
      timeout: 5000,
      headers: {
        Authorization: `Bearer ${config.lemonSqueezyApiKey}`,
        Accept: 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
      },
    });
    // Lemon Squeezy wraps the resource inside the response body's `data` member.
    const attributes = response.data?.data?.attributes;
    return attributes?.status === LicenseStatus.ACTIVE && attributes?.key === licenseKey;
  } catch (e: any) {
    axiosError(e, 'LemonSqueezy Error:');

    return false;
  }
};
