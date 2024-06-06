import { TBIConstants } from './service';
import type {
  ConsultationType,
  MediaType,
  ResponseType,
  UserType,
} from './types';

interface MethodsObject {
  get: string;
  post: string;
  delete: string;
  put: string;
}

interface ConsultationObject {
  question: string;
  medium: string;
  user_id: number;
  mediaIds?: string[];
  parent_consultation_id?: number;
}

interface RequestParamsInterface {
  method: string;
  data?: Record<any, any>;
  endPoint: string;
  path?: string;
  type?: string;
  fileName?: string;
  download?: boolean;
}

interface RequestInterface {
  method: string;
  headers: Record<string, string>;
  body: string | FormData | undefined;
}

export const Methods: MethodsObject = {
  get: 'GET',
  post: 'POST',
  delete: 'DELETE',
  put: 'PUT',
};

const fetchData = (
  url: string,
  request: RequestInterface,
  timeout: number
): Promise<Response> | any =>
  Promise.race([
    fetch(url, request).catch((error) => {
      throw Error(`Fetch Error  ${error}`);
    }),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('request timeout')), timeout)
    ),
  ]).catch((e) => {
    throw Error(`Fetch Error : ${e}`);
  });

export const request = async ({
  method,
  data,
  endPoint,
  path,
  type,
  fileName,
  download,
}: RequestParamsInterface) => {
  if (!TBIConstants.baseURL) {
    return {
      message: 'Add your baseURL to Init',
    };
  }

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${TBIConstants.token}`,
    'accept-language': TBIConstants.language,
  };

  let url = `${TBIConstants.baseURL}/v1/${endPoint}`;
  let body;
  if (method === Methods.get) {
    url = url + '?' + new URLSearchParams(data).toString();
  } else if (path) {
    const formData = new FormData();
    formData.append('file', {
      uri: path,
      type: type,
      name: fileName,
    } as any);
    body = formData;
    headers['Content-Type'] = 'multipart/form-data';
  } else {
    if (data && data.expand) {
      url = url + '?' + new URLSearchParams({ expand: data.expand }).toString();
    }
    body = JSON.stringify(data);
  }

  const requestConfig: RequestInterface = {
    method,
    headers,
    body,
  };

  const timeOut = path ? 180000 : 30000;
  const apiResponse = await fetchData(url, requestConfig, timeOut);
  if (download) {
    return apiResponse;
  }
  const response = await apiResponse.text();
  const responseData = response ? JSON.parse(response) : '';
  return {
    status: apiResponse.status,
    data: responseData,
  };
};

export const getUser = async (
  user_id: string
): Promise<ResponseType<UserType>> => {
  const response: ResponseType<UserType> = await request({
    method: Methods.get,
    data: {},
    endPoint: `users/${user_id}`,
  });
  if (response.status === 200) {
    return response;
  }
  throw Error(JSON.stringify(response));
};

export const getUsers = async (
  page: number = 1,
  perPage: number = 20
): Promise<ResponseType<UserType[]>> => {
  const response: ResponseType<UserType[]> = await request({
    method: Methods.get,
    data: { page, 'per-page': perPage },
    endPoint: `users`,
  });
  if (response.status === 200) {
    return response;
  }
  throw Error(JSON.stringify(response));
};

export const createUser = async (
  user: UserType
): Promise<ResponseType<UserType>> => {
  const response: ResponseType<UserType> = await request({
    method: Methods.post,
    data: user,
    endPoint: `users`,
  });
  if (response.status === 201) {
    return response;
  }
  throw Error(JSON.stringify(response));
};

export const updateUser = async (
  user: UserType,
  user_id: string
): Promise<ResponseType<UserType>> => {
  const response: ResponseType<UserType> = await request({
    method: Methods.put,
    data: user,
    endPoint: `users/${user_id}`,
  });
  if (response.status === 201) {
    return response;
  }
  throw Error(JSON.stringify(response));
};

export const deleteUser = async (
  user_id: string
): Promise<ResponseType<string>> => {
  const response: ResponseType<string> = await request({
    method: Methods.delete,
    data: {},
    endPoint: `users/${user_id}`,
  });
  if (response.status === 204) {
    return response;
  }
  throw Error(JSON.stringify(response));
};

export const createConsultation = async ({
  question,
  medium,
  user_id,
  mediaIds,
  parent_consultation_id,
}: ConsultationObject): Promise<ResponseType<ConsultationType>> => {
  if (!question || !medium || !user_id) {
    throw Error('missing field');
  }

  const data = {
    question,
    medium,
    user_id,
    media_ids: mediaIds,
    expand:
      'pusherAppKey,parentConsultation,consultations,user,media,pusherChannel,' +
      'chatConfig,chatHistory,voipConfig,videoConfig,recommendation',
    parent_consultation_id,
  };
  const response: ResponseType<ConsultationType> = await request({
    method: Methods.post,
    data,
    endPoint: `consultations`,
  });

  if (response.status === 201) {
    return response;
  }
  throw Error(JSON.stringify(response));
};

export const getConsultationInfo = async (
  consultation_id: number
): Promise<ResponseType<ConsultationType>> => {
  const response: ResponseType<ConsultationType> = await request({
    method: Methods.get,
    data: {
      expand:
        'pusherAppKey,parentConsultation,consultations,user,media,pusherChannel,' +
        'chatConfig,chatHistory,voipConfig,videoConfig,recommendation',
    },
    endPoint: `consultations/${consultation_id}`,
  });
  if (response.status === 200) {
    if (response.data && response.data.pusherAppKey) {
      response.data.socketParams = {
        apiKey: response.data.pusherAppKey,
        cluster: 'eu',
        authEndpoint: `${TBIConstants.baseURL}/v1/auth/pusher?access-token=${TBIConstants.token}`,
      };
    }
    return response;
  }
  throw Error(JSON.stringify(response));
};

export const getLastConsultation = async (): Promise<
  ResponseType<ConsultationType[]>
> => {
  const response: ResponseType<ConsultationType[]> = await request({
    method: Methods.get,
    data: {
      'per-page': 1,
      'sort': '-id',
      'expand':
        'pusherAppKey,parentConsultation,consultations,user,media,pusherChannel,' +
        'chatConfig,chatHistory,voipConfig,videoConfig,recommendation',
    },
    endPoint: `consultations`,
  });
  if (response.status === 200) {
    if (response.data && response.data[0] && response.data[0].pusherAppKey) {
      response.data[0].socketParams = {
        apiKey: response?.data?.[0]?.pusherAppKey,
        cluster: 'eu',
        authEndpoint: `${TBIConstants.baseURL}/v1/auth/pusher?access-token=${TBIConstants.token}`,
      };
    }
    return response;
  }
  throw Error(JSON.stringify(response));
};

export const getConsultationList = async (
  user_id?: number,
  page: number = 1,
  perPage = 20
): Promise<ResponseType<ConsultationType[]>> => {
  let data;
  if (user_id) {
    data = {
      page,
      'sort': '-id',
      'per-page': perPage,
      'filter[user_id]': user_id,
      'expand':
        'pusherAppKey,parentConsultation,consultations,user,media,pusherChannel,' +
        'chatConfig,chatHistory,voipConfig,videoConfig,recommendation',
    };
  } else {
    data = {
      page,
      'sort': '-id',
      'per-page': perPage,
      'expand':
        'pusherAppKey,parentConsultation,consultations,user,media,pusherChannel,' +
        'chatConfig,chatHistory,voipConfig,videoConfig,recommendation',
    };
  }

  const response = await request({
    method: Methods.get,
    data: data,
    endPoint: `consultations`,
  });
  if (response.status === 200) {
    return response;
  }
  throw Error(JSON.stringify(response));
};

export const deleteConsultation = async (
  consultation_id: number
): Promise<ResponseType<string>> => {
  const response: ResponseType<string> = await request({
    method: Methods.delete,
    data: {},
    endPoint: `consultations/${consultation_id}`,
  });
  if (response.status === 204) {
    return response;
  }
  throw Error(JSON.stringify(response));
};

export const cancelConsultation = async (
  consultation_id: number
): Promise<ResponseType<{ consultation_id: number; status: string }>> => {
  const response: ResponseType<{ consultation_id: number; status: string }> =
    await request({
      method: Methods.post,
      data: {},
      endPoint: `consultations/${consultation_id}/cancel`,
    });
  if (response.status === 200) {
    return response;
  }
  throw Error(JSON.stringify(response));
};

export const uploadMedia = async (
  path: string,
  type: string,
  fileName: string
): Promise<ResponseType<MediaType>> => {
  const response: ResponseType<MediaType> = await request({
    method: Methods.post,
    endPoint: `media`,
    data: {},
    path,
    type,
    fileName,
  });
  if (response.status === 200) {
    return response;
  }
  throw Error(JSON.stringify(response));
};

export const getPrescription = (consultation_id: number) =>
  request({
    method: Methods.get,
    endPoint: `consultations/${consultation_id}/download-prescription`,
    download: true,
  });

export const rateConsultation = async (
  consultation_id: number,
  score: number
): Promise<ResponseType<string>> => {
  const response: ResponseType<string> = await request({
    method: Methods.post,
    data: { score },
    endPoint: `consultations/${consultation_id}/rate`,
  });
  if (response.status === 204) {
    return response;
  }
  throw Error(JSON.stringify(response));
};
