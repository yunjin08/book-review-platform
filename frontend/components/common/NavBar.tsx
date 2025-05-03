import React, { useState, useEffect } from 'react'
import { FaUserCircle } from 'react-icons/fa'
import { IoSearch } from 'react-icons/io5'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store/auth'
import { useRouter } from 'next/navigation'
import { useBookReadingStore } from '@/store/book'

export default function NavBar() {
    // State to track the selected sort option for each filter

    const { isAuthenticated, logout } = useAuthStore()
    const { fetchAll: fetchAllBookReadingHistory, items: bookReadingHistory } =
        useBookReadingStore()
    const router = useRouter()

    // State for the "Read History" modal
    const [isReadHistoryModalOpen, setIsReadHistoryModalOpen] = useState(false)

    useEffect(() => {
        // Check if the user is authenticated
        if (fetchAllBookReadingHistory) {
            fetchAllBookReadingHistory()
                .then((response) => {
                    console.log('Book reading history:', response)
                })
                .catch((error) => {
                    console.error('Error fetching book reading history:', error)
                })
        }
    }, [])

    const exportToCSV = () => {
        const csvRows = [
            ['ID', 'Book ID', 'Date Started', 'Date Finished', 'Status'], // Header row
            ...bookReadingHistory.map((entry) => [
                entry.id,
                entry.book.title,
                entry.book.author,
                entry.date_started,
                entry.date_finished,
                entry.status,
            ]),
        ]

        // Convert rows to CSV string
        const csvContent = csvRows.map((row) => row.join(',')).join('\n')

        // Create a Blob and download the file
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', 'read_history.csv') // File name
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    const handleLogout = () => {
        try {
            logout()
        } catch (error) {
            console.error('Logout failed:', error)
        }
    }

    return (
        <>
            <nav className="md:sticky md:top-0 flex flex-col md:flex-row shadow-xl w-full px-6 md:px-12 xl:px-24 py-4 md:py-4 items-center justify-between border-b-2 bg-white border-slate-800 gap-4 z-10">
                <div className="flex flex-col md:flex-row justify-between items-center w-full gap-4">
                    <div className="flex flex-row text-sm md:text-2xl font-bold hover:opacity-50 cursor-pointer w-full md:w-auto justify-between md:justify-center items-center">
                        Library ni Jed
                        <div className="flex md:hidden items-center">
                            <button
                                className="flex items-center text-slate-800 hover:opacity-50 transition cursor-pointer"
                                onClick={() => {
                                    console.log('Go to user profile')
                                }}
                            >
                                <FaUserCircle size={32} />
                            </button>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="flex items-center text-slate-800 hover:opacity-50 transition cursor-pointer">
                                    <FaUserCircle size={32} />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                {isAuthenticated ? (
                                    <>
                                        <DropdownMenuItem
                                            className="cursor-pointer"
                                            onClick={() =>
                                                setIsReadHistoryModalOpen(true)
                                            }
                                        >
                                            View Read History
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            className="cursor-pointer"
                                            onClick={() =>
                                                console.log(
                                                    'Navigate to ratings'
                                                )
                                            }
                                        >
                                            View Ratings
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            className="cursor-pointer text-red-500"
                                            onClick={handleLogout}
                                        >
                                            Logout
                                        </DropdownMenuItem>
                                    </>
                                ) : (
                                    <DropdownMenuItem
                                        className="cursor-pointer hover:bg-gray-200"
                                        onClick={() => router.push('/login')}
                                    >
                                        Login
                                    </DropdownMenuItem>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                {/* Mobile search bar */}
                <div className="flex md:hidden w-full relative">
                    <input
                        type="text"
                        placeholder="Search for books..."
                        className="flex-1 py-2 rounded-2xl bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-slate-800 transition px-4 text-sm"
                    />
                    <button
                        className="bg-slate-800 h-full rounded-r-2xl absolute right-0 top-0 font-semibold px-3 transition cursor-pointer"
                        onClick={() => {
                            console.log('Search clicked')
                        }}
                    >
                        <IoSearch size={20} className="text-white" />
                    </button>
                </div>
            </nav>
            {/* Read History Modal */}
            <Dialog
                open={isReadHistoryModalOpen}
                onOpenChange={setIsReadHistoryModalOpen}
            >
                <DialogContent className="max-w-md text-black bg-white">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold">
                            Read History
                        </DialogTitle>
                    </DialogHeader>
                    <div className="p-4 space-y-4">
                        {bookReadingHistory.length > 0 ? (
                            bookReadingHistory.map((entry) => (
                                <div
                                    key={entry.id}
                                    className="border-b pb-4 flex items-start gap-4"
                                >
                                    <img
                                        src={entry.book.cover_image}
                                        alt={entry.book.title}
                                        className="w-16 h-24 object-cover rounded-md"
                                    />
                                    <div>
                                        <p className="text-sm font-semibold">
                                            {entry.book.title}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            by {entry.book.author}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            Date Started: {entry.date_started}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            Date Finished: {entry.date_finished}
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            Status: {entry.status}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-gray-500">
                                No books read yet. Refresh after reading a book.
                            </p>
                        )}
                    </div>
                    <DialogFooter>
                        <Button
                            onClick={() => setIsReadHistoryModalOpen(false)}
                        >
                            Close
                        </Button>
                        <Button
                            onClick={exportToCSV}
                            className="cursor-pointer"
                        >
                            Export CSV
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
