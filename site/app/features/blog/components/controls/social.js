import React from 'react';
import {
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  RedditShareButton,
  FacebookIcon,
  LinkedinIcon,
  TwitterIcon,
  RedditIcon,
} from 'react-share';

import {urlForTitle} from '../../services';

export default ({info}) => {
  const url = urlForTitle(info.title);
  const combined = `${info.title} - ${info.description}`;

  return (
    <div className="social">
      <TwitterShareButton url={url} title={combined}>
        <TwitterIcon size={30} round />
      </TwitterShareButton>

      <FacebookShareButton url={url} quote={combined}>
        <FacebookIcon size={30} round />
      </FacebookShareButton>

      <RedditShareButton url={url} title={info.title}>
        <RedditIcon size={30} round />
      </RedditShareButton>

      <LinkedinShareButton
        url={url}
        title={info.title}
        description={info.description}
      >
        <LinkedinIcon size={30} round />
      </LinkedinShareButton>
    </div>
  );
};
