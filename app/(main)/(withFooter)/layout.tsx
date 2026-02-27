import '@/styles/global.css'
import Providers from "@/util/providers/providers";
import Footer from "@/_components/root/footer";

export default function RootLayout({ children }: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
        <body>
        <Providers>
            {children}
            <Footer/>
        </Providers>
        </body>
        </html>
    )
}