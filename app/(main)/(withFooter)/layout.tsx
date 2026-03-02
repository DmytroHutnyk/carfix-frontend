import Footer from "@/_components/root/footer";

export default function WithFooterLayout({ children }: {
    children: React.ReactNode
}) {
    return (
        <>
            {children}
            <Footer/>
        </>
    )
}