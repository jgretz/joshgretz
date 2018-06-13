export default title => {
  const safeTitle = encodeURIComponent(title.replace(' ', '-'));

  return `/${safeTitle}`;
};
