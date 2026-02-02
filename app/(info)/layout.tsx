import '@/styles/global.css'
import Footer from "@/_components/root/footer";
import Header from "@/_components/root/header/header";

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
      <div>
          <Header/>
          {children}
      </div>
  )
}

