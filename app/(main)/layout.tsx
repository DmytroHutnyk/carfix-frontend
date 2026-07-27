import Header from "@/_components/root/header/header";

export default function MainLayout({ children }: {
    children: React.ReactNode
}) {
    return (
        <>
            <Header/>
            {children}
        </>
    )
}