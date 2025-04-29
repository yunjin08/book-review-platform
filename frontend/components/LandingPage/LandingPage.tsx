import FilterControls from './FilterControls'

type Section = 'bookRate' | 'activeUsers' | 'mostReviewed'
import React, { useState, lazy } from 'react'
import NavBar from '@/components/common/NavBar'
import BestRatedSection from './BestRatedSection'
import Footer from '@/components/common/Footer'

const MostReviewedSection = lazy(() => import('./MostReviewedSection'))
const MostActiveSection = lazy(() => import('./MostActiveReviewers'))

export default function LandingPage() {
    const [activeSection, setActiveSection] = useState<Section>('mostReviewed')
    const [sortOption, setSortOption] = useState({
        bookRate: 'highest',
        activeUsers: 'most',
        mostReviewed: 'most',
    })

    const handleSectionChange = (section: Section) => {
        setActiveSection(section)
    }

    const handleSortChange = (value: string) => {
        setSortOption({
            ...sortOption,
            [activeSection]: value,
        })
    }

    const renderActiveSection = () => {
        switch (activeSection) {
            case 'bookRate':
                return <BestRatedSection />
            case 'activeUsers':
                return <MostActiveSection />
            case 'mostReviewed':
                return <MostReviewedSection />
            default:
                return <MostReviewedSection />
        }
    }

    return (
        <div className="flex flex-col bg-white text-black w-screen min-h-screen">
            <NavBar
                activeSection={activeSection}
                onSectionChange={handleSectionChange}
            />
            <div className="md:px-24 xl:px-72 xl:px-24 pt-4 md:pt-8">
                <FilterControls
                    activeSection={activeSection}
                    sortOption={sortOption}
                    onSectionChange={handleSectionChange}
                    onSortChange={handleSortChange}
                />
            </div>
            {renderActiveSection()}
            <Footer />
        </div>
    )
}
