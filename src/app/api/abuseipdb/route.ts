import { NextRequest, NextResponse } from 'next/server';

export interface AbuseIPDBResponse {
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

export async function GET(request: NextRequest): Promise<NextResponse<AbuseIPDBResponse | { error: string }>> {
    try {
        const searchParams = request.nextUrl.searchParams;
        const ip = searchParams.get('ip');
        const days = searchParams.get('days') || '30'; // Default to 30 days if not specified

        if (!ip) {
            return NextResponse.json({ error: 'IP address is required' }, { status: 400 });
        }

        const response = await fetch(
            `https://api.abuseipdb.com/api/v2/check?ipAddress=${ip}&maxAgeInDays=${days}`,
            {
                headers: {
                    'Key': process.env.ABUSEIPDB_API_KEY || '',
                    'Accept': 'application/json',
                },
            }
        );

        if (!response.ok) {
            throw new Error('Failed to fetch IP data');
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error checking IP:', error);
        return NextResponse.json(
            { error: 'Failed to check IP address' },
            { status: 500 }
        );
    }
} 