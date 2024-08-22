declare class OTSubscriber extends React.Component<any, any, any> {
    constructor(props: any, context: any);
    state: {
        streams: never[];
        subscribeToSelf: any;
    };
    componentEvents: {
        streamDestroyed: string;
        streamCreated: string;
        captionReceived: string;
        publisherStreamCreated: string;
        publisherStreamDestroyed: string;
    };
    componentEventsArray: string[];
    otrnEventHandler: (event: any) => void;
    initComponent: () => void;
    streamCreated: import("react-native").EmitterSubscription | undefined;
    streamDestroyed: import("react-native").EmitterSubscription | undefined;
    publisherStreamCreated: import("react-native").EmitterSubscription | undefined;
    publisherStreamDestroyed: import("react-native").EmitterSubscription | undefined;
    componentDidUpdate(): void;
    componentWillUnmount(): void;
    streamCreatedHandler: (stream: any) => void;
    streamDestroyedHandler: (stream: any) => void;
    publisherStreamCreatedHandler: (stream: any) => void;
    publisherStreamDestroyedHandler: (stream: any) => void;
    getRtcStatsReport(): void;
    render(): any;
}
declare namespace OTSubscriber {
    export let propTypes: any;
    export namespace defaultProps {
        let properties: {};
        let eventHandlers: {};
        let streamProperties: {};
        let containerStyle: {};
        let subscribeToSelf: boolean;
        let getRtcStatsReport: {};
        let subscribeToCaptions: boolean;
    }
    export { OTContext as contextType };
}
export default OTSubscriber;
import React from 'react';
import OTContext from './contexts/OTContext';
