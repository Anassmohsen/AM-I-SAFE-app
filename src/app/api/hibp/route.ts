import axios from 'axios';
import { NextResponse } from "next/server";



export interface Breach {
    data:{Name:string}[];
}

export async function GET(request: Request): Promise<NextResponse<Breach>> {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');  

  if (!email) {
    return NextResponse.json<Breach>({ data: [] }, { status: 400 });
  }

  try {
    const response = await axios.get(
      `https://haveibeenpwned.com/api/v3/breachedaccount/${email}`,
      {
        headers: {
          'hibp-api-key': process.env.HIBP_API_KEY || '',
          'user-agent': 'im-safe-app'
        }
      }
    );

    return NextResponse.json<Breach>({ data: response.data });
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return NextResponse.json<Breach>({ data: [] });
    }
    console.error('Error fetching HIBP data:', error);
    return NextResponse.json<Breach>({ data: [] }, { status: 500 });
  }
} 
