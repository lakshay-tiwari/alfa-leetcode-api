import type { Response } from 'express';

const extractErrorMessage = (err: unknown): string => {
  if (err instanceof Error) {
    return err.message;
  }
  return typeof err === 'object' && err !== null && 'message' in err
    ? String((err as { message: unknown }).message)
    : 'Internal server error';
};

const fetchUserDetails = async <T, U>(
  options: { username: string; limit: number; year: number },
  res: Response,
  query: string,
  formatData?: (data: T) => U,
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
          username: options.username, //username required
          limit: options.limit, //only for submission
          year: options.year,
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

    if (
      result.data &&
      'matchedUser' in result.data &&
      result.data.matchedUser === null
    ) {
      return (res.status ? res.status(404) : res).json({
        error: 'User not found',
      });
    }

    if (formatData == null) {
      return res.json(result.data);
    }

    return res.json(formatData(result.data));
  } catch (err: unknown) {
    console.error('Error: ', err);
    return (res.status ? res.status(500) : res).send(extractErrorMessage(err));
  }
};

export default fetchUserDetails;
