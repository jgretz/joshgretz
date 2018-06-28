import React from 'react';
import {connect} from 'react-redux';

import {MetaTags} from '../../../shared/components';
import {activeArticleInfoSelector} from '../../selectors';
import {imageUrlForArticle} from '../../services';

const metaTags = ({info}) => {
  if (!info) {
    return null;
  }

  return (
    <MetaTags
      pageTitle={info.title}
      description={info.description}
      imageUrl={imageUrlForArticle(info)}
    />
  );
};

const mapStateToProps = state => ({
  info: activeArticleInfoSelector(state),
});

export default connect(mapStateToProps)(metaTags);
