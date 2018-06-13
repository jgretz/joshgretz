import React, {Component} from 'react';
import {connect} from 'react-redux';
import {RingLoader} from 'react-spinners';

import {ArticleHeader, ActiveArticle} from './controls';
import {loadMap, setActiveArticleId} from '../actions';
import {setActiveArticle} from '../services';
import {
  articleMapSelector,
  mapLoadingSelector,
  mapSelector,
} from '../selectors';

class Blog extends Component {
  componentDidMount() {
    this.props.loadMap();
  }

  componentDidUpdate(prevProps) {
    const {articleMap, setActiveArticleId} = this.props;

    if (articleMap !== prevProps.articleMap) {
      setActiveArticle(setActiveArticleId, articleMap);
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
    const {loading} = this.props;

    if (loading) {
      return this.renderLoading();
    }

    return (
      <div className="blog">
        <ArticleHeader />
        <ActiveArticle />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  loading: mapLoadingSelector(state),

  map: mapSelector(state),
  articleMap: articleMapSelector(state),
});

export default connect(mapStateToProps, {loadMap, setActiveArticleId})(Blog);
