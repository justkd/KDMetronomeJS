# KDMetronomeJS
 Simple-to-use metronome widget.

## Install
CDN served via Cloudflare:  
https://cdn.notnatural.co/KDMetronome.min.js

## Use
```
const metronome = new KDMetronome('toggleID')
```

<img src="https://raw.githubusercontent.com/justKD/KDMetronomeJS/master/readme-screenshot.png" alt="drawing" width="350"/>

Example:  
[KDMetronome on CodePen](https://codepen.io/justKD/pen/MWWYQBr)

KDMetronome is a single class that generates the widget UI and controls all functionality. 

You can pass a DOM ID to set the interactive element that will show/hide the default UI on click, or run it in headless mode and use the API.  

The default widget is draggable, can run while hidden, and the number inputs can be changed by clicking/typing or dragging up/down. You can also set a custom callback.

Multiple metronomes can be created and controlled independently.

```
// Headless mode disposes of the default UI. Make sure your sound is on!
const metronome2 = new KDMetronome({
    headless: true,
    bpm: 180,
    frequency: 400,
    volume: 60,
})
metronome2.ready(_ => metronome2.callback(_ => console.log(metronome2.ticks())))
document.getElementById('toggle').addEventListener("click", e => metronome2.running() ? metronome2.stop() : metronome2.start())

// metronome.ready()                                    // Returns true/false.
// metronome.ready(_ => console.log('ready'))           // Ensure dependencies are loaded and the instance is initialized.
        
// metronome.bpm(96)                                    // Set the BPM (6 - 300)
// metronome.frequency(240)                             // Set the click frequency (20 - 20500)
// metronome.volume(60)                                 // Set the click volume (0 - 100)
// metronome.start()                                    // Start the metronome. Web Audio must first be initiated by a user action.
// metronome.stop()                                     // Stop the metronome.

// metronome.callback(_ => console.log('click'))        // Pass a function to set the callback that runs on metronome tick.
// metronome.callback('default')                        // Pass 'default' to reset the callback to the default function.

// metronome.bpm()                                      // Returns the current BPM.
// metronome.frequency()                                // Returns the current frequency.
// metronome.volume()                                   // Returns the current volume.
// metronome.hide()                                     // Hide the UI widget. Only when not in headless mode.
// metronome.show()                                     // Show the UI widget. Only when not in headless mode.
// metronome.triggerSynth()                             // Manually trigger the synth. Web Audio must first be initiated by a user action.

// metronome.hidden()                                   // Returns true/false. Read-only.
// metronome.running()                                  // Returns true/false. Read-only.
// metronome.headless()                                 // Returns true/false. Read-only.
// metronome.ticks()                                    // Returns the tick count. Resets when metronome is stopped. Read-only.
// metronome.state()                                    // Returns an object containing instance state values.  Read-only.
// metronome.props()                                    // Returns an object containing instance properties.  Read-only.
// metronome.controllers()                              // Returns an object containing instance controllers.  Read-only.
// metronome.views()                                    // Returns an object containing instance views.  Read-only.
// metronome.uuid()                                     // Returns the instance's unique identifier. Read-only.
```

KDMetronome creates the widget at the end of the body element by default. Pass in a second DOM identifier to create the widget relative to a different parent.
```
// const metronome = new KDMetronome('toggleID', 'parentID')
```

Tested in Chrome, Safari, and FireFox. Made with ToneJS, NexusUI, WAAClock, and AnimateCSS. Dependencies are loaded dynamically.