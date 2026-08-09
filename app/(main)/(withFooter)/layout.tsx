import Footer from "@/_components/root/footer";

export default function WithFooterLayout({ children }: {
    children: React.ReactNode
}) {
    return (
        <>
            {/* flex-1 inside the column from (main)/layout.tsx: short pages grow, the footer lands at the bottom */}
            <div className="flex-1">
                {children}
            </div>
            <Footer/>
        </>
    )
}
