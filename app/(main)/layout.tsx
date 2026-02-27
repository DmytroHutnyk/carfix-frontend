import '@/styles/global.css'
import Providers from "@/util/providers/providers";
import Header from "@/_components/root/header/header";

export default function RootLayout({ children }: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
        <body>
        <Providers>
            <Header/>
            {children}
        </Providers>
        </body>
        </html>
    )
}