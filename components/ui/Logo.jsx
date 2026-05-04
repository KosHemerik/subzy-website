import Link from "next/link";
import Image from "next/image";

/**
 * Logo component for Subzy branding
 */
export default function Logo({ className = "", width = 120, height = 40 }) {
  return (
    <Link href="/" className={`flex items-center ${className}`}>
      <Image
        src="/subzy_logo_transparant.png"
        alt="Subzy"
        width={width}
        height={height}
        priority
      />
    </Link>
  );
}
