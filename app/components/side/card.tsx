import { Github, Instagram, Linkedin } from 'lucide-react';
import avatar from '~/assets/images/josh-g.png';
import strava from '~/assets/images/strava-icon.png';

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
          <Linkedin className="mx-2" />
        </a>
        <a href="https://github.com/jgretz" target="_blank" rel="noreferrer">
          <Github className="mx-2" />
        </a>
        <a href="https://www.instagram.com/joshgretz/" target="_blank" rel="noreferrer">
          <Instagram className="mx-2" />
        </a>
        <a href="https://www.strava.com/athletes/67556995" target="_blank" rel="noreferrer">
          <img src={strava} alt="strava icon" className="h-[24px] w-[24px] bg-black" />
        </a>
      </div>
    </div>
  );
}
