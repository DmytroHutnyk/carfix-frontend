import HeroSection from "@/business/_components/heroSection";
import WhyChooseSection from "@/business/_components/whyChooseSection";
import StatsSection from "@/business/_components/statsSection";
import PricingSection from "@/business/_components/pricingSection";
import TrustedBySection from "@/business/_components/trustedBySection";

export default function BusinessPage() {
    return (
        <main className="mx-auto max-w-[1425px] space-y-10 px-4 py-6 sm:px-6 lg:space-y-24 lg:px-[72px] lg:py-12">
            <HeroSection/>
            <WhyChooseSection/>
            <StatsSection/>
            <PricingSection/>
            <TrustedBySection/>
        </main>
    );
}
