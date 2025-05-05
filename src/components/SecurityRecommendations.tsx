'use client';

import { Dialog } from '@headlessui/react';
import { useState } from 'react';

interface SecurityRecommendationsProps {
    title: string;
    recommendations: string[];
}

const SecurityRecommendations = ({ title, recommendations }: SecurityRecommendationsProps) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="ml-2 text-blue-500 hover:text-blue-700 transition-colors duration-200"
                title="View security recommendations"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
            </button>

            <Dialog
                open={isOpen}
                onClose={() => setIsOpen(false)}
                className="relative z-50"
            >
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" aria-hidden="true" />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Dialog.Panel className="mx-auto max-w-md w-full rounded-xl bg-white shadow-2xl transform transition-all">
                        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-t-xl p-4">
                            <Dialog.Title className="text-xl font-bold text-white">
                                {title} - Security Recommendations
                            </Dialog.Title>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                {recommendations.map((recommendation, index) => (
                                    <div key={index} className="flex items-start space-x-3">
                                        <div className="flex-shrink-0 mt-1">
                                            <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <p className="text-gray-700 leading-relaxed">{recommendation}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-6 flex justify-end">
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </Dialog.Panel>
                </div>
            </Dialog>
        </>
    );
};

export default SecurityRecommendations; 