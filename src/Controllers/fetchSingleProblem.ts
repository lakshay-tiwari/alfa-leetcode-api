import type { Response } from 'express';
import type { DailyProblemData, SelectProblemData } from '../types';

const fetchSingleProblem = async (
  res: Response,
  query: string,
  titleSlug: string | null,
  formatData?: (data: DailyProblemData & SelectProblemData) => void,
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
          titleSlug, //search question using titleSlug
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
      'question' in result.data &&
      result.data.question === null
    ) {
      return (res.status ? res.status(404) : res).json({
        error: 'Question not found',
      });
    }

    if (formatData == null) {
      return res.json(result.data);
    }

    return res.json(formatData(result.data));
  } catch (err) {
    console.error('Error: ', err);
    return (res.status ? res.status(500) : res).send(err);
  }
};

export default fetchSingleProblem;
