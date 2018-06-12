import fs from 'nano-fs';
import NodeCache from 'node-cache';
import {logError} from 'node-bits';
import {blogRoute} from '../../../services';

const cache = new NodeCache({stdTTL: 60 * 60, checkperiod: 60 * 60 * 2});

export default async (req, res) => {
  try {
    if (!req.query.name) {
      res.status(404).send();
      return;
    }

    const route = blogRoute(`content/${req.query.name}.md`);
    const cached = cache.get(route);
    if (cached) {
      res.send(cached);
      return;
    }

    try {
      await fs.access(route, fs.R_OK);
    } catch (err) {
      res.status(404).send();
      return;
    }

    const data = await fs.readFile(route);
    res.send(data);

    cache.set(route, data);
  } catch (err) {
    logError(err);
    res.status(500).send();
  }
};
