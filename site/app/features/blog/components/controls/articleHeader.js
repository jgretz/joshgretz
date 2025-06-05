import React from 'react';
import {connect} from 'react-redux';
import {Icon} from 'semantic-ui-react';
import {withRouter} from 'react-router';

import {If} from '../../../shared/components';
import {rotateArticle} from '../../actions';
import {activeArticleInfoSelector, articleMapSelector} from '../../selectors';
import {imageUrlForArticle} from '../../services';

const rotate = (rotateArticle, info, map, offset, history) => () => {
  rotateArticle(info, map, offset, history);
};

const ArticleHeader = ({info, map, rotateArticle, history}) => {
  if (!info) {
    return null;
  }

  const style = {
    backgroundImage: `url(${imageUrlForArticle(info)})`,
  };

  const showLeft = map.indexOf(info) < map.length - 1;
  const showRight = map.indexOf(info) > 0;
  const pageFiller = <div className="page-button-fill" />;

  return (
    <div style={style} className="article-header">
      <div className="overlay">
        <If value={showLeft} elseDisplay={pageFiller}>
          <div
            className="page-button"
            onClick={rotate(rotateArticle, info, map, 1, history)}
          >
            <Icon name="left arrow" />
          </div>
        </If>

        <div className="header-content">
          <h1>{info.title}</h1>
          <h2>{info.description}</h2>
        </div>

        <If value={showRight} elseDisplay={pageFiller}>
          <div
            className="page-button"
            onClick={rotate(rotateArticle, info, map, -1, history)}
          >
            <Icon name="right arrow" />
          </div>
        </If>
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  info: activeArticleInfoSelector(state),
  map: articleMapSelector(state),
});

export default withRouter(
  connect(mapStateToProps, {rotateArticle})(ArticleHeader),
);
