'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';

interface IPInfo {
    ip: string;
    city: string;
    country_name: string;
}

interface AbuseIPDBResponse {
    data: {
        ipAddress: string;
        isPublic: boolean;
        ipVersion: number;
        isWhitelisted: boolean;
        abuseConfidenceScore: number;
        countryCode: string;
        usageType: string;
        isp: string;
        domain: string;
        hostnames: string[];
        isTor: boolean;
        totalReports: number;
        numDistinctUsers: number;
        lastReportedAt: string;
        reports: {
            reportedAt: string;
            comment: string;
            categories: number[];
            reporterId: number;
            reporterCountryCode: string;
            reporterCountryName: string;
        }[];
    };
}

const IPAddressDisplay = () => {
    const [ipInfo, setIpInfo] = useState<IPInfo | null>(null);
    const [abuseInfo, setAbuseInfo] = useState<AbuseIPDBResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchIpInfo = async () => {
            try {
                const response = await axios.get('https://ipapi.co/json/');
                setIpInfo(response.data);
                return response.data.ip;
            } catch (error) {
                console.error('Error fetching IP info:', error);
                setError('Failed to fetch IP information');
                return null;
            }
        };

        const fetchAbuseInfo = async (ip: string) => {
            try {
                const response = await axios.get(`/api/abuseipdb?ip=${ip}`);
                setAbuseInfo(response.data);
            } catch (error) {
                console.error('Error fetching abuse info:', error);
                setError('Failed to fetch abuse information');
            }
        };

        const fetchAllInfo = async () => {
            setLoading(true);
            const ip = await fetchIpInfo();
            if (ip) {
                await fetchAbuseInfo(ip);
            }
            setLoading(false);
        };

        fetchAllInfo();
    }, []);

    if (loading) return <div>Loading IP information...</div>;
    if (error) return <div className="text-red-600">{error}</div>;
    if (!ipInfo) return <div>Failed to load IP information</div>;

    const getAbuseScoreColor = (score: number) => {
        if (score >= 75) return 'text-red-600';
        if (score >= 50) return 'text-orange-600';
        if (score >= 25) return 'text-yellow-600';
        return 'text-green-600';
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className="border p-4 rounded">
                    <h3 className="font-semibold mb-2 text-black">IP Address</h3>
                    <p className="text-black">{ipInfo.ip}</p>
                </div>
                <div className="border p-4 rounded">
                    <h3 className="font-semibold mb-2 text-black">Location</h3>
                    <p className="text-black">{ipInfo.city}, {ipInfo.country_name}</p>
                </div>
            </div>

            {abuseInfo && (
                <div className="border rounded p-4">
                    <h3 className="font-semibold mb-4 text-black">AbuseIPDB Analysis</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <h4 className="font-medium mb-2 text-black">Abuse Confidence Score</h4>
                            <p className={`text-2xl font-bold ${getAbuseScoreColor(abuseInfo.data.abuseConfidenceScore)}`}>
                                {abuseInfo.data.abuseConfidenceScore}%
                            </p>
                        </div>
                        <div>
                            <h4 className="font-medium mb-2 text-black">Reports</h4>
                            <p className="text-black">Total Reports: {abuseInfo.data.totalReports}</p>
                            <p className="text-black">Distinct Users: {abuseInfo.data.numDistinctUsers}</p>
                        </div>
                        <div>
                            <h4 className="font-medium mb-2 text-black">Network Information</h4>
                            <p className="text-black">ISP: {abuseInfo.data.isp}</p>
                            <p className="text-black">Usage Type: {abuseInfo.data.usageType}</p>
                            <p className="text-black">Domain: {abuseInfo.data.domain || 'N/A'}</p>
                        </div>
                        <div>
                            <h4 className="font-medium mb-2 text-black">Security Flags</h4>
                            <p className="text-black">Is Public: {abuseInfo.data.isPublic ? 'Yes' : 'No'}</p>
                            <p className="text-black">Is Tor: {abuseInfo.data.isTor ? 'Yes' : 'No'}</p>
                        </div>
                    </div>

                    {abuseInfo.data.reports && abuseInfo.data.reports.length > 0 && (
                        <div className="mt-4">
                            <h4 className="font-medium mb-2 text-black">Recent Reports</h4>
                            <div className="space-y-2">
                                {abuseInfo.data.reports.slice(0, 3).map((report, index) => (
                                    <div key={index} className="border-t pt-2">
                                        <p className="text-sm text-black">
                                            {new Date(report.reportedAt).toLocaleDateString()}
                                        </p>
                                        <p className="text-black">{report.comment}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default IPAddressDisplay; 