import $ from 'jquery';
import {connect} from 'react-redux';

import {activeArticleInfoSelector} from '../../selectors';
import {imageUrlForArticle} from '../../services';

const metaTags = ({info}) => {
  if (!info) {
    return null;
  }

  const isRoot = location.pathname === '/';
  if (isRoot) {
    return null;
  }

  const title = `Josh Gretz | ${info.title}`;

  $('title').html(title);
  $('meta[name=description]').attr('content', info.description);
  $('meta[property="og:title"]').attr('content', title);
  $('meta[property="og:url"]').attr('content', window.location.href);
  $('meta[property="og:description"]').attr('content', info.description);
  $('meta[property="og:image"]').attr('content', imageUrlForArticle(info));

  $('#seo-h1').html(title);
  $('#seo-h2').html(info.description);

  return null;
};

const mapStateToProps = state => ({
  info: activeArticleInfoSelector(state),
});

export default connect(mapStateToProps)(metaTags);
