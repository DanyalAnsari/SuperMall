import { cn } from "@/lib/utils";

const Titles = ({ text1, text2, className }) => {
  return (
    <h1
      className={cn(
        "text-white text-5xl lg:text-8xl tracking-[-1px] leading-tight lg:leading-18",
        className
      )}
    >
      <span className="font-thin">{text1}</span>
      <span className="font-semibold">{text2}</span>
    </h1>
  );
};

export default Titles;
