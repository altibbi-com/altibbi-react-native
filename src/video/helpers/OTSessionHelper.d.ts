export function sanitizeSessionEvents(sessionId: any, events: any): {};
export function sanitizeSessionOptions(options: any): {
    connectionEventsSuppressed: boolean;
    ipWhitelist: boolean;
    iceConfig: {};
    proxyUrl: string;
    useTextureViews: boolean;
    enableStereoOutput: boolean;
    androidOnTop: string;
    androidZOrder: string;
} | {
    connectionEventsSuppressed: boolean;
    ipWhitelist: boolean;
    iceConfig: {};
    proxyUrl: string;
    enableStereoOutput: boolean;
    useTextureViews?: undefined;
    androidOnTop?: undefined;
    androidZOrder?: undefined;
};
export function sanitizeSignalData(signal: any): {
    signal: {
        type: any;
        data: any;
        to: any;
    };
    errorHandler: any;
};
export function sanitizeCredentials(credentials: any): {};
export function getConnectionStatus(connectionStatus: any): "failed" | "connected" | "connecting" | "not connected" | "reconnecting" | "disconnecting";
export function isConnected(connectionStatus: any): boolean;
