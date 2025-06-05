import React from 'react';
import {connect} from 'react-redux';

import {MetaTags} from '../../../shared/components';
import {activeArticleInfoSelector} from '../../selectors';
import {imageUrlForArticle} from '../../services';
import {
  GENERIC_TITLE,
  GENERIC_DESC,
  GENERIC_IMG,
} from '../../../shared/constants';

const metaTags = ({info}) => {
  if (!info) {
    return null;
  }

  let type = 'article';

  const isRoot = location.pathname === '/';
  if (isRoot) {
    info = {
      title: GENERIC_TITLE,
      description: GENERIC_DESC,
      image: GENERIC_IMG,
    };

    type = 'website';
  }

  return (
    <MetaTags
      pageTitle={info.title}
      description={info.description}
      imageUrl={imageUrlForArticle(info)}
      type={type}
    />
  );
};

const mapStateToProps = state => ({
  info: activeArticleInfoSelector(state),
});

export default connect(mapStateToProps)(metaTags);
