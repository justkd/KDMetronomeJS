# KDMetronomeJS
 Simple-to-use metronome widget.

## Install
CDN served via Cloudflare:  
https://cdn.notnatural.co/KDMetronome.min.js

## Use
```
const metronome = new KDMetronome('toggleID')
```

![](https://raw.githubusercontent.com/justKD/KDMetronomeJS/master/readme-screenshot.png)

Example:  
[KDMetronome on CodePen](https://codepen.io/justKD/pen/MWWYQBr)

KDMetronome is a single class that generates the widget and controls all functionality. Dependencies are loaded dynamically. 

You can pass a DOM ID to set the interactive element that will show/hide the default UI, or run it in headless mode and use the API.  

Tested in Chrome, Safari, and FireFox. Made with ToneJS, NexusUI, WAAClock, and AnimateCSS.

```
// Headless mode disposes of the default UI. Make sure your sound is on!
const metronome = new KDMetronome({
    headless: true,
    bpm: 180,
    frequency: 400,
    volume: 80,
})
document.getElementById('toggle').addEventListener("click", e => metronome.running() ? metronome.stop() : metronome.start())

// metronome.bpm(96)
// metronome.frequency(240)
// metronome.volume(60)
// metronome.start()
// metronome.stop()
```