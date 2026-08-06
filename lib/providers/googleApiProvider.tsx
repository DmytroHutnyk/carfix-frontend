"use client"
import {ReactNode} from "react";
import {APIProvider} from "@vis.gl/react-google-maps";

const API_KEY: string = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string;

export default function GoogleApiProvider(
    { children }: { children: ReactNode}
) {
    return (
        <APIProvider apiKey={API_KEY}>
            {children}
        </APIProvider>
    );
}