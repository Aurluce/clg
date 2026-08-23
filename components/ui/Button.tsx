import Link from "next/link";
import { cn } from "@/lib/utils/cn";

type Variant = "primary" | "secondary" | "ghost";

const variantClasses: Record<Variant, string> = {
  primary: "bg-crimson text-paper hover:bg-crimson-700 hover:scale-[1.03]",
  secondary:
    "bg-transparent text-royal border border-royal hover:bg-royal hover:text-paper hover:scale-[1.03]",
  ghost: "bg-transparent text-royal hover:bg-royal-50",
};

const baseClasses =
  "inline-flex items-center justify-center gap-2 rounded-sm px-6 py-3 font-body text-sm font-medium tracking-wide transition-all duration-200";

type BaseProps = { children: React.ReactNode; variant?: Variant; className?: string };
type ButtonAsButton = BaseProps & React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };
type ButtonAsLink = BaseProps & { href: string } & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">;

export function Button(props: ButtonAsButton | ButtonAsLink) {
  const { children, variant = "primary", className, ...rest } = props;
  const classes = cn(baseClasses, variantClasses[variant], className);

  if ("href" in props && props.href) {
    const { href, ...anchorRest } = rest as React.AnchorHTMLAttributes<HTMLAnchorElement>;
    return (
      <Link href={props.href} className={classes} {...anchorRest}>
        {children}
      </Link>
    );
  }
  return (
    <button className={classes} {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
}