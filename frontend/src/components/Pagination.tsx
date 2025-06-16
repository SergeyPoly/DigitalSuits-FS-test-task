import React, { Dispatch, FC, SetStateAction } from 'react'

interface Props {
  totalPages: number
  setCurrentPage: Dispatch<SetStateAction<number>>
  currentPage: number
  isLoading: boolean
}

const Pagination: FC<Props> = ({
                                 totalPages,
                                 setCurrentPage,
                                 currentPage,
                                 isLoading,
                               }) => {
  return (
    <div className="flex justify-center items-center mt-6 space-x-2">
      <button
        onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
        disabled={currentPage === 1 || isLoading}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        Prev
      </button>
      <span className="text-lg text-gray-300">{`Page ${currentPage} from ${totalPages}`}</span>
      <button
        onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
        disabled={currentPage === totalPages || isLoading}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        Next
      </button>
    </div>
  )
}

export default Pagination
