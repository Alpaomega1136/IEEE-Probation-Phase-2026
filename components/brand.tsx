import Link from "next/link";
import Image from "next/image";

export function Brand({ admin = false }: { admin?: boolean }) {
  return (
    <Link
      href={admin ? "/admin" : "/"}
      className="brand"
      aria-label={admin ? "IEEE ITB admin dashboard" : "IEEE ITB home"}
    >
      <Image
        src="/images/ieee-itb-logo.png"
        alt="IEEE ITB Student Branch"
        width={2112}
        height={745}
        priority
      />
    </Link>
  );
}
