import axios from "axios";

async function testKey() {
  try {
    const res = await axios.get(
      "https://maps.googleapis.com/maps/api/geocode/json",
      {
        params: {
          address: "Kerala",
          key: "AIzaSyAOVYRIgupAurZup5y1PRh8Ismb1A3lLao"
        }
      }
    );
    console.log(res.data);
  } catch (err) {
    console.error("Error:", err.response?.data || err.message);
  }
}

testKey();
