import type { Response } from 'express';
import type { GraphQLParams } from '../types';

const handleRequest = async (
  res: Response,
  query: string,
  params: GraphQLParams,
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
        variables: params,
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

    return res.json(result.data);
  } catch (err) {
    console.error('Error: ', err);
    return (res.status ? res.status(500) : res).send(err);
  }
};

export default handleRequest;
