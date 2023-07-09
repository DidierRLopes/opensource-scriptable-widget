const WIDGET_TITLE = "openbb.co/open"
const GITHUB_REPO = "OpenBB-finance/OpenBBTerminal"
const PIP_PACKAGE_NAME = "openbb"
const CACHED_DATA_HOURS = 1
  
async function createWidget() {
  // Create new empty ListWidget instance
  let listwidget = new ListWidget(); 
  
  // Set new background color
  startColor = new Color("#822661")
  midColor = new Color("#48277C")
  endColor = new Color("#005CA9")
  let gradient = new LinearGradient()
  gradient.colors = [startColor, midColor, endColor]
  gradient.locations = [0, 0.5, 1]
  listwidget.backgroundGradient = gradient

  // Add widget heading
  let heading = listwidget.addText(WIDGET_TITLE);
  heading.centerAlignText();
  heading.font = Font.lightSystemFont(16);
  heading.textColor = new Color("#ffff00");
  listwidget.addSpacer(15);
  
  // This logic allows to save data in cache to avoid doing multiple requests
  // change the name of the path if you want to avoid getting cached data
  const files = FileManager.local()
  const path = files.joinPath(files.cacheDirectory(), "widget-openbb-data")
  
  // Check if a cache file exists
  const cacheExists = files.fileExists(path) // do = false for testing
  
  // If cache file exists, retrieve last time it was modified
  const cacheDate = cacheExists ? files.modificationDate(path) : 0
  
  // Get current time
  const currentTime = Date.now()
  
  // let new_stars = "?"
  // let new_forks = "?"
  let users = "?"
  let stars = "?"
  let forks = "?"
  let pipy_downloads = "?"
  let new_discord = 0
  let new_telegram = 0
  
  // If cache exists and it has been written within last 1 hour, retrieve that data
  if (cacheExists && (currentTime - cacheDate) < (CACHED_DATA_HOURS * 60 * 60 * 1000)) {
    
    // Get the data from cached file
    data_cached = JSON.parse(files.readString(path))
    
    // new_stars = data_cached["stars"] 
    // new_forks = data_cached["forks"]
    
    users = data_cached["users"]
    
    stars = data_cached["stars"] 
    forks = data_cached["forks"]
    
    pipy_downloads = data_cached["pipy_downloads"]

    new_discord = data_cached["discord"]
    new_telegram = data_cached["telegram"]
    
  } else { 
    
    data_to_be_cached = {}
    
    // Do a new data request
    users = await getHubUsers();
    
    starsAndForks = await getGitHubStarsAndForks(GITHUB_REPO);
    stars = starsAndForks[0]
    forks = starsAndForks[1]
    
    // const [oldstars, oldforks] = await getPastGitHubStats();
    // new_stars = stars - oldstars
    // new_forks = forks - oldforks
    
    pipy_downloads = await getPiPyDownloads(PIP_PACKAGE_NAME);
    [new_discord, new_telegram] = await getBotData();

    // data_to_be_cached["stars"] = new_stars
    // data_to_be_cached["forks"] = new_forks
    data_to_be_cached["users"] = users
    data_to_be_cached["stars"] = stars
    data_to_be_cached["forks"] = forks
    data_to_be_cached["pipy_downloads"] = pipy_downloads
    data_to_be_cached["discord"] = new_discord
    data_to_be_cached["telegram"] = new_telegram
    
    // Update cached file with such data
    files.writeString(path, JSON.stringify(data_to_be_cached))
  }
  
  // Display Hub users
  let hubHeader = listwidget.addText(`🦋 OpenBB Hub 🦋`);
  hubHeader.centerAlignText();
  hubHeader.font = Font.semiboldSystemFont(20);
  hubHeader.textColor = new Color("#FFFFFF");
  listwidget.addSpacer(10);
  // let githubStars = listwidget.addText(`New stargazers: ${new_stars}`);
  let hubUsers = listwidget.addText(`Users: ${users}`);
  hubUsers.centerAlignText();
  hubUsers.font = Font.semiboldSystemFont(16);
  hubUsers.textColor = new Color("#FFFFFF");
  listwidget.addSpacer(15);
 
  // Display stars from project
  let githubHeader = listwidget.addText(`💻 OpenBB Terminal 💻`);
  githubHeader.centerAlignText();
  githubHeader.font = Font.semiboldSystemFont(20);
  githubHeader.textColor = new Color("#FFFFFF");
  listwidget.addSpacer(10);
  // let githubStars = listwidget.addText(`New stargazers: ${new_stars}`);
  let githubStars = listwidget.addText(`Stargazers: ${stars}`);
  githubStars.centerAlignText();
  githubStars.font = Font.semiboldSystemFont(16);
  githubStars.textColor = new Color("#FFFFFF");
  listwidget.addSpacer(10);
  // let githubForks = listwidget.addText(`New forks: ${new_forks}`);
  // let githubForks = listwidget.addText(`Forks: ${forks}`);
  // githubForks.centerAlignText();
  // githubForks.font = Font.semiboldSystemFont(16);
  // githubForks.textColor = new Color("#FFFFFF");
  // listwidget.addSpacer(30);
  
    
  // Display pip install from last day
  let pipyHeader = listwidget.addText(`🔥 OpenBB SDK 🔥`);
  pipyHeader.centerAlignText();
  pipyHeader.font = Font.semiboldSystemFont(20);
  pipyHeader.textColor = new Color("#FFFFFF");
  listwidget.addSpacer(10);
  let pipy = listwidget.addText(`Yesterday pip installs: ${pipy_downloads}`);
  pipy.centerAlignText();
  pipy.font = Font.semiboldSystemFont(16);
  pipy.textColor = new Color("#FFFFFF");
  listwidget.addSpacer(15);

  // Display OpenBB Bot WAU
  let discordHeader = listwidget.addText(`🤖 OpenBB Bot 🤖`);
  discordHeader.centerAlignText();
  discordHeader.font = Font.semiboldSystemFont(20);
  discordHeader.textColor = new Color("#FFFFFF");
  listwidget.addSpacer(10);
  let discord = listwidget.addText(`Weekly Discord users: ${new_discord}`);
  discord.centerAlignText();
  discord.font = Font.semiboldSystemFont(16);
  discord.textColor = new Color("#FFFFFF");
  listwidget.addSpacer(10);
  let telegram = listwidget.addText(`Weekly Telegram users: ${new_telegram}`);
  telegram.centerAlignText();
  telegram.font = Font.semiboldSystemFont(16);
  telegram.textColor = new Color("#FFFFFF");

  // Return the created widget
  return listwidget;
}

