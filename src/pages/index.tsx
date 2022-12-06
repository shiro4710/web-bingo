import Link from "next/link";
import "twin.macro";

export default function Home() {
  return (
    <div>
      <div>
        <Link href="/admin">Admin</Link>
      </div>
      <div>
        <Link href="/view">View</Link>
      </div>
      <div>
        <Link href="/card">Card</Link>
      </div>
    </div>
  );
}
