interface ConstantObject {
  token: string;
  baseURL: string;
  language: string;
  sinaModelEndPoint: string;
}

export let TBIConstants: ConstantObject = {
  token: '',
  baseURL: '',
  language: 'ar',
  sinaModelEndPoint: '',
};

export const init = (token: string, baseURL: string, language: string, sinaModelEndPoint: string = "") => {
  TBIConstants = {
    token,
    baseURL,
    language,
    sinaModelEndPoint,
  };
};
