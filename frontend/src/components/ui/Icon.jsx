import * as LucideIcons from "lucide-react";

const Icon = ({ iconName, className, iconSize }) => {
  // Lucide icons are exported with PascalCase names
  const IconComponent = LucideIcons[iconName];
  const size = iconSize ? iconSize : 32;

  if (!IconComponent) {
    console.warn(`Icon "${iconName}" not found`);
    return null;
  }
  return (
    <IconComponent className={`${className}`} size={size} strokeWidth={1} />
  );
};

export default Icon;
