export async function getLocationCountryCode(ip: string): Promise<string> {
  if (process.env.NODE_ENV === "development") {
    console.log("🌍 Development mode - using mock country code");
    return "JO";
  }

  try {
    const res = await fetch(`https://freegeoip.app/json/${ip}`);
    if (!res.ok) {
      throw new Error("❌ Failed to fetch IP location");
    }

    const data = await res.json();
    const countryCode = data.country_code;
    console.log(`🌍 IP Location detected: ${countryCode} (${data.country_name})`);

    return countryCode;
  } catch (error) {
    console.error("⚠️ Error in getLocationCountryCode:", error);
    return "US"; // fallback to US
  }
}