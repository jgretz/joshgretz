import React from 'react';
import {connect} from 'react-redux';
import MetaTags from 'react-meta-tags';

import {activeArticleInfoSelector} from '../../selectors';
import {imageUrlForArticle} from '../../services';

const metaTags = ({info}) => {
  if (!info) {
    return null;
  }

  const titleDescription =
    location.pathname === '/' ? 'Musings of a Maker' : info.title;

  return (
    <MetaTags>
      <title>JoshGretz.io | {titleDescription}</title>
      <meta name="description" content={info.description} />
      <meta property="og:title" content={info.title} />
      <meta property="og:image" content={imageUrlForArticle(info)} />
    </MetaTags>
  );
};

const mapStateToProps = state => ({
  info: activeArticleInfoSelector(state),
});

export default connect(mapStateToProps)(metaTags);
