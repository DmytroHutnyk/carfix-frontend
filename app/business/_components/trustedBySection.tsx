import {Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious} from "@/_components/shadcn/carousel";
import ServiceCard from "@/_components/root/ServiceCard";

export default function TrustedBySection() {
    return (
        <section className="space-y-5 lg:space-y-8">
            <h2 className="text-center text-base font-semibold lg:text-2xl lg:font-bold">Trusted by service providers</h2>
            <Carousel opts={{align: "start", loop: true}} className="w-full">
                <CarouselContent>
                    {providers.map((provider) => (
                        <CarouselItem key={provider.name} className="md:basis-1/2 lg:basis-1/3">
                            <ServiceCard name={provider.name} imagePath={provider.imagePath}/>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="left-2 sm:-left-12"/>
                <CarouselNext className="right-2 sm:-right-12"/>
            </Carousel>
        </section>
    );
}

const providers = [
    {name: "Serwis Ochota", imagePath: "/images/generic_service_station.png"},
    {name: "Serwis Wola", imagePath: "/images/generic_service_station.png"},
    {name: "Serwis Centrum", imagePath: "/images/generic_service_station.png"},
    {name: "Serwis Praga-Południe", imagePath: "/images/generic_service_station.png"},
];
