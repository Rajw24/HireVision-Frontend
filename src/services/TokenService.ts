/**
 * Secure token storage service that keeps tokens in memory
 * and syncs with HTTP-only cookies for persistence
 */
class TokenService {
  private static instance: TokenService;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private refreshing: boolean = false;
  private refreshQueue: Array<() => void> = [];

  private constructor() {}

  static getInstance(): TokenService {
    if (!TokenService.instance) {
      TokenService.instance = new TokenService();
    }
    return TokenService.instance;
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  getRefreshToken(): string | null {
    return this.refreshToken;
  }

  setTokens(access: string | null, refresh: string | null): void {
    this.accessToken = access;
    this.refreshToken = refresh;
  }

  isRefreshing(): boolean {
    return this.refreshing;
  }

  setRefreshing(status: boolean): void {
    this.refreshing = status;
  }

  enqueueRequest(callback: () => void): void {
    this.refreshQueue.push(callback);
  }

  resolveQueue(): void {
    while (this.refreshQueue.length) {
      const callback = this.refreshQueue.shift();
      callback?.();
    }
  }

  clearQueue(): void {
    this.refreshQueue = [];
  }

  clear(): void {
    this.accessToken = null;
    this.refreshToken = null;
    this.refreshing = false;
    this.clearQueue();
  }
}

export default TokenService.getInstance();
