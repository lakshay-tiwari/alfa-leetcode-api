import type { Response } from 'express';
import type { TagsData } from '../types';

const fetchTags = async (
  res: Response,
  query: string,
  formatData: (data: TagsData) => object,
) => {
  try {
    const fetchOptions: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Referer: 'https://leetcode.com',
      },
      body: JSON.stringify({
        query: query,
      }),
    };

    if (process.env.NODE_ENV !== 'test') {
      fetchOptions.signal = AbortSignal.timeout(10000);
    }

    const response = await fetch('https://leetcode.com/graphql', fetchOptions);

    const result = await response.json();
    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`);
    }
    if (result.errors) {
      return (res.status ? res.status(400) : res).send(result);
    }

    return res.json(formatData(result.data));
  } catch (err) {
    console.error('Error: ', err);
    return (res.status ? res.status(500) : res).send(err);
  }
};

export default fetchTags;
