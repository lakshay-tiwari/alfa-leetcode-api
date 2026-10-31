import type { Response } from 'express';
import type { TrendingDiscussionObject } from '../types';

const fetchDiscussion = async (
  options: { first: number },
  res: Response,
  formatData: (data: TrendingDiscussionObject) => object,
  query: string,
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
        variables: {
          first: options.first || 20, //by default get 20 question
        },
      }),
    };

    if (process.env.NODE_ENV !== 'test') {
      fetchOptions.signal = AbortSignal.timeout(10000);
    }

    const response = await fetch('https://leetcode.com/graphql', fetchOptions);

    const result = await response.json();

    if (result.errors) {
      return (res.status ? res.status(400) : res).send(result);
    }

    return res.json(formatData(result.data));
  } catch (err) {
    console.error('Error: ', err);
    return (res.status ? res.status(500) : res).send(err);
  }
};

export default fetchDiscussion;
