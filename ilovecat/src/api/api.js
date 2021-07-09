const END_POINT = 'https://zl3m4qq0l9.execute-api.ap-northeast-2.amazonaws.com';

const request = async (url, params) => {
  try {
    const response = await fetch(url, params);

    if (response.ok) {
      const data = await response.json();

      return data;
    }

    const error = await response.json();

    throw new Error(error);
  } catch (error) {
    throw new Error(error);
  }
};

export const fetchRoot = async () => {
  const response = await request(`${END_POINT}/dev`);

  return response;
};

export const fetchDirectory = async (id) => {
  const response = await request(`${END_POINT}/dev/${id || ''}`);

  return response;
};
