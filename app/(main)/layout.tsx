import Header from "@/_components/root/header/header";

export default function MainLayout({ children }: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen flex-col">
            <Header/>
            <div className="flex flex-1 flex-col">
                {children}
            </div>
        </div>
    )
}
