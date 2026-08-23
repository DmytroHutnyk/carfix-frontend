import BusinessHeader from "@/business/_components/businessHeader";
import BusinessFooter from "@/business/_components/businessFooter";

export default function BusinessLayout({children}: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen flex-col">
            <BusinessHeader/>
            <div className="flex-1">
                {children}
            </div>
            <BusinessFooter/>
        </div>
    );
}
