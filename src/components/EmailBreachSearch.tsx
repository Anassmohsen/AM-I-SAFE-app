'use client';

import { Breach } from '@/app/api/hibp/route';
import axios from 'axios';
import React, { useState } from 'react';

const EmailBreachSearch: React.FC = () => {
    const [email, setEmail] = useState('');
    const [breaches, setBreaches] = useState<Breach>({ data: [] });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSafe, setIsSafe] = useState<boolean | null>(null);

    const searchBreaches = async () => {
        setLoading(true);
        setError(null);
        setBreaches({ data: [] });
        setIsSafe(null);

        try {
            const response = await axios.get(`/api/hibp?email=${encodeURIComponent(email)}`);
            console.log(response.data);
            setBreaches({ data: response.data.data });
            setIsSafe(response.data.data.length === 0);
        } catch (err) {
            console.error('Error searching for breaches:', err);
            setError('Failed to search for breaches. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="flex gap-2">
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email address"
                    className="flex-1 w-full p-2 border rounded text-black"
                />
                <button
                    onClick={searchBreaches}
                    disabled={loading || !email}
                    className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
                >
                    {loading ? 'Searching...' : 'Search'}
                </button>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {isSafe === true && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                    <p className="font-bold">Safe!</p>
                    <p>No breaches found for this email address.</p>
                </div>
            )}

            {breaches?.data?.length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-black">Found Breaches:</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {breaches.data.map((breach) => (
                            <div key={breach.Name} className="border rounded p-4 border-red-400 bg-red-50">
                                <div className="mt-2">
                                    <span className="font-semibold text-red-700">Compromised Data:</span>
                                    <ul className="list-disc list-inside text-red-700">
                                        <li>{breach.Name}</li>
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmailBreachSearch; 