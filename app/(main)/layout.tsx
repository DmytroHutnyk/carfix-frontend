import Header from "@/_components/root/header/header";

export default function MainLayout({ children }: {
    children: React.ReactNode
}) {
    return (
        /* Full-height column so nested layouts can push a footer to the bottom of short
           pages. The header is part of this column, so its height is already accounted for. */
        <div className="flex min-h-screen flex-col">
            <Header/>
            <div className="flex flex-1 flex-col">
                {children}
            </div>
        </div>
    )
}
