/**
 * @copyright   (c) Pierre-Henry Soria <https://ph7.me>
 * @license     MIT <https://opensource.org/license/mit>
 */

import axios from 'axios';
import { config } from '../config';
import { axiosError } from '../logger/axios-error.helper';
import { LicenseStatus } from './license.type';

// License Service communicating directly with Licensing LemonSqueezy's user account
export namespace LicenseService {
  const apiUrl = 'https://api.lemonsqueezy.com/v1/license-keys/';

  export const isUserLicenseKeyValid = async (licenseId: string, licenseKey: string): Promise<boolean> => {
    // make request to Lemonsqueezy licensing and retrieve back if license was found or not
    try {
      const {
        data: {
          attributes: { key: userLicenseKey },
          status,
        },
      } = await axios.get(apiUrl + licenseId, {
        headers: {
          Authorization: `Bearer ${config.lemonSqueezyApiKey}`,
          Accept: 'application/vnd.api+json',
          'Content-Type': 'application/vnd.api+json',
        },
      });

      return status === LicenseStatus.ACTIVE && userLicenseKey === licenseKey;
    } catch (e: any) {
      axiosError(e, 'LemonSqueezy Error:');

      return false;
    }
  };
}
