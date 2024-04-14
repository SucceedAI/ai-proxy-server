import axios from 'axios';
import { config } from '../config';
import { axiosError } from 'src/logger/axios-error.helper';

// User Service communicating directly with User's LemonSqueezy's account
export namespace UserService {
  const apiUrl = '';

  export const isUserLicenseKeyFound = async (licenseKey: string): Promise<boolean> => {
    // make request to Lemonsqueezy licensing and retrieve back if license was found or not

    const payload = {};

    try {
      const {
        data: { license: licenseKey },
      } = await axios.post(apiUrl, payload, {
        headers: {
          Authorization: `Bearer ${config.lemonSqueezyApiKey}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      return licenseKey ?? false;
    } catch (e: any) {
      axiosError(e, 'LemonSqueezy Error:');
      throw new Error('Error looking up user license');
    }

    return true;
  };
}
