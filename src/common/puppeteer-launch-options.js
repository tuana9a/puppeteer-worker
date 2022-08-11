const t = new Map();

t.set("default", {
  // default run in headless mode
  slowMo: 10,
  defaultViewport: {
    width: 1920,
    height: 1080,
  },
});

t.set("headless", {
  slowMo: 10,
  defaultViewport: {
    width: 1920,
    height: 1080,
  },
});

t.set("visible", {
  headless: false,
  slowMo: 10,
  defaultViewport: null,
});

t.set("docker", {
  slowMo: 10,
  defaultViewport: {
    width: 1920,
    height: 1080,
  },
  executablePath: "google-chrome-stable",
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
});

module.exports.get = (key) => t.get(key);
module.exports.getWithDefault = (key) => t.get(key) || t.get("default");
