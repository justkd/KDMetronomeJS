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

The default widget is draggable, can run while hidden, and the number inputs can be changed by clicking/typing or dragging up/down. You can also set a custom callback.

Multple metronomes can be created and controlled independently.

```
// Headless mode disposes of the default UI. Make sure your sound is on!
const metronome2 = new KDMetronome({
    headless: true,
    bpm: 180,
    frequency: 400,
    volume: 80,
})
document.getElementById('toggle').addEventListener("click", e => metronome2.running() ? metronome2.stop() : metronome2.start())

// metronome.bpm(96)                                    // Set the BPM (6 - 300)
// metronome.frequency(240)                             // Set the click frequency (20 - 20500)
// metronome.volume(60)                                 // Set the click volume (0 - 100)
// metronome.start()                                    // Start the metronome.
// metronome.stop()                                     // Stop the metronome.

// metronome.callback(_ => console.log('click'))        // Pass a function to set the callback that runs on metronome tick.
// metronome.callback('default')                        // Pass 'default' to reset the callback to the default function.

// metronome.bpm()                                      // Returns the current BPM.
// metronome.frequency()                                // Returns the current frequency.
// metronome.volume()                                   // Returns the current volume.
// metronome.hide()                                     // Hide the UI widget. Only when not in headless mode.
// metronome.show()                                     // Show the UI widget. Only when not in headless mode.
// metronome.hidden()                                   // Returns true/false.
// metronome.running()                                  // Returns true/false.
// metronome.headless()                                 // Returns true/false.
```

Tested in Chrome, Safari, and FireFox. Made with ToneJS, NexusUI, WAAClock, and AnimateCSS. Dependencies are loaded dynamically.