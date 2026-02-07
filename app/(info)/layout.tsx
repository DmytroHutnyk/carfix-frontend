import '@/styles/global.css'
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

