'use client';

import { useRef, useState } from "react";
import styles from "./page.module.css";
import Link from "next/link";

export default function Home() {
  const scrollRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const images = [
    "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1522071823942-b8957df4c94c?q=80&w=2070&auto=format&fit=crop"
  ];

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const index = Math.round(scrollLeft / clientWidth);
      setActiveIndex(index);
    }
  };

  const scrollTo = (index) => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        left: index * scrollRef.current.clientWidth,
        behavior: "smooth"
      });
    }
  };

  return (
    <div className={styles.main}>
      {/* Layer 1: Hero Section */}
      <section className={styles.hero}>
        <nav className={styles.navbar}>
          <div className={styles.logo}>E - PUBLIC DISTRIBUTION SYSTEMS</div>
          <div className={styles.navLinks}>
            <Link href="/">Home</Link>
            <Link href="#about">About</Link>
            <Link href="#services">Services</Link>
            <Link href="/login">Login</Link>
            <Link href="/signup">Sign Up</Link>
          </div>
        </nav>

        <div className={styles.heroContent}>
          <div className={styles.heroImageWrapper}>
            <div className={styles.heroImageFrame}></div>
            <img 
              src="https://images.unsplash.com/photo-1512314889357-e157c22f938d?q=80&w=2071&auto=format&fit=crop" 
              alt="Digital Transformation" 
              className={styles.heroImage}
            />
          </div>
          <div className={styles.heroText}>
            <h4 className={styles.heroGreeting}>Digital India Initiative</h4>
            <h1 className={styles.heroTitle}>Electronic Public Distribution System</h1>
            <p className={styles.heroSubtitle}>
              Ensuring food security through transparent, efficient, and technology-driven distribution of essential commodities to every citizen.
            </p>
            <div className={styles.heroButtons}>
              <Link href="/login" className={styles.btnPrimary}>GET STARTED</Link>
              <Link href="#about" className={styles.btnSecondary}>LEARN MORE</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Layer 2: About Section */}
      <section id="about" className={styles.about}>
        <div className={styles.aboutBox}>
          <div className={styles.aboutBoxImageContainer}>
            <div 
              className={styles.aboutImageScroll} 
              ref={scrollRef} 
              onScroll={handleScroll}
            >
              {images.map((url, index) => (
                <div 
                  key={index} 
                  className={styles.aboutBoxImage} 
                  style={{ backgroundImage: `url(${url})` }}
                />
              ))}
            </div>
            
            {/* Navigation Dots */}
            <div className={styles.scrollDots}>
              {images.map((_, index) => (
                <div 
                  key={index} 
                  className={`${styles.dot} ${activeIndex === index ? styles.activeDot : ""}`}
                  onClick={() => scrollTo(index)}
                />
              ))}
            </div>

            {/* Navigation Arrows */}
            <button 
              className={`${styles.scrollArrow} ${styles.leftArrow}`}
              onClick={() => scrollTo(activeIndex - 1)}
              disabled={activeIndex === 0}
            >
              &#10094;
            </button>
            <button 
              className={`${styles.scrollArrow} ${styles.rightArrow}`}
              onClick={() => scrollTo(activeIndex + 1)}
              disabled={activeIndex === images.length - 1}
            >
              &#10095;
            </button>
          </div>
        </div>
      </section>

      {/* Layer 3: Services Section */}
      <section id="services" className={styles.services}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Our Services</h2>
          <p className={styles.sectionDesc}>
            Empowering citizens with digital tools to access their entitlements with ease and transparency.
          </p>
        </div>

        <div className={styles.servicesGrid}>
          <div className={styles.serviceCard}>
            <div className={styles.serviceIcon}>📱</div>
            <h4 className={styles.serviceTitle}>Smart Ration Card</h4>
            <p className={styles.serviceText}>
              Access your digital ration card anytime, anywhere. No more physical queues or lost documents.
            </p>
          </div>

          <div className={styles.serviceCard}>
            <div className={styles.serviceIcon}>📦</div>
            <h4 className={styles.serviceTitle}>Inventory Tracking</h4>
            <p className={styles.serviceText}>
              Real-time updates on grain availability at your nearest Fair Price Shop (FPS).
            </p>
          </div>

          <div className={styles.serviceCard}>
            <div className={styles.serviceIcon}>📍</div>
            <h4 className={styles.serviceTitle}>Store Locator</h4>
            <p className={styles.serviceText}>
              Easily find and navigate to the nearest distribution center with our integrated mapping service.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
