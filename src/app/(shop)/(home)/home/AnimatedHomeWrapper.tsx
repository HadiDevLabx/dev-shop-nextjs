'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

// Conditionally import and register ScrollTrigger only on client side
let ScrollTrigger: any = null
if (typeof window !== 'undefined') {
  ScrollTrigger = require('gsap/ScrollTrigger').ScrollTrigger
  gsap.registerPlugin(ScrollTrigger)
}

interface AnimatedHomeWrapperProps {
  children: React.ReactNode
}

const AnimatedHomeWrapper: React.FC<AnimatedHomeWrapperProps> = ({ children }) => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Only run animations on client side
    if (typeof window === 'undefined' || !containerRef.current || !ScrollTrigger) return

    const ctx = gsap.context(() => {
      // Hero section animation - fade in from top
      gsap.fromTo('[data-animate="hero"]', {
        opacity: 0,
        y: -50,
      }, {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: "power3.out",
      })

      // How it works section - slide in from left
      gsap.fromTo('[data-animate="how-it-works"]', {
        opacity: 0,
        x: -100,
      }, {
        opacity: 1,
        x: 0,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: '[data-animate="how-it-works"]',
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      })

      // Featured items section - stagger animation
      gsap.fromTo('[data-animate="featured-items"]', {
        opacity: 0,
        y: 60,
      }, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: '[data-animate="featured-items"]',
          start: "top 85%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      })

      // Product slider - scale and fade in
      gsap.fromTo('[data-animate="product-slider"]', {
        opacity: 0,
        scale: 0.9,
      }, {
        opacity: 1,
        scale: 1,
        duration: 1,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: '[data-animate="product-slider"]',
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      })

      // Divider - simple fade with width animation
      gsap.fromTo('[data-animate="divider"]', {
        opacity: 0,
        scaleX: 0,
      }, {
        opacity: 1,
        scaleX: 1,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: '[data-animate="divider"]',
          start: "top 90%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      })

      // Testimonials - slide in from right
      gsap.fromTo('[data-animate="testimonials"]', {
        opacity: 0,
        x: 100,
      }, {
        opacity: 1,
        x: 0,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: '[data-animate="testimonials"]',
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      })

      // Add subtle parallax effect to sections
      gsap.to('[data-animate]', {
        yPercent: -5,
        ease: "none",
        scrollTrigger: {
          trigger: '[data-animate]',
          start: "top bottom",
          end: "bottom top",
          scrub: 1
        }
      })

      // Add floating animation to hero on load
      gsap.to('[data-animate="hero"]', {
        y: "+=10",
        duration: 2,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        delay: 1.5
      })

    }, containerRef)

    // Cleanup function
    return () => {
      ctx.revert()
      if (ScrollTrigger && typeof window !== 'undefined') {
        ScrollTrigger.getAll().forEach((trigger: any) => trigger.kill())
      }
    }
  }, [])

  return (
    <div ref={containerRef} className="animated-home-wrapper">
      {children}
    </div>
  )
}

export default AnimatedHomeWrapper
