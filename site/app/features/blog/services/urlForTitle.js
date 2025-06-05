const SITE = 'https://www.joshgretz.io';

export default (title, relative) => {
  const safeTitle = encodeURIComponent(title.replace(' ', '-'));

  return relative ? `/${safeTitle}` : `${SITE}/${safeTitle}`;
};
