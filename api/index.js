// This acts as the Vercel serverless function entry point
import app from '../server/index.ts';

export default async (req, res) => {
  // Convert Vercel's request to Express-compatible format
  const { method, headers, url } = req;
  const request = {
    method,
    headers,
    url,
    body: req.body,
  };
  
  // Convert Express response to Vercel format
  const response = {
    statusCode: 200,
    headers: {},
    setHeader: (name, value) => (response.headers[name] = value),
    end: (body) => res.send(body),
  };
  
  await app(request, response);
};
