interface ConstantObject {
  token: string;
  baseURL: string;
  language: string;
}

export let TBIConstants: ConstantObject = {
  token: '',
  baseURL: '',
  language: 'ar',
};

export const init = (token: string, baseURL: string, language: string) => {
  TBIConstants = {
    token,
    baseURL,
    language,
  };
};
