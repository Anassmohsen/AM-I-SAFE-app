'use client';

import axios from 'axios';
import { useState } from 'react';

interface VTAnalysis {
    data: {
        id: string;
        type: string;
        links: {
            self: string;
            item: string;
        };
        attributes: {
            results: Record<string, {
                method: string;
                engine_name: string;
                category: string;
                result: string;
            }>;
            stats: {
                malicious: number;
                suspicious: number;
                undetected: number;
                harmless: number;
                timeout: number;
            };
            date: number;
            status: string;
        };
    };
    meta: {
        url_info: {
            id: string;
            url: string;
        };
        file_info: {
            sha256: string;
        };
    };
}

const URLAnalysis = () => {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<VTAnalysis | null>(null);
    const [error, setError] = useState<string | null>(null);

    const analyzeUrl = async () => {
        setLoading(true);
        setError(null);
        try {
            // First API call to submit URL
            const submitResponse = await axios.post('/api/vt', { url });
            const analysisId = submitResponse.data.data.id;

            // Second API call to get analysis results
            const analysisResponse = await axios.get(`/api/vt/${analysisId}`);
            setResult(analysisResponse.data);
        } catch {
            setError('Failed to analyze URL');
        } finally {
            setLoading(false);
        }
    };

    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'malicious':
                return 'bg-red-100 text-red-800';
            case 'harmless':
                return 'bg-green-100 text-green-800';
            case 'suspicious':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex gap-2">
                <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Enter URL to analyze"
                    className="flex-1 p-2 border rounded text-black"
                />
                <button
                    onClick={analyzeUrl}
                    disabled={loading || !url}
                    className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
                >
                    {loading ? 'Analyzing...' : 'Analyze'}
                </button>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            )}

            {result && (
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="border rounded p-4">
                            <h3 className="font-semibold mb-2 text-black">URL Information</h3>
                            <p className="break-all text-black">{result.meta.url_info.url}</p>
                        </div>
                        <div className="border rounded p-4">
                            <h3 className="font-semibold mb-2 text-black">Analysis Status</h3>
                            <p className="text-black">{result.data.attributes.status}</p>
                        </div>
                        <div className="border rounded p-4">
                            <h3 className="font-semibold mb-2 text-black">Analysis Date</h3>
                            <p className="text-black">{new Date(result.data.attributes.date * 1000).toLocaleString()}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {['malicious', 'suspicious'].map((key) => (
        <div key={key} className={`border rounded p-4 ${getCategoryColor(key)}`}>
            <h3 className="font-semibold capitalize text-black">{key}</h3>
            <p className="text-2xl font-bold text-black">
                {result.data.attributes.stats[key as keyof typeof result.data.attributes.stats]}
            </p>
        </div>
    ))}
</div>

                </div>
            )}
        </div>
    );
};

export default URLAnalysis; 