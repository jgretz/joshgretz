import {Link} from '@remix-run/react';
import {Github, Instagram, Linkedin} from 'lucide-react';
import avatar from '~/assets/images/josh-g.png';
import strava from '~/assets/images/strava-icon.png';

export default function Card() {
  return (
    <div className="bg-cardbg flex flex-col items-center justify-center z-10 absolute sm:fixed top-0 left-0 w-full border-b border-accent sm:border-r sm:w-[200px] sm:h-full sm:border-b-0">
      <img
        src={avatar}
        alt="Josh Gretz Head - Hand Drawn Avatar"
        className="rounded-full mt-5 h-[80px] w-[80px] sm:h-[120px] sm:w-[120px]"
      />
      <h1 className="text-center w-full mt-5 text-4xl">Josh Gretz</h1>
      <div className="flex flex-row justify-center py-3">
        <Link to="https://www.linkedin.com/in/joshgretz/" target="_blank">
          <Linkedin className="mx-2" />
        </Link>
        <Link to="https://github.com/jgretz" target="_blank">
          <Github className="mx-2" />
        </Link>
        <Link to="https://www.instagram.com/joshgretz/" target="_blank">
          <Instagram className="mx-2" />
        </Link>
        <Link to="https://www.strava.com/athletes/67556995" target="_blank">
          <img src={strava} alt="strava icon" className="h-[24px] w-[24px] bg-black" />
        </Link>
      </div>
    </div>
  );
}
