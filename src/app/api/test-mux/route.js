// app/api/test-mux/route.js
import mux from '@/lib/mux';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const testUrl = 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4';
    const asset = await mux.video.assets.create({
      input: testUrl,
      playback_policy: 'public',
      test: true
    });

    return NextResponse.json({
      status: 'Mux working',
      assetId: asset.id,
      playbackId: asset.playback_ids?.[0]?.id
    });
  } catch (error) {
    return NextResponse.json({
      status: 'Mux failed',
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}