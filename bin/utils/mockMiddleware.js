import { getMockData } from './mock';

export default function (req, res, next) {
  let {url, body} = req;

  if (/application\/json/i.test(req.get('accept'))) {
    let mockRes = null;
    mockRes = getMockData(req.get('host'), url, body);
    if (mockRes) {
      return res.json(mockRes);
    }
  }

  next();
}
