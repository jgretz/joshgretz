interface Props {
  title: string;
  company: string;
  tenure: string;
  location: string;
}

export default function JobTitle({title, company, tenure, location}: Props) {
  return (
    <div>
      <div>
        <span>{title}</span>
        <span>@ {company}</span>
      </div>
      <div>
        <span>{tenure}</span>
        <span>// {location}</span>
      </div>
    </div>
  );
}
