import Link from "next/link";

export default function Logo(){
    return (
        <div className="flex items-baseline gap-2 whitespace-nowrap">
            <Link href="/" className="text-logo">CarFix</Link>
            <span className="hidden text-logo-sub sm:inline">Your trusted car service</span>
        </div>
    )
}