import {Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious} from "@/_components/shadcn/carousel";
import ServiceCard from "@/_components/root/ServiceCard";

export default function Home() {

  return (
    <div>
      <div>
            <main className="mx-auto max-w-[1425px] px-4 py-4 space-y-6 lg:px-[72px] lg:py-15 lg:space-y-16">
              {/* Intro Section */}
              <section className="text-center space-y-2 sm:space-y-4 max-w-3xl mx-auto">
                <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight">
                  Find the Best Car Service Near You
                </h1>
                <p className="text-sm sm:text-lg text-muted-foreground">
                  Connect with trusted mechanics, compare prices, and book your car service with confidence. Your vehicle deserves the best care.
                </p>
              </section>

              {/* Services Grid */}
              <section className="space-y-3 lg:space-y-8">
                  <h2 className="text-base sm:text-xl lg:text-3xl font-bold text-center">Popular Services</h2>
                <Carousel opts={{
                    align: "start",
                    loop: true,
                }} className="w-full">
                    <CarouselContent>
                        {services.map((service) => (
                            <CarouselItem key={service.name} className="basis-[85%] md:basis-1/2 lg:basis-1/3">
                                <ServiceCard name={service.name} imagePath={service.imagePath}/>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="left-2 lg:-left-12"/>
                    <CarouselNext className="right-2 lg:-right-12"/>
                </Carousel>
              </section>

                {/* Service stations */}
              <section className="space-y-3 lg:space-y-8">
                  <p className="text-base sm:text-xl lg:text-3xl font-bold text-center">Recommended service points</p>
                  <Carousel opts={{
                      align: "start",
                      loop: true,
                  }} className="w-full">
                      <CarouselContent>
                          {serviceStations.map(station => (
                              <CarouselItem key={station.name} className="basis-[85%] md:basis-1/2 lg:basis-1/3">
                                  <ServiceCard name={station.name} imagePath={station.imagePath}/>
                              </CarouselItem>
                          ))}
                      </CarouselContent>
                      <CarouselPrevious className="left-2 lg:-left-12"/>
                      <CarouselNext className="right-2 lg:-right-12"/>
                  </Carousel>
              </section>

              {/* How to Use CarFix Section */}
              <section className="space-y-3 lg:space-y-8">
                <div className="text-center space-y-2 sm:space-y-4 max-w-2xl mx-auto">
                  <h2 className="text-base sm:text-xl lg:text-3xl font-bold">How to Use CarFix</h2>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    Getting your car serviced has never been easier. Follow these simple steps to connect with trusted mechanics in your area.
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-8">
                  {steps.map((step) => (
                    <div key={step.number} className="flex flex-col items-center text-center space-y-3 sm:space-y-4">
                      <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-primary flex items-center justify-center">
                        <span className="text-xl sm:text-2xl font-bold text-white">{step.number}</span>
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-base sm:text-xl font-semibold">{step.title}</h3>
                        <p className="text-sm text-muted-foreground">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </main>
      </div>
    </div>
  )
}

const services = [
    { name: "Oil Change", imagePath: "/images/oil_change.png"},
    { name: "Brake Repair", imagePath: "/images/brake_pads_replacement.png"},
    { name: "Tire Service", imagePath: "/images/tire_replacement.png"},
    { name: "Engine Diagnostics", imagePath: "/images/engine_diagnostics.png"},
];

const serviceStations = [
    {name: "Serwis Ochota", imagePath: "/images/generic_service_station.png"},
    {name: "Serwis Wola", imagePath: "/images/generic_service_station.png"},
    {name: "Serwis Centrum", imagePath: "/images/generic_service_station.png"},
    {name: "Serwis Praga-Południe", imagePath: "/images/generic_service_station.png"},
]

const reviews = [
    {
        name: "Sarah Johnson",
        review: "Excellent service! They fixed my brakes quickly and the price was very reasonable. Highly recommend!",
        initials: "SJ"
    },
    {
        name: "Mike Chen",
        review: "Found a great mechanic through CarFix. Professional, honest, and got my car running like new again.",
        initials: "MC"
    },
    {
        name: "Emma Davis",
        review: "Super convenient booking system. Saved me so much time finding a reliable service center nearby.",
        initials: "ED"
    },
    {
        name: "John Smith",
        review: "Great experience from start to finish. The mechanic was knowledgeable and explained everything clearly.",
        initials: "JS"
    },
];

const steps = [
    {
        number: 1,
        title: "Search & Compare",
        description: "Find service centers near you and compare prices, reviews, and services offered."
    },
    {
        number: 2,
        title: "Book Online",
        description: "Schedule your appointment online at your convenience with instant confirmation."
    },
    {
        number: 3,
        title: "Get Service",
        description: "Arrive at your scheduled time and enjoy professional, reliable car service."
    },
];
