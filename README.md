# opensource-scriptable-widget
iOS Widget that displays GitHub stars and forks, but also pip installs from last day

<p align="center">
  <img src="https://user-images.githubusercontent.com/25267873/216868276-7aed9ea6-4d0e-495f-92c7-9b3981f0022a.png" width="30%"/>
</p>

Steps to have it work on your iOS Device:

1. Download Scriptable app to your iOS device

2. Open Scriptable app and click on the "+" on the top right corner

3. Rename that script to whatever repo you would like to track

4. Copy the code from the file `opensource.js` on this repo

5. Paste it into that new script on your phone

6. Change the 4 initial parameters from the file:

```
const WIDGET_TITLE = "openbb.co/open"
const GITHUB_REPO = "OpenBB-finance/OpenBBTerminal"
const PIP_PACKAGE_NAME = "openbb"
const CACHED_DATA_HOURS = 1
```

* If you only want to track GitHub stats, do `PIP_PACKAGE_NAME=""`.
* If you only want to track PiPy stats, do `GITHUB_REPO=""`.
* The `CACHED_DATA_HOURS` corresponds to the amount of hours where the data is not updated.

7. Run script to make sure that it works using the "play button" on the bottom right corner

8. Leave the app

9. Leave your finger pressed on the iOS homepage

10. Click on the "+" on the left top corner

11. In the "Search Wigets" tab look for "Scriptable"

12. You will see "Run Script" and there are 3 pages. Select the type of widget size that you are interested in

13. Select "Add Widget"

14. The widget will appear with the sentence "Long press and edit widget to select the script to run"

15. Do that and then you will have 3 options:

* Script - Select script name that you renamed to earlier
* When Interacting - Select "Open URL"
  * A new field will appear with "URL" then provide the link you want to open you cick on the widget (e.g. http://openbb.co)
* Parameter - If there's any parameter needed to the script

16. Click outside the window, and you should be all set!

If you have any question let me know, you can find me on Twitter [here](https://twitter.com/didier_lopes).


