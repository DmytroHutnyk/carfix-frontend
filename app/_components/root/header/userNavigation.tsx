import CarProfileSelector from "@/_components/root/header/carProfileSelector";
import {Button} from "@/_components/shadcn/button";
import Link from "next/link";

export default function UserNavigation(){
    return (
        <>
            <CarProfileSelector/>
            <Button variant="headerOutline" asChild>
                <Link href="/profile">My Account</Link>
            </Button>
        </>
    )
}