import { Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

/**
 * Render sits behind Cloudflare, so `req.ip` is the proxy address.
 * Cloudflare sets `True-Client-IP` to the real client address.
 */
@Injectable()
export class ClientIpThrottlerGuard extends ThrottlerGuard {
  protected getTracker(req: Record<string, any>): Promise<string> {
    const clientIp: unknown = req.headers?.['true-client-ip'];
    return Promise.resolve(typeof clientIp === 'string' ? clientIp : req.ip);
  }
}
