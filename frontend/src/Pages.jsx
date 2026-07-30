import { useState } from 'react'
import { Navbar } from './Components/navbar'
import { HeroSection } from './Components/hero'
import { DestinationsSection } from './Components/destinations'
import { ToursSection } from './Components/toursection'
import { AgenciesSection } from './Components/agencies'
import { FeaturesSection } from './Components/features'
import { TestimonialsSection } from './Components/testimonials'
import { CTASection } from './Components/CTA'
import { Footer } from './Components/footer'
import { randomValue } from './RandomCartCode'
import { useEffect } from 'react'


function Pages() {

  useEffect(() => {
    if (localStorage.getItem("fav_code") === null) {
      localStorage.setItem("fav_code", randomValue)
    }
  }, [])


  return (
    <div>
      <Navbar />
      <HeroSection />
      {/* <DestinationsSection />
      <ToursSection />
      <AgenciesSection /> */}
      <FeaturesSection />
      {/* <TestimonialsSection /> */}
      <CTASection />
      <Footer />
    </div>
  )
}

export default Pages
