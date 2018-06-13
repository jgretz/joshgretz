import React from 'react';
import {connect} from 'react-redux';
import {activeArticleInfoSelector} from '../../selectors';

const BASE_URL = process.env.API_BASE_URL;

const ArticleHeader = ({info}) => {
  if (!info) {
    return null;
  }

  const style = {
    backgroundImage: `url(${BASE_URL}blog/images?name=${info.image})`,
  };

  return (
    <div style={style} className="article-header">
      <div className="overlay">
        <h1>{info.title}</h1>
        <h2>{info.description}</h2>
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  info: activeArticleInfoSelector(state),
});

export default connect(mapStateToProps)(ArticleHeader);
