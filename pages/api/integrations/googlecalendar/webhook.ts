import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.error("req.query", req.query);
  console.error("req.body", req.body);
  return res.status(200).end();
}
