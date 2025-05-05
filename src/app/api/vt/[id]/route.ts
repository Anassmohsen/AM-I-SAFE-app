import axios from 'axios';
import { NextResponse } from "next/server";

export interface VTAnalysisResult {
  method: string;
  engine_name: string;
  category: string;
  result: string;
}

export interface VTAnalysisStats {
  malicious: number;
  suspicious: number;
  undetected: number;
  harmless: number;
  timeout: number;
}

export interface VTAnalysisAttributes {
  results: Record<string, VTAnalysisResult>;
  stats: VTAnalysisStats;
  date: number;
  status: string;
}

export interface VTAnalysisData {
  id: string;
  type: string;
  links: {
    self: string;
    item: string;
  };
  attributes: VTAnalysisAttributes;
}

export interface VTAnalysisMeta {
  url_info: {
    id: string;
    url: string;
  };
  file_info?: {
    sha256: string;
  };
}

export interface VTAnalysisResponse {
  data: VTAnalysisData;
  meta: VTAnalysisMeta;
}

export async function GET(
  request: Request, 
  { params }: { params: { id: string } }
): Promise<NextResponse<VTAnalysisResponse | { error: string }>> {  
  try {
    const response = await axios.get<VTAnalysisResponse>(
      `https://www.virustotal.com/api/v3/analyses/${params.id}`,
      {
        headers: {
          "accept": "application/json",
          "x-apikey": process.env.VT_API_KEY || "",
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error fetching analysis:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analysis' },
      { status: 500 }
    );
  }
} 

