"use client"

import {useEffect} from "react";
import {ExternalLink, MapPin} from "lucide-react";
import {Map, Marker, useMap} from "@vis.gl/react-google-maps";
import GoogleApiProvider from "@/lib/providers/googleApiProvider";
import {Button} from "@/_components/shadcn/button";
import {Card, CardContent} from "@/_components/shadcn/card";
import {Workshop} from "@/features/workshop/workshopTypes";
import {mapsUrl} from "@/features/workshop/workshopList";

export default function MapCard({workshop}: { workshop: Workshop }) {
    const lat = workshop.latitude;
    const lng = workshop.longitude;
    const url = mapsUrl(workshop);

    return (
        <Card>
            <CardContent className="flex flex-col gap-3 p-4">
                {lat != null && lng != null ? (
                    <div className="h-36 w-full overflow-hidden rounded-lg lg:h-44">
                        <GoogleApiProvider>
                            <Map
                                defaultCenter={{lat, lng}}
                                defaultZoom={15}
                                disableDefaultUI
                                keyboardShortcuts={false}
                                gestureHandling="none"
                                clickableIcons={false}
                            >
                                <WorkshopMarker lat={lat} lng={lng}/>
                            </Map>
                        </GoogleApiProvider>
                    </div>
                ) : (
                    <div className="flex h-36 w-full items-center justify-center rounded-lg bg-muted lg:h-44">
                        <MapPin className="h-8 w-8 text-muted-foreground"/>
                    </div>
                )}
                {url && (
                    <Button asChild size="sm" className="w-full lg:h-9 lg:px-4 lg:py-2 lg:text-sm">
                        <a href={url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4"/> See on Maps
                        </a>
                    </Button>
                )}
            </CardContent>
        </Card>
    );
}

function WorkshopMarker({lat, lng}: { lat: number; lng: number }) {
    const map = useMap();

    useEffect(() => {
        if (!map) return;
        const refit = () => {
            google.maps.event.trigger(map, "resize");
            map.setCenter({lat, lng});
        };
        const observer = new ResizeObserver(refit);
        observer.observe(map.getDiv());
        refit();
        return () => observer.disconnect();
    }, [map, lat, lng]);

    return <Marker position={{lat, lng}}/>;
}
