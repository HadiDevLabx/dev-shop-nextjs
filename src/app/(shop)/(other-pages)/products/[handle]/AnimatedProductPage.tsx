'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

// Conditionally import and register ScrollTrigger only on client side
let ScrollTrigger: any = null
if (typeof window !== 'undefined') {
  ScrollTrigger = require('gsap/ScrollTrigger').ScrollTrigger
  gsap.registerPlugin(ScrollTrigger)
}

interface AnimatedProductPageProps {
  children: React.ReactNode
}

const AnimatedProductPage: React.FC<AnimatedProductPageProps> = ({ children }) => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Only run animations on client side
    if (typeof window === 'undefined' || !containerRef.current || !ScrollTrigger) return

    const ctx = gsap.context(() => {
      // Initial state - hide all elements
      gsap.set('[data-animate="gallery"]', { opacity: 0, x: -100, scale: 0.95 })
      gsap.set('[data-animate="breadcrumb"]', { opacity: 0, y: -30 })
      gsap.set('[data-animate="title"]', { opacity: 0, y: 30 })
      gsap.set('[data-animate="price"]', { opacity: 0, scale: 0.8 })
      gsap.set('[data-animate="rating"]', { opacity: 0, x: 50 })
      gsap.set('[data-animate="product-form"]', { opacity: 0, y: 50 })
      gsap.set('[data-animate="accordion"]', { opacity: 0, y: 30 })
      gsap.set('[data-animate="policy"]', { opacity: 0, y: 30 })
      gsap.set('[data-animate="details"]', { opacity: 0, y: 50 })
      gsap.set('[data-animate="reviews"]', { opacity: 0, y: 50 })
      gsap.set('[data-animate="related"]', { opacity: 0, y: 50 })

      // Create timeline for entrance animations
      const tl = gsap.timeline()

      // Gallery animation - slide in from left
      tl.to('[data-animate="gallery"]', {
        opacity: 1,
        x: 0,
        scale: 1,
        duration: 1,
        ease: "power3.out"
      })

      // Breadcrumb animation - drop down
      .to('[data-animate="breadcrumb"]', {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out"
      }, "-=0.7")

      // Title animation - slide up
      .to('[data-animate="title"]', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out"
      }, "-=0.4")

      // Price animation - scale up
      .to('[data-animate="price"]', {
        opacity: 1,
        scale: 1,
        duration: 0.6,
        ease: "back.out(1.7)"
      }, "-=0.5")

      // Rating animation - slide from right
      .to('[data-animate="rating"]', {
        opacity: 1,
        x: 0,
        duration: 0.6,
        ease: "power2.out"
      }, "-=0.4")

      // Product form animation - slide up
      .to('[data-animate="product-form"]', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out"
      }, "-=0.3")

      // Accordion animation - slide up
      .to('[data-animate="accordion"]', {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out"
      }, "-=0.4")

      // Policy animation - slide up
      .to('[data-animate="policy"]', {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out"
      }, "-=0.4")

      // Scroll-triggered animations for lower sections
      gsap.to('[data-animate="details"]', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: '[data-animate="details"]',
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      })

      gsap.to('[data-animate="reviews"]', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: '[data-animate="reviews"]',
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      })

      gsap.to('[data-animate="related"]', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: '[data-animate="related"]',
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      })

      // Add parallax effect to gallery
      gsap.to('[data-animate="gallery"]', {
        yPercent: -10,
        ease: "none",
        scrollTrigger: {
          trigger: '[data-animate="gallery"]',
          start: "top bottom",
          end: "bottom top",
          scrub: 1
        }
      })

      // Add floating animation to price
      gsap.to('[data-animate="price"]', {
        y: "+=5",
        duration: 2,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        delay: 2
      })

      // Add subtle hover effect to product form elements
      const formElements = containerRef.current?.querySelectorAll('[data-animate="product-form"] button, [data-animate="product-form"] .color-option, [data-animate="product-form"] .size-option')
      
      formElements?.forEach((element) => {
        element.addEventListener('mouseenter', () => {
          gsap.to(element, {
            scale: 1.05,
            duration: 0.2,
            ease: "power2.out"
          })
        })
        
        element.addEventListener('mouseleave', () => {
          gsap.to(element, {
            scale: 1,
            duration: 0.2,
            ease: "power2.out"
          })
        })
      })

    }, containerRef)

    return () => {
      ctx.revert()
      if (ScrollTrigger && typeof window !== 'undefined') {
        ScrollTrigger.getAll().forEach((trigger: any) => trigger.kill())
      }
    }
  }, [])

  return (
    <div ref={containerRef} className="animated-product-page">
      {children}
    </div>
  )
}

export default AnimatedProductPage
