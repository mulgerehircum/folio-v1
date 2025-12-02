import CursorGold from "./components/CursorGold"
import Background from "./components/Background"
import Hero from "./components/Hero"
import Expertise from "./components/Expertise"
import Work from "./components/Work"
import Projects from "./components/Projects"
import Contact from "./components/Contact"

function App() {
  return (
    <>
      <CursorGold />
      <div className="relative flex flex-col items-center">
        <Background />
        <div id="about" className="min-h-[calc(100vh-64px)] flex items-center justify-center w-full">
          <Hero />
        </div>
        <Expertise />
        <Work />
        <Projects />
        <Contact />
      </div>
    </>
  )
}

export default App
