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

KDMetronome is a single class that generates the widget UI and controls all functionality. 

You can pass a DOM ID to set the interactive element that will show/hide the default UI on click, or run it in headless mode and use the API.  

The default widget is draggable, can run while hidden, and the number inputs can be changed by clicking and typing or dragging up/down.

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

Tested in Chrome, Safari, and FireFox. Made with ToneJS, NexusUI, WAAClock, and AnimateCSS. Dependencies are loaded dynamically.