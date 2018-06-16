import $ from 'jquery';
import React from 'react';
import {connect} from 'react-redux';
import MetaTags from 'react-meta-tags';

import {activeArticleInfoSelector} from '../../selectors';
import {imageUrlForArticle} from '../../services';

const metaTags = ({info}) => {
  if (!info) {
    return null;
  }

  const isRoot = location.pathname === '/';

  const overrideTitle = `Josh Gretz | ${
    isRoot ? 'Musings of a Maker' : info.title
  }`;

  if (!isRoot) {
    $('#seo-h1').html(overrideTitle);
    $('#seo-h2').html(info.description);
  }

  return (
    <MetaTags>
      <title>{overrideTitle}</title>
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
