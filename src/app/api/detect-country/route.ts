import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  // Get the user's IP address from headers
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0] || "176.29.218.105";
  
  // Development mode check
  if (process.env.NODE_ENV === "development") {
    console.log("🌍 Development mode - using mock country code");
    return NextResponse.json({ 
      ip,
      country: "JO",
      country_name: "Jordan",
      region_code: "JO-AM",
      region_name: "Amman",
      city: "Amman",
      zip_code: "-",
      time_zone: "Asia/Amman",
      latitude: 31.955219268798828,
      longitude: 35.945030212402344,
      metro_code: 0
    });
  }

  try {
    const res = await fetch(`https://freegeoip.app/json/${ip}`);
    if (!res.ok) {
      throw new Error("❌ Failed to fetch IP location");
    }

    const data = await res.json();
    const countryCode = data.country_code;
    console.log(`🌍 IP Location detected: ${countryCode} (${data.country_name})`);

    return NextResponse.json(data);
  } catch (error) {
    console.error("⚠️ Error in detect-country API:", error);
    // Return fallback data
    return NextResponse.json({ 
      ip,
      country_code: "US",
      country_name: "United States",
      region_code: "US-CA",
      region_name: "California",
      city: "San Francisco",
      zip_code: "94105",
      time_zone: "America/Los_Angeles",
      latitude: 37.7749,
      longitude: -122.4194,
      metro_code: 0
    });
  }
} 