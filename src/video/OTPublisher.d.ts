export default OTPublisher;
declare class OTPublisher extends Component<any, any, any> {
    constructor(props: any, context: any);
    state: {
        initError: any;
        publisher: any;
        publisherId: any;
    };
    initComponent: () => void;
    componentEvents: {
        sessionConnected: string;
    };
    componentEventsArray: string[];
    otrnEventHandler: (event: any) => void;
    publisherEvents: {};
    sessionConnected: import("react-native").EmitterSubscription;
    componentDidMount(): void;
    componentDidUpdate(previousProps: any): void;
    componentWillUnmount(): void;
    sessionConnectedHandler: () => void;
    createPublisher(): void;
    initPublisher(): void;
    publish(): void;
    getRtcStatsReport(): void;
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
import { Component } from 'react';
import OTContext from './contexts/OTContext';
