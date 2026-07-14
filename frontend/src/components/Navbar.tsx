'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <Link href="/">
            <span className="text-gradient">TaskFlow</span>
          </Link>
        </div>

        <nav className={styles.nav}>
          {isAuthenticated ? (
            <>
              <Link href="/dashboard" className={styles.navLink}>
                Dashboard
              </Link>
              <div className={styles.userSection}>
                <span className={styles.greeting}>
                  Hi, <strong>{user?.username}</strong>
                </span>
                <button onClick={logout} className={styles.logoutBtn}>
                  Log Out
                </button>
              </div>
            </>
          ) : (
            <>
              <Link href="/login" className={styles.navLink}>
                Log In
              </Link>
              <Link href="/register" className={styles.registerBtn}>
                Get Started
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
