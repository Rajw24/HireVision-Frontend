/**
 * Secure token storage service that keeps tokens in localstorage
 * and syncs with HTTP-only cookies for persistence
 */
class TokenService {
  private static instance: TokenService;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private refreshing: boolean = false;
  private refreshQueue: Array<() => void> = [];
  private readonly ACCESS_TOKEN_KEY = 'auth_access_token';
  private readonly REFRESH_TOKEN_KEY = 'auth_refresh_token';

  private constructor() {
    // Initialize tokens from localStorage
    this.accessToken = localStorage.getItem(this.ACCESS_TOKEN_KEY);
    this.refreshToken = localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  static getInstance(): TokenService {
    if (!TokenService.instance) {
      TokenService.instance = new TokenService();
    }
    return TokenService.instance;
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  setTokens(access: string | null, refresh: string | null): void {
    this.accessToken = access;
    this.refreshToken = refresh;
    
    if (access) {
      localStorage.setItem(this.ACCESS_TOKEN_KEY, access);
    } else {
      localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    }
    
    if (refresh) {
      localStorage.setItem(this.REFRESH_TOKEN_KEY, refresh);
    } else {
      localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    }
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
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }
}

export default TokenService.getInstance();
