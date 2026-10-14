export default function UnderlineHover({ children = "Hover me" }) {
  return (
    <span className="group relative inline-block cursor-pointer">
      {children}
      <span className="absolute left-0 -bottom-1 h-0.5 w-full origin-left scale-x-0 bg-[#0d47a1] transition-transform duration-300 ease-out group-hover:scale-x-100" />
    </span>
  );
}