import PlaneTrail from './components/canvas/PlaneTrail'
import ScrollProgress from './components/ui/ScrollProgress'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Hero from './sections/Hero'
import About from './sections/About'
import Projects from './sections/Projects'
import Drawings from './sections/Drawings'
import Publications from './sections/Publications'
import Skills from './sections/Skills'
import Resume from './sections/Resume'
import Contact from './sections/Contact'

export default function App() {
  return (
    <div className="min-h-screen bg-background text-text">
      <PlaneTrail />
      <ScrollProgress />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Projects />
        <Drawings />
        <Publications />
        <Skills />
        <Resume />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
