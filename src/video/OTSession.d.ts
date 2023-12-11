import { Component } from 'react';

declare class OTSession extends Component<any, any> {
  constructor(props: any);
  state: {
    sessionInfo: any;
  };
  otrnEventHandler: (event: any) => void;
  initComponent: () => void;
  sanitizedCredentials: {};
  componentDidMount(): void;
  componentDidUpdate(previousProps: any): void;
  componentWillUnmount(): void;
  createSession(credentials: any, sessionOptions: any): void;
  disconnectSession(): void;
  getSessionInfo(): any;
  getCapabilities(): Promise<any>;
  reportIssue(): Promise<any>;
  signal(signal: any): void;
  forceMuteAll(excludedStreamIds: any): any;
  forceMuteStream(streamId: any): any;
  disableForceMute(): any;
  render(): JSX.Element;
}

declare namespace OTSession {
  let propTypes: {
    apiKey: any;
    sessionId: any;
    token: any;
    children: any;
    style: any;
    eventHandlers: any;
    options: any;
    signal: any;
  };

  let defaultProps: {
    eventHandlers: {};
    options: {};
    signal: {};
    style: {
      flex: number;
    };
  };
}

export default OTSession;
