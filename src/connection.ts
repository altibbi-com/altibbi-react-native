import { TBIConstants } from './service';
import { UserType } from './types';

interface MethodsObject {
  get: string;
  post: string;
  delete: string;
  put: string;
}

interface ConsultationObject {
  question: string;
  medium: string;
  userId: number;
  mediaIds?: string[];
  followUpId?: string;
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
  if (!TBIConstants.domain) {
    return {
      message: 'Add your domain to Init',
    };
  }

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${TBIConstants.token}`,
    'accept-language': TBIConstants.language,
  };

  let url = `${TBIConstants.domain}/v1/${endPoint}`;
  let body;
  if (method === Methods.get) {
    url = url + '?' + new URLSearchParams(data).toString();
  } else if (path) {
    const formData = new FormData();
    formData.append('file', {
      uri: path,
      type: type,
      name: fileName,
    });
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

export const getUser = (userId: string) =>
  request({
    method: Methods.get,
    data: {},
    endPoint: `users/${userId}`,
  });

export const getUsers = (page: number = 1, perPage: number = 20) =>
  request({
    method: Methods.get,
    data: { page, 'per-page': perPage },
    endPoint: `users`,
  });

export const createUser = (user: UserType) =>
  request({
    method: Methods.post,
    data: user,
    endPoint: `users`,
  });
export const updateUser = (user: UserType, userId: string) =>
  request({
    method: Methods.put,
    data: user,
    endPoint: `users/${userId}`,
  });

export const deleteUser = (userId: string) =>
  request({
    method: Methods.delete,
    data: {},
    endPoint: `users/${userId}`,
  });

export const createConsultation = async ({
  question,
  medium,
  userId,
  mediaIds,
  followUpId,
}: ConsultationObject) => {
  if (!question || !medium || !userId) {
    return { message: 'missing field' };
  }

  const data = {
    question,
    medium,
    user_id: userId,
    media_ids: mediaIds,
    expand:
      'pusherAppKey,parentConsultation,consultations,user,media,pusherChannel,' +
      'chatConfig,chatHistory,voipConfig,videoConfig,recommendation',
    followUpId,
  };
  return await request({
    method: Methods.post,
    data,
    endPoint: `consultations`,
  });
};

export const getConsultationInfo = (consultationId: number) =>
  request({
    method: Methods.get,
    data: {
      expand:
        'pusherAppKey,parentConsultation,consultations,user,media,pusherChannel,' +
        'chatConfig,chatHistory,voipConfig,videoConfig,recommendation',
    },
    endPoint: `consultations/${consultationId}`,
  });

export const getLastConsultation = () =>
  request({
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

export const getConsultationList = async (
  userId: number,
  page: number = 1,
  perPage = 20
) => {
  if (!userId) {
    return { message: 'missing user id' };
  }

  return await request({
    method: Methods.get,
    data: {
      page,
      'per-page': perPage,
      'filter[user_id]': userId,
      'expand':
        'pusherAppKey,parentConsultation,consultations,user,media,pusherChannel,' +
        'chatConfig,chatHistory,voipConfig,videoConfig,recommendation',
    },
    endPoint: `consultations`,
  });
};

export const deleteConsultation = (consultationId: number) =>
  request({
    method: Methods.delete,
    data: {},
    endPoint: `consultations/${consultationId}`,
  });

export const cancelConsultation = (consultationId: number) =>
  request({
    method: Methods.post,
    data: {},
    endPoint: `consultations/${consultationId}/cancel`,
  });

export const uploadMedia = (path: string, type: string, fileName: string) =>
  request({
    method: Methods.post,
    endPoint: `media`,
    data: {},
    path,
    type,
    fileName,
  });

export const getPrescription = (consultationId: number) =>
  request({
    method: Methods.get,
    endPoint: `consultations/${consultationId}/download-prescription`,
    download: true,
  });
