interface ConstantObject {
  domain: string;
  language: string;
  token: string;
}

export let TBIConstants: ConstantObject = {
  domain: '',
  language: 'ar',
  token: '',
};

export const init = (domain: string, language: string, token: string) => {
  TBIConstants = {
    domain,
    language,
    token,
  };
};
