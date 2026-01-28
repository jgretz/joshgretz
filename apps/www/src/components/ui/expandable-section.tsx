interface ExpandableSectionProps {
  children: React.ReactNode;
  isOpen: boolean;
}

export const ExpandableSection = ({children, isOpen}: ExpandableSectionProps) => {
  if (!isOpen) return null;
  return <div className="mt-5 border-l-2 border-warm-600/30 pl-4">{children}</div>;
};
