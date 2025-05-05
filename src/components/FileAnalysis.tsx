'use client';

import type { AnalysisResult, FileAnalysis } from '@/app/api/vt/file/route';
import axios from 'axios';
import { useState } from 'react';

interface FileAnalysisResponse {
    data: {
        id: string;
        type: string;
        links: {
            self: string;
            item: string;
        };
    };
}

interface AnalysisResultItem {
    method: string;
    engine_name: string;
    engine_version: string | null;
    engine_update: string;
    category: string;
    result: string | null;
}

const FileAnalysis = () => {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [analysisId, setAnalysisId] = useState<string | null>(null);
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setAnalysisResult(null);
            setAnalysisId(null);
        }
    };

    const fetchAnalysisResult = async (id: string) => {
        try {
            const response = await axios.get<AnalysisResult>(`/api/vt/file?id=${id}`);
            setAnalysisResult(response.data);

            // If analysis is still in progress, continue polling
            if (response.data.data.attributes.status === 'queued') {
                setTimeout(() => fetchAnalysisResult(id), 5000); // Poll every 5 seconds
            }
        } catch {
            setError('Failed to fetch analysis results');
        }
    };

    const analyzeFile = async () => {
        if (!file) return;

        setLoading(true);
        setError(null);
        setAnalysisId(null);
        setAnalysisResult(null);

        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await axios.post<FileAnalysisResponse>('/api/vt/file', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setAnalysisId(response.data.data.id);
            fetchAnalysisResult(response.data.data.id);
        } catch {
            setError('Failed to analyze file');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'malicious':
                return 'text-red-600';
            case 'suspicious':
                return 'text-yellow-600';
            case 'harmless':
                return 'text-green-600';
            default:
                return 'text-gray-600';
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Upload File (max 32MB)
                    </label>
                    <div className="flex flex-col sm:flex-row gap-2">
                        <input
                            type="file"
                            onChange={handleFileChange}
                            className="block w-full text-sm text-gray-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-blue-50 file:text-blue-700
                                hover:file:bg-blue-100
                                cursor-pointer"
                            accept="*"
                        />
                        <button
                            onClick={analyzeFile}
                            disabled={loading || !file}
                            className="w-full sm:w-auto bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
                        >
                            {loading ? 'Analyzing...' : 'Analyze'}
                        </button>
                    </div>
                </div>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            )}

            {analysisId && (
                <div className="mt-4 p-4 bg-green-100 border border-green-400 rounded">
                    <p className="text-black">Analysis ID: {analysisId}</p>
                    <p className="text-black">View results on <a href={`https://www.virustotal.com/gui/file/${analysisId}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">VirusTotal</a></p>
                </div>
            )}

            {analysisResult && (
                <div className="mt-6">
                    <h3 className="text-lg font-semibold text-black mb-4">Analysis Results</h3>

                    {analysisResult.data.attributes.status === 'queued' ? (
                        <div className="text-gray-600">Analysis in progress...</div>
                    ) : (
                        <>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mb-6">
                                <div className="bg-red-50 p-3 sm:p-4 rounded-lg">
                                    <div className="text-red-600 font-bold text-lg sm:text-xl">
                                        {analysisResult.data.attributes.stats.malicious}
                                    </div>
                                    <div className="text-xs sm:text-sm text-gray-600">Malicious</div>
                                </div>
                                <div className="bg-yellow-50 p-3 sm:p-4 rounded-lg">
                                    <div className="text-yellow-600 font-bold text-lg sm:text-xl">
                                        {analysisResult.data.attributes.stats.suspicious}
                                    </div>
                                    <div className="text-xs sm:text-sm text-gray-600">Suspicious</div>
                                </div>
                                <div className="bg-green-50 p-3 sm:p-4 rounded-lg">
                                    <div className="text-green-600 font-bold text-lg sm:text-xl">
                                        {analysisResult.data.attributes.stats.harmless}
                                    </div>
                                    <div className="text-xs sm:text-sm text-gray-600">Harmless</div>
                                </div>
                                <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                                    <div className="text-gray-600 font-bold text-lg sm:text-xl">
                                        {analysisResult.data.attributes.stats.undetected}
                                    </div>
                                    <div className="text-xs sm:text-sm text-gray-600">Undetected</div>
                                </div>
                            </div>

                            <details className="border rounded p-4 mt-4">
                                <summary className="font-semibold text-black cursor-pointer">
                                    Show Detailed Analysis Results
                                </summary>
                                <div className="bg-white rounded-lg shadow overflow-hidden mt-4">
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Engine
                                                    </th>
                                                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Result
                                                    </th>
                                                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Method
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {Object.entries(analysisResult.data.attributes.results as Record<string, AnalysisResultItem>).map(([engine, result]) => (
                                                    <tr key={engine}>
                                                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                            {result.engine_name}
                                                        </td>
                                                        <td className={`px-3 sm:px-6 py-4 whitespace-nowrap text-sm ${getStatusColor(result.category)}`}>
                                                            {result.result || result.category}
                                                        </td>
                                                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {result.method}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </details>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default FileAnalysis; 
