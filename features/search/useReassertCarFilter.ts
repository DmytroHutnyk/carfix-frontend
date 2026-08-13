import {usePathname, useRouter} from "next/navigation";

const SEARCH_PATH = "/search";

export function useReassertCarFilter() {
    const router = useRouter();
    const pathname = usePathname();

    return () => {
        if (pathname !== SEARCH_PATH) return;

        const next = new URLSearchParams(window.location.search);
        if (!next.has("allBrands")) return;

        next.delete("allBrands");
        next.delete("page");
        router.push(`${pathname}?${next.toString()}`);
    };
}