async function getHubUsers() {
  // Query url
  const url = `https://payments.openbb.co/metrics/users`;

  // Initialize new request
  const request = new Request(url);

  // Execute the request and parse the response as json
  const data = await request.loadJSON();
  
  return data.users.slice(-1)[0].count
}


// Cannot run this one because requests takes too long and widget screen stays black
// So instead of displaying stars and forks difference, I just show the latest ones  
async function getPastGitHubStats() {
  // Query url
  const url = `http://44.210.92.255:8000/all`;

  // Initialize new request
  const request = new Request(url);

  // Execute the request and parse the response as json
  const data = await request.loadJSON();
  
  return [data.github.slice(-1)[0].stars, data.github.slice(-1)[0].forks]
}


async function getGitHubStarsAndForks(repoName) {
  // Query url
  const url = `https://api.github.com/repos/${repoName}`;

  // Initialize new request
  const request = new Request(url);

  // Execute the request and parse the response as json
  const data = await request.loadJSON();
  
  return [data.stargazers_count, data.forks_count]
}

async function getPiPyDownloads(packageName) {
  // Query url
  const url = `https://pypistats.org/api/packages/${packageName}/recent?range=all`;

  // Initialize new request
  const request = new Request(url);

  // Execute the request and parse the response as json
  const data = await request.loadJSON();
  
  return data["data"]["last_day"]
}

async function getBotData() {
  // Query url
  const url = `https://api.openbb.co/v1/disc/openbb`;

  // Initialize new request
  const request = new Request(url);

  // Execute the request and parse the response as json
  const data = await request.loadJSON();
  
  return [data.users.slice(-1)[0].discord, data.users.slice(-1)[0].telegram]
}


let widget = await createWidget();

// Check where the script is running
if (config.runsInWidget) {
  
  // Runs inside a widget so add it to the homescreen widget
  Script.setWidget(widget);
  
} else {
  
  // Show the medium widget inside the app
  widget.presentLarge();
  
}

Script.complete();
