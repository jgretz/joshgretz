import {GET} from 'node-bits';
import sm from 'sitemap';
import {urlForTitle} from '../services';
import blogArticles from '../blog/map.json';

const SITE = 'https://www.joshgretz.io';

export default class Sitemap {
  getRoute(verb) {
    if (verb === GET) {
      return 'sitemap.xml';
    }

    return null; // will use the folder structure for all other verbs
  }

  async get(req, res) {
    const sitemap = sm.createSitemap({
      hostname: SITE,
      urls: [
        {url: '/', changefreq: 'weekly', priority: 1.0, img: 'https://i.imgur.com/FrQNZnN.jpg'},
        {url: '/about', changefreq: 'monthly', priority: 0.4},
        {url: '/resume', changefreq: 'monthly', priority: 0.4},
        ...blogArticles.map(article => ({
          url: urlForTitle(article.title),
          changefreq: 'monthly',
          priority: 0.4,
          img: `${SITE}/api/blog/images?name=${article.image}`,
        })),
      ],
    });

    res.header('Content-Type', 'text/xml');
    res.status(200).send(sitemap.toXML());
  }
}
