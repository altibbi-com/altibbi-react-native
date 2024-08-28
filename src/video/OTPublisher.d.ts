export default OTPublisher;
declare class OTPublisher extends React.Component<any, any, any> {
    constructor(props: any, context: any);
    state: {
        initError: null;
        publisher: null;
        publisherId: any;
    };
    initComponent: () => void;
    componentEvents: {
        publisherStreamCreated: string;
        publisherStreamDestroyed: string;
        sessionConnected: string;
    } | undefined;
    componentEventsArray: string[] | undefined;
    otrnEventHandler: ((event: any) => void) | undefined;
    publisherEvents: {} | undefined;
    publisherStreamCreated: import("react-native").EmitterSubscription | undefined;
    publisherStreamDestroyed: import("react-native").EmitterSubscription | undefined;
    sessionConnected: import("react-native").EmitterSubscription | undefined;
    componentDidMount(): void;
    componentDidUpdate(previousProps: any): void;
    componentWillUnmount(): void;
    sessionConnectedHandler: () => void;
    createPublisher(): void;
    initPublisher(publisherProperties: any): void;
    publish(): void;
    getRtcStatsReport(): void;
    publisherStreamCreatedHandler: (stream: any) => void;
    publisherStreamDestroyedHandler: (stream: any) => void;
    setVideoTransformers(videoTransformers: any): void;
    render(): JSX.Element;
}
declare namespace OTPublisher {
    export let propTypes: any;
    export namespace defaultProps {
        let properties: {};
        let eventHandlers: {};
        let getRtcStatsReport: {};
    }
    export { OTContext as contextType };
}
import React from 'react';
import OTContext from './contexts/OTContext';
