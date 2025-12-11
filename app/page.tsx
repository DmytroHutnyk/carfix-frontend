'use client'

import Header from "@/components/header/header";
import { useAuth } from "@/util/authContext/auth-context";
import { OrbitProgress } from "react-loading-indicators";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcn/card";
import {Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious} from "@/components/shadcn/carousel";
import Image from "next/image";

const services = [
  { name: "Oil Change", imagePath: "/images/oil_change.png"},
  { name: "Brake Repair", imagePath: "/images/brake_pads_replacement.png"},
  { name: "Tire Service", imagePath: "/images/tire_replacement.png"},
  { name: "Engine Diagnostics", imagePath: "/images/engine_diagnostics.png"},
];

function ServiceCard({ name, imagePath }: { name: string; imagePath: string }) {
  return (
    <Card className="overflow-hidden">
      <div className="h-48 bg-muted flex items-center justify-center">
         <Image
             src={imagePath}
             alt={name}
             width={400}
             height={300}
             className="w-full h-full object-cover"/>
      </div>
      <CardHeader>
        <CardTitle className="text-center">{name}</CardTitle>
      </CardHeader>
    </Card>
  );
}

export default function Home() {
  const { isLoading } = useAuth();

  return (
    <div>
      <Header/>
      {isLoading ? (
        <div className="flex min-h-[calc(100vh-80px)] items-center justify-center">
          <OrbitProgress
            color="hsl(var(--primary))"
            size="large"
            text=""
            textColor=""
          />
        </div>
      ) : (
        <main className="mx-auto max-w-[1250px] px-6 py-12 space-y-16">
          {/* Intro Section */}
          <section className="text-center space-y-4 max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Find the Best Car Service Near You
            </h1>
            <p className="text-lg text-muted-foreground">
              Connect with trusted mechanics, compare prices, and book your car service with confidence. Your vehicle deserves the best care.
            </p>
          </section>

          {/* Services Grid //TODO better resizing  */}
          <section className="space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold">Popular Services</h2>
            </div>
            <Carousel opts={{
                align: "start",
                loop: true,
            }} className="w-full">
                <CarouselContent>
                    {services.map((service) => (
                        <CarouselItem key={service.name} className="md:basis-1/2 lg:basis-1/3">
                            <div className="max-w-[400px] mx-auto">
                                <ServiceCard name={service.name} imagePath={service.imagePath}/>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
          </section>

        </main>
      )}
    </div>
  )
}

