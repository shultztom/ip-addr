const express = require("express");
const router = express.Router();
const maxmind = require("maxmind");

// Return as JSON
// Gets IP address from request and tries to get GeoIP data
router.get("/", function(req, res, next) {
  const ip = getIP(req);
  handleMaxMindData(res, ip);
});

// Return as JSON
// Gets IP address from ip provided and tries to get GeoIP data
router.get("/:ip", function(req, res, next) {
  const { ip } = req.params;
  handleMaxMindData(res, ip);
});

// Helper Functions
const getIP = req => {
  let ip =
    req.socket.remoteAddress ||
    req.headers["x-forwarded-for"] ||    
    (req.connection.socket ? req.connection.socket.remoteAddress : null);

  try {
    ip = ip.split(",")[0];
  } catch (error) {
    console.log("ERROR: Issue splitting IP Address");
    ip = null;
  }
  try {
    if (ip.includes("::ffff:")) {
      ip = ip.replace("::ffff:", "");
    }
  } catch (error) {
    console.log("ERROR: Issue cleaning IP Address");
    ip = null;
  }

  return ip;
};

const getMaxMindData = ip => {
  if (ip) {
    return maxmind
      .open("dbs/GeoLite2-City.mmdb")
      .then(lookup => {
        return lookup.get(ip);
      })
      .catch(err => {
        console.log("Error with City Lookup");
        console.log(err);
        return null;
      });
  } else {
    return null;
  }
};

const handleMaxMindData = (res, ip) => {
  if (!maxmind.validate(ip)) {
    return res.status(400).json({ err: "Bad Request" });
  }
  const maxMindData = getMaxMindData(ip);
  if (maxMindData) {
    maxMindData
      .then(geoData => {
        if (geoData) {
          let ipInfo = {
            city: geoData.city.names.en,
            state: geoData.subdivisions[0].iso_code,
            postalCode: geoData.postal.code,
            country: geoData.country.names.en,
            latitude: geoData.location.latitude,
            longitude: geoData.location.longitude,
            timezone: geoData.location.time_zone,
            msg:
              "Data provided by MaxMind GeoLite2 Databases, you can find out more at https://maxmind.com"
          };
          ipInfo = { ip, ...ipInfo };
          return res.status(200).json(ipInfo);
        } else {
          // No geoData, just send ip address
          return res.status(200).json({ ip });
        }
      })
      .catch(err => {
        // Error getting geoData, just send ip address
        console.log(err);
        return res.status(200).json({ ip });
      });
  } else {
    // No geoData, just send ip address
    return res.status(200).json({ ip });
  }
};

module.exports = router;
