import ChatApp from '@/components/ChatApp'
import StaticSection from '@/components/StaticSection'

export default function HomePage() {
  return (
    <div style={{ position: 'relative', overflowX: 'hidden' }}>
      <ChatApp />
      <div id="portfolio" className="relative" style={{ zIndex: 1 }}>
        <StaticSection />
      </div>
    </div>
  )
}
