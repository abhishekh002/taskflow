'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import styles from './page.module.css';

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className={styles.page}>
      <Navbar />
      
      <main className={styles.main}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={`${styles.badge} animate-fade-in`}>
            <span>🚀 Introducing TaskFlow 1.0</span>
          </div>
          <h1 className={`${styles.title} animate-fade-in`}>
            Master your workflow with <span className="text-gradient">TaskFlow</span>
          </h1>
          <p className={styles.subtitle}>
            An ultra-modern, glassmorphic task tracker for developers and high-achievers. 
            Organize, filter, and execute tasks with speed and elegance.
          </p>

          <div className={styles.ctas}>
            {isAuthenticated ? (
              <Link href="/dashboard" className={styles.primaryBtn}>
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link href="/register" className={styles.primaryBtn}>
                  Get Started for Free
                </Link>
                <Link href="/login" className={styles.secondaryBtn}>
                  Live Demo Login
                </Link>
              </>
            )}
          </div>
        </section>

        {/* Feature Cards Grid */}
        <section className={styles.features}>
          <h2 className={styles.sectionTitle}>Engineered for High-Productivity</h2>
          <div className={styles.grid}>
            <div className={`${styles.card} glass-panel`}>
              <div className={styles.cardHeader}>
                <div className={`${styles.iconWrapper} ${styles.violet}`}>🔑</div>
                <h3>Stateless Auth</h3>
              </div>
              <p>Secure authentication powered by Spring Security and JSON Web Tokens (JWT) stored client-side.</p>
            </div>

            <div className={`${styles.card} glass-panel`}>
              <div className={styles.cardHeader}>
                <div className={`${styles.iconWrapper} ${styles.blue}`}>📋</div>
                <h3>Kanban Dashboard</h3>
              </div>
              <p>Manage task lifecycles visually with intuitive stages: Todo, In Progress, and Completed.</p>
            </div>

            <div className={`${styles.card} glass-panel`}>
              <div className={styles.cardHeader}>
                <div className={`${styles.iconWrapper} ${styles.pink}`}>🔍</div>
                <h3>Filter & Search</h3>
              </div>
              <p>Instantly search titles/descriptions and filter tasks by status or priority levels.</p>
            </div>

            <div className={`${styles.card} glass-panel`}>
              <div className={styles.cardHeader}>
                <div className={`${styles.iconWrapper} ${styles.emerald}`}>🐳</div>
                <h3>Docker Containerized</h3>
              </div>
              <p>Packaged with Docker Compose for standard environments across development and production.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <p>© {new Date().getFullYear()} TaskFlow. Built with Spring Boot 3 & Next.js 15.</p>
          <div className={styles.footerLinks}>
            <a href="https://github.com/abhishekh002/taskflow" target="_blank" rel="noreferrer">GitHub</a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer">LinkedIn</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
