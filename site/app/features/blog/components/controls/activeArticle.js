import React, {Component} from 'react';
import {connect} from 'react-redux';
import ReactMarkdown from 'react-markdown';
import {RingLoader} from 'react-spinners';
import moment from 'moment';

import Social from './social';
import {loadArticleContent} from '../../actions';

import {
  contentLoadingSelector,
  activeArticleContentSelector,
  activeArticleIdSelector,
  activeArticleInfoSelector,
} from '../../selectors';

class ActiveArticle extends Component {
  componentDidUpdate() {
    const {articleId, info, content, loadArticleContent} = this.props;
    if (articleId && info && !content) {
      loadArticleContent(articleId, info.content);
    }
  }

  // render
  renderLoading() {
    return (
      <div className="loading">
        <RingLoader color="#ddac60" size={80} />
      </div>
    );
  }

  render() {
    const {loading, content, info} = this.props;

    if (loading) {
      return this.renderLoading();
    }

    return (
      <div className="article">
        <div className="meta">
          <Social info={info} />
          <div className="published">
            {moment(info.published, 'MM-DD-YYYY').format('MMMM Do, YYYY')}
          </div>
        </div>

        <ReactMarkdown source={content} />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  loading: contentLoadingSelector(state),
  articleId: activeArticleIdSelector(state),

  info: activeArticleInfoSelector(state),
  content: activeArticleContentSelector(state),
});

export default connect(mapStateToProps, {loadArticleContent})(ActiveArticle);
