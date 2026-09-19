import Link from "next/link";
import { Cpu } from "lucide-react";

export function Brand({ admin = false }: { admin?: boolean }) {
  return (
    <Link
      href={admin ? "/admin" : "/"}
      className="brand"
      aria-label={admin ? "IEEE ITB admin dashboard" : "IEEE ITB home"}
    >
      <span className="brand-mark">
        <Cpu size={24} strokeWidth={1.6} />
      </span>
      <span>
        <strong>
          IEEE <span>ITB</span>
        </strong>
        <small>{admin ? "EVENT MANAGEMENT" : "STUDENT BRANCH"}</small>
      </span>
    </Link>
  );
}
