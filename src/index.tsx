import OT, {
  OTPublisher,
  OTSession,
  OTSubscriber,
  OTSubscriberView,
} from './video';

export {
  OTSession as TBISession,
  OTPublisher as TBIPublisher,
  OTSubscriber as TBISubscriber,
  OTSubscriberView as TBISubscriberView,
  OT as TBIVideo,
};

export { default as AltibbiChat } from '@sendbird/chat';

export {
  BaseChannel,
  ChannelType,
  type MetaCounter,
  type MetaData,
  PushTriggerOption,
  RestrictedUser,
  User,
  ConnectionHandler,
} from '@sendbird/chat';

export {
  GroupChannel,
  GroupChannelHandler,
  GroupChannelModule,
} from '@sendbird/chat/groupChannel';
export {
  BaseMessage,
  ReactionEvent,
  ThreadInfoUpdateEvent,
} from '@sendbird/chat/message';

export {
  uploadMedia,
  getUser,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getConsultationList,
  getConsultationInfo,
  getLastConsultation,
  createConsultation,
  deleteConsultation,
  cancelConsultation,
  getPrescription,
} from './connection';

export { TBIConstants, init } from './service';

export {
  TBISocket,
  TBISocketChannel,
  TBISocketMember,
  TBISocketEvent,
  type TBISocketAuthorizerResult,
} from './scoket';

export type {
  ResponseType,
  MediumType,
  BloodType,
  MaritalStatus,
  BoolString,
  GenderType,
  UserType,
  MediaType,
  ChatData,
  ChatHistory,
  ChatConfig,
  VoipConfig,
  Recommendation,
  RecommendationData,
  RecommendationLab,
  RecommendationLabItem,
  RecommendationDrug,
  RecommendationFdaDrug,
  RecommendationICD10,
  RecommendationSymptom,
  RecommendationDiagnosis,
  RecommendationFollowUp,
  RecommendationDoctorReferral,
  RecommendationPostCallAnswer,
  ConsultationType,
} from './types';
export {
  materialStatusArray,
  bloodTypeArray,
  boolStringArray,
  genderTypeArray,
  MediumArray,
} from './data';


