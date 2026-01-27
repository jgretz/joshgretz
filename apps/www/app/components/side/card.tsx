import {GitHubLogoIcon, InstagramLogoIcon, LinkedInLogoIcon} from '@radix-ui/react-icons';
import bluesky from '@www/assets/images/bluesky.png';
import avatar from '@www/assets/images/josh-g.png';
import strava from '@www/assets/images/strava-icon.png';

export default function Card() {
  return (
    <div className="flex flex-col items-center justify-center">
      <img
        src={avatar}
        alt="Josh Gretz Head - Hand Drawn Avatar"
        className="mt-5 h-[80px] w-[80px] rounded-full sm:h-[120px] sm:w-[120px]"
      />
      <h1 className="mt-5 w-full text-center text-4xl">Josh Gretz</h1>
      <div className="flex flex-row justify-center py-3">
        <a href="https://www.linkedin.com/in/joshgretz/" target="_blank" rel="noreferrer">
          <LinkedInLogoIcon className="mx-2" />
        </a>
        <a href="https://github.com/jgretz" target="_blank" rel="noreferrer">
          <GitHubLogoIcon className="mx-2" />
        </a>
        <a href="https://www.instagram.com/joshgretz/" target="_blank" rel="noreferrer">
          <InstagramLogoIcon className="mx-2" />
        </a>
        <a href="https://bsky.app/profile/joshgretz.bsky.social" target="_blank" rel="noreferrer">
          <img src={bluesky} alt="bluesky icon" className="h-[15px] w-[15px] mx-[8px] bg-black" />
        </a>
        <a href="https://www.strava.com/athletes/67556995" target="_blank" rel="noreferrer">
          <img src={strava} alt="strava icon" className="h-[15px] w-[15px] mx-[8px] bg-black" />
        </a>
      </div>
    </div>
  );
}
