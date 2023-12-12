declare class OTSubscriber extends Component<any, any, any> {
    constructor(props: any, context: any);
    state: {
        streams: any[];
        subscribeToSelf: any;
    };
    componentEvents: {
        streamDestroyed: string;
        streamCreated: string;
        captionReceived: string;
    };
    componentEventsArray: string[];
    otrnEventHandler: (event: any) => void;
    initComponent: () => void;
    streamCreated: import("react-native").EmitterSubscription;
    streamDestroyed: import("react-native").EmitterSubscription;
    componentDidUpdate(): void;
    componentWillUnmount(): void;
    streamCreatedHandler: (stream: any) => void;
    streamDestroyedHandler: (stream: any) => void;
    getRtcStatsReport(streamId: any): void;
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
import { Component } from 'react';
import OTContext from './contexts/OTContext';
