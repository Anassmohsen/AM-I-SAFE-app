import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export interface FileAnalysis {
    data: {
        id: string;
        type: string;
        links: {
            self: string;
            item: string;
        };
    };
}

export async function POST(request: NextRequest): Promise<NextResponse<FileAnalysis | { error: string }>> {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        // Check file size (32MB = 32 * 1024 * 1024 bytes)
        if (file.size > 32 * 1024 * 1024) {
            return NextResponse.json({ error: 'File size exceeds 32MB limit' }, { status: 400 });
        }

        // Create a new FormData for the VirusTotal API
        const vtFormData = new FormData();
        vtFormData.append('file', file);

        const response = await axios.post('https://www.virustotal.com/api/v3/files', vtFormData, {
            headers: {
                'accept': 'application/json',
                'x-apikey': process.env.VT_API_KEY || '',
            },
        });

        return NextResponse.json(response.data);
    } catch (error) {
        console.error('Error analyzing file:', error);
        return NextResponse.json(
            { error: 'Failed to analyze file' },
            { status: 500 }
        );
    }
}

export interface AnalysisResult {
    data: {
        id: string;
        type: string;
        links: {
            self: string;
            item: string;
        };
        attributes: {
            stats: {
                malicious: number;
                suspicious: number;
                undetected: number;
                harmless: number;
                timeout: number;
                "confirmed-timeout": number;
                failure: number;
                "type-unsupported": number;
            };
            date: number;
            results: {
                [key: string]: {
                    method: string;
                    engine_name: string;
                    engine_version: string | null;
                    engine_update: string;
                    category: string;
                    result: string | null;
                };
            };
            status: string;
        };
    };
    meta: {
        file_info: {
            sha256: string;
            md5: string;
            sha1: string;
            size: number;
        };
    };
}

export async function GET(request: NextRequest): Promise<NextResponse<AnalysisResult | { error: string }>> {
    try {
        const searchParams = request.nextUrl.searchParams;
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Analysis ID is required' }, { status: 400 });
        }

        const response = await axios.get<AnalysisResult>(`https://www.virustotal.com/api/v3/analyses/${id}`, {
            headers: {
                'accept': 'application/json',
                'x-apikey': process.env.VT_API_KEY || '',
            },
        });

        return NextResponse.json(response.data);
    } catch (error) {
        console.error('Error fetching file analysis:', error);
        return NextResponse.json(
            { error: 'Failed to fetch file analysis' },
            { status: 500 }
        );
    }
}