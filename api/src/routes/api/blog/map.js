import fs from 'nano-fs';
import {logError} from 'node-bits';
import {blogRoute} from '../../../services';

export default async (req, res) => {
  try {
    const data = await fs.readFile(blogRoute('map.json'));
    res.send(data);
  } catch (err) {
    logError(err);
    res.status(500).send();
  }
};
