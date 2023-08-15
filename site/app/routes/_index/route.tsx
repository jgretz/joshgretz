import type {V2_MetaFunction} from '@remix-run/node';

export const meta: V2_MetaFunction = () => {
  return [{title: 'JoshGretz.io'}, {name: 'description', content: ''}];
};

export default function Index() {
  return (
    <div className="p-5">
      <div>
        I&#39;m Josh Gretz - a maker living in Pittsbugh. I love learning, exploring, and creating.
        You can normally find me in shorts (even in December) sitting in front of a computer delving
        into some new experiment. When I&#39;m not being beguiled by code, you can find me playing
        basketball, watching any sport known to man (seriously, I even love staying up late to watch
        Olympic Handball), or creating some tasty morsel in the kitchen. No matter what or where
        I&#39;m making, I&#39;m committed to leaving the world a little better than I found it.
      </div>

      <h3 className="font-bold text-2xl my-3">By Day</h3>
      <div>
        I&#39;m the CTO of Truefit, an awesome software company in Pittsburgh. I spend my days
        helping our talented team explore new areas, expand their skills, and imagine creative
        approaches to creating software products people love. I am privileged to work with an
        amazing group of people that understand the challenges our customers face and are gifted at
        overcoming those challenges with innovative solutions. I count myself blessed that this same
        cadre of creators also are kind enough to put up with my eccentricities on a daily basis.
      </div>

      <h3 className="font-bold text-2xl my-3">By Night</h3>
      <div>
        I&#39;m the father of three sons, who daily manage to surpass the &#34;wish&#34; my parents
        had for me to have children just like me. I am also blessed to be the husband of a
        beautiful, creative and patient wife. Many of my nights are spent poking at some new idea,
        topic, or thought that popped into my ADD brain.
      </div>

      <h3 className="font-bold text-2xl my-3">Where I&#39;ve Been</h3>
      <div>
        I joined Truefit as an intern in 2003 and have been there ever since. Over the years,
        I&#39;ve been blessed to be able to be part of a journey that has taken us from a small
        company that no one knew anything about in Cranberry Twp to an increasingly well known and
        respected boutique innovation firm in downtown Pittsburgh. Before Truefit, I attended Grove
        City College. I graduated in 2004 with a B.S. in Computer Information Systems and a minor in
        Business. Over the years since graduation, I&#39;ve enjoyed many opportunites to remain
        involved with the CS department, even serving as an adjunct professor for a while.
        <br />
        <br />I grew up in Columbus, OH. It&#39;s a wonderful city and home to my beloved Buckeyes.
      </div>
    </div>
  );
}
