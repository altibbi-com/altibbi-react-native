export function sanitizeSubscriberEvents(events: any): {};
export function sanitizeProperties(properties: any): {
    subscribeToAudio: any;
    subscribeToVideo: any;
    subscribeToCaptions: any;
    preferredResolution: {
        width: number;
        height: number;
    };
    preferredFrameRate: number;
    audioVolume: number;
};
export function sanitizeFrameRate(frameRate: any): 1 | 7 | 15 | 30 | 32767;
export function sanitizeResolution(resolution: any): {
    width: number;
    height: number;
};
export function sanitizeAudioVolume(audioVolume: any): number;
