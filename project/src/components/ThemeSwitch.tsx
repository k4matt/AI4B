"use client";

import { useLayoutEffect, useState } from "react";
import styles from './ThemeSwitch.module.css';

export default function ThemeSwitch() {
    const [isDark, setIsDark] = useState(false);

    useLayoutEffect(() => {
        if (typeof window !== "undefined") {
            const saved = localStorage.getItem("theme");
            const isDarkSaved = saved === "dark" || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
            setIsDark(isDarkSaved);
            
            if (isDarkSaved) {
                document.documentElement.classList.add("dark");
            } else {
                document.documentElement.classList.remove("dark");
            }
        }
    }, []);

    const toggleTheme = () => {
        const rootElement = document.documentElement;
        
        if (isDark) {
            rootElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
            setIsDark(false);
        } else {
            rootElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
            setIsDark(true);
        }
    };

    return (
        <label className={styles.themeSwitch}>
            <input
                type="checkbox"
                className={styles.themeSwitchCheckbox}
                checked={isDark}
                onChange={toggleTheme}
                id="theme-toggle"
            />
            <div className={styles.themeSwitchContainer}>
                <div className={styles.themeSwitchClouds}></div>
                <div className={styles.themeSwitchStarsContainer}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 144 55" fill="currentColor">
                        <path d="M135.831 3.00688C135.055 3.85027 134.111 4.29946 133 4.35447C134.111 4.40947 135.055 4.85867 135.831 5.71123C136.607 6.55462 136.996 7.56303 136.996 8.72727C136.996 7.95722 137.172 7.25134 137.525 6.59129C137.886 5.93124 138.372 5.39954 138.98 5.00535C139.598 4.60199 140.268 4.39114 141 4.35447C139.88 4.2903 138.936 3.85027 138.16 3.00688C137.384 2.16348 136.996 1.16425 136.996 0C136.996 1.16425 136.607 2.16348 135.831 3.00688Z" />
                    </svg>
                </div>
                <div className={styles.themeSwitchCircleContainer}>
                    <div className={styles.themeSwitchSunMoonContainer}>
                        <div className={styles.themeSwitchMoon}>
                            <div className={styles.themeSwitchSpot}></div>
                            <div className={styles.themeSwitchSpot}></div>
                            <div className={styles.themeSwitchSpot}></div>
                        </div>
                    </div>
                </div>
            </div>
        </label>
    );
}