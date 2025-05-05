import axios from 'axios';
import { NextResponse } from 'next/server';

export interface VTAnalysisResponse {
    data: {
        type: string;
        id: string;
        links: {
            self: string;
        }
    }
}

export async function POST(request: Request): Promise<NextResponse<VTAnalysisResponse | { error: string }>> {
    try {
        const { url } = await request.json();

        if (!url) {
            return NextResponse.json({ error: 'URL is required' }, { status: 400 });
        }

        const response = await axios.post(
            'https://www.virustotal.com/api/v3/urls',
            new URLSearchParams({ url }).toString(),
            {
                headers: {
                    'accept': 'application/json',
                    'x-apikey': process.env.VT_API_KEY || '',
                    'content-type': 'application/x-www-form-urlencoded',
                },
            }
        );

        return NextResponse.json<VTAnalysisResponse>(response.data);
    } catch (error) {
        console.error('Error analyzing URL:', error instanceof Error ? (error as unknown as { response?: { data: unknown } }).response?.data : error);
        return NextResponse.json(
            { error: 'Failed to analyze URL' },
            { status: 400 }
        );
    }
}

