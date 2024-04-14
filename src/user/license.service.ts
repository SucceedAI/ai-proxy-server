import axios from 'axios';
import { config } from '../config';
import { axiosError } from 'src/logger/axios-error.helper';

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

      return status === 'active' && userLicenseKey === licenseKey;
    } catch (e: any) {
      axiosError(e, 'LemonSqueezy Error:');
      throw new Error('Error looking up user license');
    }
  };
}
