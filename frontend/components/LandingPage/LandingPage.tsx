'use client'
import React, { useState, lazy } from 'react'
import NavBar from '@/components/common/NavBar'
import BestRatedSection from './BestRatedSection'
import MostReviewedSection from './MostReviewedSection'
import MostActiveSection from './MostActiveReviewers'
import Footer from '@/components/common/Footer'
import FilterControls from './FilterControls'
import SearchBooksSection from './SearchBooksSection'

const AddBookModal = lazy(() => import('../common/AddBookModal'))

type Section = 'bookRate' | 'activeUsers' | 'mostReviewed' | 'searchBooks'

export default function LandingPage() {
    const [activeSection, setActiveSection] = useState<Section>('searchBooks')
    const [sortOption, setSortOption] = useState({
        bookRate: 'highest',
        activeUsers: 'most',
        mostReviewed: 'most',
        searchBooks: 'ascending',
    })

    const [addBookModalOpen, setAddBookModalOpen] = useState(false) // State for modal visibility

    const handleSectionChange = (section: Section) => {
        setActiveSection(section)
    }

    const handleSortChange = (value: string) => {
        setSortOption({
            ...sortOption,
            [activeSection]: value,
        })
    }

    const handleAddBook = (bookData: unknown) => {
        console.log('New book added:', bookData)
        // Handle book submission logic here
    }

    const renderActiveSection = () => {
        switch (activeSection) {
            case 'bookRate':
                return (
                    <BestRatedSection
                        sortOption={sortOption}
                        onAddBookClick={() => setAddBookModalOpen(true)}
                    />
                )
            case 'activeUsers':
                return <MostActiveSection sortOption={sortOption} />
            case 'mostReviewed':
                return (
                    <MostReviewedSection
                        sortOption={sortOption}
                        onAddBookClick={() => setAddBookModalOpen(true)}
                    />
                )
            case 'searchBooks':
                return (
                    <SearchBooksSection
                        sortOption={sortOption}
                        onAddBookClick={() => setAddBookModalOpen(true)}
                    />
                )
            default:
                return (
                    <SearchBooksSection
                        sortOption={sortOption}
                        onAddBookClick={() => setAddBookModalOpen(true)}
                    />
                )
        }
    }

    return (
        <div className="flex flex-col bg-white text-black w-screen min-h-screen overflow-x-hidden">
            <NavBar />
            <div className="px-6 md:px-12 xl:px-24 py-4">
                <FilterControls
                    activeSection={activeSection}
                    sortOption={sortOption}
                    onSectionChange={handleSectionChange}
                    onSortChange={handleSortChange}
                    onAddBookClick={() => setAddBookModalOpen(true)}
                />
            </div>
            {renderActiveSection()}
            <AddBookModal
                onSubmit={handleAddBook}
                open={addBookModalOpen}
                setOpen={setAddBookModalOpen}
            />
            <Footer />
        </div>
    )
}
