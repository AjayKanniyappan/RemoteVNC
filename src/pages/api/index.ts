import type { NextApiRequest, NextApiResponse } from 'next';

/**
 * A function that returns a response to the client.
 * @param {NextApiRequest} _req - NextApiRequest - This is the request object that Next.js provides.
 * @param res - NextApiResponse<vnc.api>
 */
export default function handler(_req: NextApiRequest, res: NextApiResponse<vnc.Api>) {
  res.status(200).json({ Boom: 'API is Working' });
}
