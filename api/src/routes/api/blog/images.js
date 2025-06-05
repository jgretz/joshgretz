import fs from 'nano-fs';
import {logError} from 'node-bits';
import {blogRoute} from '../../../services';

export default async (req, res) => {
  try {
    if (!req.query.name) {
      res.status(404).send();
      return;
    }

    const route = blogRoute(`images/${req.query.name}`);
    try {
      await fs.access(route, fs.R_OK);
    } catch (err) {
      res.status(404).send();
      return;
    }

    const data = await fs.readFile(route);
    res.send(data);
  } catch (err) {
    logError(err);
    res.status(500).send();
  }
};
