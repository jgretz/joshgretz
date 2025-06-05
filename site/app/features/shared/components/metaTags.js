import $ from 'jquery';
import {GENERIC_TITLE, GENERIC_DESC, GENERIC_IMG} from '../constants';

export default ({
  pageTitle = GENERIC_TITLE,
  description = GENERIC_DESC,
  imageUrl = GENERIC_IMG,
  type = 'website',
}) => {
  const title = `Josh Gretz | ${pageTitle}`;

  $('title').html(title);
  $('meta[name=description]').attr('content', description);
  $('meta[property="og:title"]').attr('content', title);
  $('meta[property="og:url"]').attr('content', window.location.href);
  $('meta[property="og:description"]').attr('content', description);
  $('meta[property="og:image"]').attr('content', imageUrl);
  $('meta[property="og:type"]').attr('content', type);
  $('link[rel=canonical]').attr('href', window.location.href);

  $('#seo-h1').html(title);
  $('#seo-h2').html(description);

  return null;
};
