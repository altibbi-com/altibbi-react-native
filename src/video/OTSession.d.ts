import React from 'react';
import PropTypes from 'prop-types';
declare class OTSession extends React.Component<any, any, any> {
    constructor(props: any);
    state: {
        sessionInfo: null;
    };
    otrnEventHandler: (event: any) => void;
    initComponent: () => void;
    sanitizedCredentials: {} | undefined;
    componentDidMount(): void;
    componentDidUpdate(previousProps: any): void;
    componentWillUnmount(): void;
    createSession(credentials: any, sessionOptions: any, encryptionSecret: any): void;
    disconnectSession(): void;
    getSessionInfo(): null;
    getCapabilities(): Promise<any>;
    reportIssue(): Promise<any>;
    signal(signal: any): void;
    forceMuteAll(excludedStreamIds: any): any;
    forceMuteStream(streamId: any): any;
    disableForceMute(): any;
    setEncryptionSecret(secret: any): void;
    render(): JSX.Element;
}
declare namespace OTSession {
  namespace propTypes {
    let apiKey: PropTypes.Validator<string>;
    let sessionId: PropTypes.Validator<string>;
    let token: PropTypes.Validator<string>;
    let children: PropTypes.Requireable<NonNullable<PropTypes.ReactElementLike | (PropTypes.ReactElementLike | null | undefined)[] | null | undefined>>;
    let style: any;
    let eventHandlers: PropTypes.Requireable<object>;
    let options: PropTypes.Requireable<object>;
    let signal: PropTypes.Requireable<object>;
    let encryptionSecret: PropTypes.Requireable<string>;
  }

  namespace defaultProps {
    // Declare the types (no initialization)
    let eventHandlers: object;
    let options: object;
    let signal: object;
    let style: {
      flex: number;
    };
  }
}
export default OTSession;
