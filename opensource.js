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
  const files = FileManager.local()
  const path = files.joinPath(files.cacheDirectory(), "widget-apple-open-source")
  
  // Check if a cache file exists
  const cacheExists = files.fileExists(path)
  
  // If cache file exists, retrieve last time it was modified
  const cacheDate = cacheExists ? files.modificationDate(path) : 0
  
  // Get current time
  const currentTime = Date.now()
  
  let stars = "?"
  let forks = "?"
  let pipy_downloads = "?"
  
  // If cache exists and it has been written within last 1 hour, retrieve that data
  if (cacheExists && (currentTime - cacheDate) < (CACHED_DATA_HOURS * 60 * 60 * 1000)) {
    
    // Get the data from cached file
    data_cached = JSON.parse(files.readString(path))
    
    if (GITHUB_REPO) {
      stars = data_cached["stars"]
      forks = data_cached["forks"]
    }
    if (PIP_PACKAGE_NAME) {
      pipy_downloads = data_cached["pipy_downloads"]
    }
    
  } else { 
    
    data_to_be_cached = {}
    
    // Do a new data request
    if (GITHUB_REPO) {
      [stars, forks] = await getGitHubStats(GITHUB_REPO);
      
      data_to_be_cached["stars"] = stars
      data_to_be_cached["forks"] = forks
    }
    if (PIP_PACKAGE_NAME) {
      pipy_downloads = await getPiPyDownloads(PIP_PACKAGE_NAME)
      
      data_to_be_cached["pipy_downloads"] = pipy_downloads
    }
    
    // Update cached file with such data
    files.writeString(path, JSON.stringify(data_to_be_cached))
  }
  
  
  
  if (GITHUB_REPO) {  
    // Display stars from project
    let githubStars = listwidget.addText(`⭐️ Stargazers: ${stars}`);
    githubStars.centerAlignText();
    githubStars.font = Font.semiboldSystemFont(20);
    githubStars.textColor = new Color("#FFFFFF");
    listwidget.addSpacer(15);
    
    // Display forks from project
    let githubForks = listwidget.addText(`🍴Forks: ${forks}`);
    githubForks.centerAlignText();
    githubForks.font = Font.semiboldSystemFont(20);
    githubForks.textColor = new Color("#FFFFFF");
    listwidget.addSpacer(15);
  }
    
  if (PIP_PACKAGE_NAME) {
    // Display pip install from last day
    let pipy = listwidget.addText(`🔥 new pip install: ${pipy_downloads}`);
    pipy.centerAlignText();
    pipy.font = Font.semiboldSystemFont(20);
    pipy.textColor = new Color("#FFFFFF");
    listwidget.addSpacer(15);
  }
  
  // Return the created widget
  return listwidget;
}

async function getGitHubStats(repoName) {
  // Query url
  const url = `https://api.github.com/repos/${repoName}`;

  // Initialize new request
  const request = new Request(url);

  // Execute the request and parse the response as json
  const data = await request.loadJSON();
  
  return [data.stargazers_count, data.forks_count];
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
