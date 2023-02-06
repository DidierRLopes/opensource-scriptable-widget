const WIDGET_TITLE = "OSSC"
const GITHUB_REPO = "OpenBB-finance/OpenBBTerminal"
const REPOS = ["OpenBB-finance/OpenBBTerminal", "calcom/cal.com", "projectdiscovery/nuclei", "theatre-js/theatre", "RocketChat/Rocket.Chat", "getumbrel/umbrel", "Stability-AI/stablediffusion",
 "mergestat/mergestat", "mindsdb/mindsdb", "boxyhq/jackson", "spacedriveapp/spacedrive", "forem/forem", "Remix-run/remix", "godotengine/godot", "hoppscotch/hoppscotch", "wasmerio/wasmer", "nocodb/nocodb", "rome/tools"]

const CACHED_DATA_HOURS = 1
  
async function createWidget() {
  // Create new empty ListWidget instance
  let listwidget = new ListWidget(); 
  
  // Set new background color
  bg = new Color("#ffffff")
  listwidget.backgroundColor = bg

  // Add widget heading
  let heading = listwidget.addText(WIDGET_TITLE);
  heading.centerAlignText();
  heading.font = Font.lightSystemFont(16);
  heading.textColor = new Color("#000000");
  listwidget.addSpacer(3);
  /*
  let headingSub = listwidget.addText("FOR AN OPEN FUTURE");
  headingSub.centerAlignText();
  headingSub.font = Font.lightSystemFont(16);
  headingSub.textColor = new Color("#000000");
  listwidget.addSpacer(4);
  */
  
  
  // This logic allows to save data in cache to avoid doing multiple requests
  const files = FileManager.local()
  const path = files.joinPath(files.cacheDirectory(), "widget-apple-open-source")
  
  // Check if a cache file exists
  const cacheExists = files.fileExists(path)
  
  // If cache file exists, retrieve last time it was modified
  const cacheDate = cacheExists ? files.modificationDate(path) : 0
  
  // Get current time
  const currentTime = Date.now()
  
  let stars = {}
  let forks = {}
  
  // If cache exists and it has been written within last 1 hour, retrieve that data
  if (cacheExists && (currentTime - cacheDate) < (CACHED_DATA_HOURS * 60 * 60 * 1000)) {
    
    // Get the data from cached file
    data_cached = JSON.parse(files.readString(path))
    
    for (let i = 0; i < REPOS.length; i++) {
      stars[REPOS[i]] = data_cached[`${REPOS[i]}-stars`]
      forks[REPOS[i]] = data_cached[`${REPOS[i]}-forks`]
    }
    
  } else { 
    
    data_to_be_cached = {}
    
    let github =[]
    for (let i = 0; i < REPOS.length; i++) {
      // Do a new data request
      github = await getGitHubStats(REPOS[i]);
      stars[REPOS[i]] = github[0]
      forks[REPOS[i]] = github[1]
      
      data_to_be_cached[`${REPOS[i]}-stars`] = github[0]
      data_to_be_cached[`${REPOS[i]}-forks`] = github[1]
    }
    
    // Update cached file with such data
    files.writeString(path, JSON.stringify(data_to_be_cached))
  }  
  
  
  let projectName = ""
  for (let i = 0; i < REPOS.length; i++) {
    // Display stars from project
    projectName = REPOS[i].split('/')[1]
    projectName = projectName.padStart(30 - projectName.length, ' ');
    let github = listwidget.addText(`${projectName} - ${stars[REPOS[i]]} - ${forks[REPOS[i]]}`);
    github.centerAlignText();
    github.font = Font.semiboldSystemFont(12);
    github.textColor = new Color("#000000");
    listwidget.addSpacer(1)
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
