import Link from "next/link";
import { OutOfOrder } from "@/components/out-of-order";

export default function NotFound() {
  return (
    <div className="py-24">
      <OutOfOrder message="This exhibit wandered off the stage. Check the address, or head back to the show floor." />
      <div className="mt-10 text-center">
        <Link
          href="/"
          className="rounded bg-faz px-5 py-2.5 font-mono text-xs font-medium uppercase tracking-widest text-stage transition-all hover:bg-faz-hot"
        >
          Back to the archive
        </Link>
      </div>
    </div>
  );
}
