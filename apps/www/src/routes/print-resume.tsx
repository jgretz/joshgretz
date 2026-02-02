import {createFileRoute, redirect} from '@tanstack/react-router';

export const Route = createFileRoute('/print-resume')({
  beforeLoad: () => {
    throw redirect({href: '/josh-gretz-resume.pdf'});
  },
});
