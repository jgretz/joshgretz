import $ from 'jquery';

export default ({pageTitle, description, imageUrl}) => {
  const isRoot = location.pathname === '/';
  if (isRoot) {
    pageTitle = 'Musings of a Maker';
    description =
      'Josh Gretz is maker living in Pittsburgh. This site contains his musings, thoughts, and learnings earned through his tinkering and career.';
    imageUrl = 'https://i.imgur.com/FrQNZnN.jpg';
  }

  const title = `Josh Gretz | ${pageTitle}`;

  $('title').html(title);
  $('meta[name=description]').attr('content', description);
  $('meta[property="og:title"]').attr('content', title);
  $('meta[property="og:url"]').attr('content', window.location.href);
  $('meta[property="og:description"]').attr('content', description);
  $('meta[property="og:image"]').attr('content', imageUrl);
  $('link[rel=canonical]').attr('href', window.location.href);

  $('#seo-h1').html(title);
  $('#seo-h2').html(description);

  return null;
};
