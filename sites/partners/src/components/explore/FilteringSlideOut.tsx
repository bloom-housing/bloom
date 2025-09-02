import React from "react"
import { XMarkIcon } from "@heroicons/react/24/outline"
import { MainForm } from "./filtering/mainForm"

interface FilteringSlideOutProps {
  isOpen: boolean
  onClose: () => void
}

export const FilteringSlideOut: React.FC<FilteringSlideOutProps> = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black z-40 transition-opacity duration-500 ease-in-out ${
          isOpen ? "opacity-50" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        onKeyDown={(e) => e.key === "Escape" && onClose()}
        role="button"
        tabIndex={0}
        aria-label="Close filter panel"
      />

      {/* Slide-out panel */}
      <div
        className={`fixed top-0 right-0 h-full w-1/2 lg:w-1/3 bg-white shadow-2xl transform transition-all duration-500 ease-out z-50 overflow-hidden ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full bg-gray-100">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white flex-shrink-0">
            <div className="flex items-center">
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors mr-4"
                aria-label="Close filter panel"
              >
                <XMarkIcon className="w-6 h-6 text-blue-500" />
              </button>
              <h2 className="text-xl font-semibold text-gray-900">Filter</h2>
            </div>
          </div>

          {/* Scrollable content area */}
          <div className="flex-1 overflow-y-auto">
            <MainForm onClose={onClose} />
          </div>
        </div>
      </div>
    </>
  )
}
