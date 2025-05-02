'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function AnimatedBookBackground() {
    const [mounted, setMounted] = useState(false)
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
    const [books, setBooks] = useState([])

    // Generate random book configurations only on client-side
    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({
                x: e.clientX,
                y: e.clientY,
            })
        }
        console.log('sdfs')

        window.addEventListener('mousemove', handleMouseMove)

        // Generate books only on client-side to avoid hydration mismatch
        const generatedBooks = generateBooks()
        setBooks(generatedBooks)
        setMounted(true)

        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
        }
    }, [])

    // Function to generate random book configurations
    const generateBooks = () => {
        const booksArray = []
        const colors = [
            'bg-amber-700',
            'bg-emerald-800',
            'bg-indigo-700',
            'bg-rose-700',
            'bg-purple-800',
            'bg-blue-800',
            'bg-teal-700',
            'bg-red-900',
        ]

        for (let i = 0; i < 24; i++) {
            const x = Math.floor(Math.random() * 100)
            const y = Math.floor(Math.random() * 100)
            const width = Math.floor(Math.random() * 10) + 2
            const height = Math.floor(Math.random() * 15) + 12
            const color = colors[Math.floor(Math.random() * colors.length)]
            const delay = Math.random() * 2
            const rotate = Math.random() * 6 - 3

            booksArray.push({
                id: i,
                x,
                y,
                width,
                height,
                color,
                delay,
                rotate,
            })
        }

        return booksArray
    }

    const floatingBookVariants = {
        hover: {
            y: [-5, 5],
            transition: {
                y: {
                    duration: 1.5,
                    repeat: Infinity,
                    repeatType: 'reverse',
                    ease: 'easeInOut',
                },
            },
        },
    }

    // Page counts for floating pages
    const pageCount = 12

    // Only render the animated content after client-side mount
    if (!mounted) {
        return (
            <div className="fixed inset-0 overflow-hidden -z-10 bg-gradient-to-br from-slate-100 to-slate-200 opacity-70" />
        )
    }

    return (
        <div className="fixed inset-0 overflow-hidden -z-10 bg-gradient-to-br from-slate-100 to-slate-200 opacity-70">
            {books.map((book) => (
                <motion.div
                    key={book.id}
                    className={`absolute ${book.color} rounded shadow-lg`}
                    style={{
                        left: `${book.x}%`,
                        top: `${book.y}%`,
                        width: `${book.width}%`,
                        height: `${book.height}%`,
                        transformOrigin: 'center',
                        opacity: 0.15,
                    }}
                    initial={{ rotate: book.rotate, y: 20, opacity: 0 }}
                    animate={{
                        rotate: book.rotate,
                        y: 0,
                        opacity: 0.15,
                        x: mousePosition.x * 0.01,
                    }}
                    transition={{
                        delay: book.delay,
                        duration: 0.5,
                    }}
                    variants={floatingBookVariants}
                    whileInView="hover"
                />
            ))}

            {/* Floating page elements */}
            {Array.from({ length: pageCount }).map((_, index) => {
                const size = Math.random() * 40 + 30
                const startX = Math.random() * 100
                const startY = Math.random() * 100
                const delay = Math.random() * 30
                const duration = Math.random() * 60 + 60

                return (
                    <motion.div
                        key={`page-${index}`}
                        className="absolute bg-white rounded-sm opacity-20"
                        style={{
                            width: size,
                            height: size * 1.3,
                            left: `${startX}%`,
                            top: `${startY}%`,
                        }}
                        initial={{ y: -100, x: 0, rotate: Math.random() * 180 }}
                        animate={{
                            y: '100vh',
                            x: [0, 50, -50, 30, -30, 0],
                            rotate: Math.random() * 360,
                        }}
                        transition={{
                            duration: duration,
                            delay: delay,
                            repeat: Infinity,
                            ease: 'linear',
                            x: {
                                duration: duration / 3,
                                repeat: Infinity,
                                repeatType: 'reverse',
                                ease: 'easeInOut',
                            },
                        }}
                    />
                )
            })}

            {/* Glowing circles for ambiance */}
            <motion.div
                className="absolute rounded-full bg-gradient-to-r from-blue-300 to-purple-300 blur-3xl"
                style={{
                    width: '40vw',
                    height: '40vw',
                    opacity: 0.15,
                }}
                initial={{ x: '10%', y: '60%' }}
                animate={{
                    x: ['10%', '15%', '5%', '10%'],
                    y: ['60%', '55%', '65%', '60%'],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    repeatType: 'reverse',
                    ease: 'easeInOut',
                }}
            />

            <motion.div
                className="absolute rounded-full bg-gradient-to-r from-amber-200 to-rose-300 blur-3xl"
                style={{
                    width: '30vw',
                    height: '30vw',
                    opacity: 0.1,
                }}
                initial={{ x: '70%', y: '30%' }}
                animate={{
                    x: ['70%', '75%', '65%', '70%'],
                    y: ['30%', '25%', '35%', '30%'],
                }}
                transition={{
                    duration: 15,
                    repeat: Infinity,
                    repeatType: 'reverse',
                    ease: 'easeInOut',
                }}
            />
        </div>
    )
}
