import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { EmergencyPage } from '@/features/emergency/presentation/EmergencyPage'
export default function App() {
  return (
    <>
      <Header />
      <EmergencyPage />
      <Footer />
    </>
  )
}
