import {Card, CardHeader, CardTitle} from "@/_components/shadcn/card";
import Image from "next/image";

export default function ServiceCard({ name, imagePath }: { name: string; imagePath: string }) {
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