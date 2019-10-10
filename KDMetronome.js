class KDMetronome {
    constructor(toggleID, bpm) {

        this.props = {
            scriptTags: {
                tone: 'kdmetronome--tonejs--script',
                nexus: 'kdmetronome--nexusui--script',
                animate: 'kdmetronome--animatecss--style',
                style: 'kdmetronome--styles',
            },

            cdn: {
                tonejs: 'https://cdnjs.cloudflare.com/ajax/libs/tone/14.3.32/Tone.js',
                nexusui: 'https://cdn.jsdelivr.net/npm/nexusui@2.0.10/dist/NexusUI.min.js',
                animate: 'https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.7.2/animate.min.css',
            },

            domIDs: {
                toggle: toggleID,
                container: 'kdmetronome--outer', // outer metronome container div that will be animated on and off screen
                inner: 'kdmetronome--inner', // inner container that will actually hold UI elements
                startButton: 'kdmetronome--startbutton',
                bpmWidget: 'kdmetronome--bpmwidget',
                volWidget: 'kdmetronome--volwidget',
            },

            /** app-wide styles */
            styles: {
                fontFamily: 'Roboto Condensed, Trebuchet MS, Lucida Sans Unicode, Lucida Grande, Lucida Sans, Arial, sans-serif',
                black: '#262626',
                green: '#1dd1a1',
                grey: '#eeeeee',
            },

            bounds: {
                bpm: {
                    min: 6,
                    max: 300,
                },
                volume: {
                    min: 1,
                    max: 100,
                },
            },

            defaults: {
                volume: 50,
                bpm: 72,
                frequency: 600,
            },

            cssClassNames: {
                outerContainer: 'kdmetronome--outer-container',
                innerContainer: 'kdmetronome--inner-container',
                startButton: 'kdmetronome--start-button',
                bpmWidgetOuter: 'kdmetronome--bpm-widget-outer',
                volWidgetOuter: 'kdmetronome--vol-widget-outer',
                widgetTextLabel: 'kdmetronome--widget-text-label',
            },

        }

        this.state = {
            toneLoaded: false,
            nexusLoaded: false,
            ready: false,
            bpm: bpm ? bpm : this.props.defaults.bpm,
            volume: this.props.defaults.volume,
            frequency: this.props.defaults.frequency,
        }

        this.controllers = {
            context: null,
            clock: null,
            event: null,
        }

        this.views = {
            synth: null,
            bpm: null,
            volume: null,
        }

        this.createMetronome = _ => {

            const createSynth = (_ => {
                this.views.synth = new Tone.Synth({
                    oscillator: {
                        type: 'sine',
                        modulationFrequency: 0.4
                    },
                    envelope: {
                        attack: 0,
                        decay: 0.05,
                        sustain: 0,
                        release: 0.1,
                    },
                }).toDestination()

                this.views.synth.volume.value = Tone.gainToDb(this.state.volume / 100)
            })()

            const createBpmWidget = (_ => {
                if (document.getElementById(this.props.domIDs.container)) {
                    const widget = '#' + this.props.domIDs.bpmWidget

                    this.views.bpmWidget = new Nexus.Number(widget, {
                        'size': [60, 30],
                        'value': this.state.bpm,
                        'min': this.props.bounds.bpm.min,
                        'max': this.props.bounds.bpm.max,
                        'step': 1
                    })

                    this.views.bpmWidget.on('change', value => {
                        this.setBPM(value)
                    })

                    // /* center text, update font */
                    Object.values(document.getElementById(this.props.domIDs.bpmWidget).children).forEach(child => {
                        child.style.textAlign = 'center'
                        child.style.backgroundColor = this.props.styles.grey
                        child.style.color = this.props.styles.black
                        child.style.fontFamily = this.props.styles.fontFamily
                    })
                }
            })()

            const createVolumeWidget = (_ => {
                if (document.getElementById(this.props.domIDs.container)) {
                    const widget = '#' + this.props.domIDs.volWidget

                    this.views.volumeWidget = new Nexus.Number(widget, {
                        'size': [60, 30],
                        'value': this.state.volume,
                        'min': this.props.bounds.volume.min,
                        'max': this.props.bounds.volume.max,
                        'step': 1
                    })

                    this.views.volumeWidget.on('change', value => {
                        this.views.synth.volume.value = Tone.gainToDb(value / 100)
                        this.state.volume = value
                    })

                    // /* center text, update font */
                    Object.values(document.getElementById(this.props.domIDs.volWidget).children).forEach(child => {
                        child.style.textAlign = 'center'
                        child.style.backgroundColor = this.props.styles.grey
                        child.style.color = this.props.styles.black
                        child.style.fontFamily = this.props.styles.fontFamily
                    })
                }
            })()

            if (document.getElementById(this.props.domIDs.container)) {
                document.getElementById(this.props.domIDs.container).style.display = 'none' // prepare container for this.isHidden() check
                document.getElementById(this.props.domIDs.startButton).style.opacity = 1 // prepare start button for opacity check
                /* Bind show/hide to the provided toggle element if available. */
                if (this.props.domIDs.toggle) document.getElementById(this.props.domIDs.toggle).addEventListener("click", e => this.isHidden() ? this.show() : this.hide())
                /* Bind start button action */
                document.getElementById(this.props.domIDs.startButton).addEventListener("click", e => this.controllers.event ? this.stop() : this.start())
                /* make the container draggable */
                this.draggable(document.getElementById(this.props.domIDs.container))
            }

        }

        const load = (_ => {

            const createCSS = (_ => {

                const cssClasses = {
                    outerContainer: ' .' + this.props.cssClassNames.outerContainer + ' { opacity: 1; position: fixed; display: none; left: 80px; bottom: 80px; flex-wrap: wrap; justify-content: center; align-items: center; align-content: center;}',
                    innerContainer: ' .' + this.props.cssClassNames.innerContainer + '{ background-color: #ffffff; padding: 20px; display: flex; flex-wrap: no-wrap; justify-content: center; align-items: center; align-content: center; border-radius: 3px; box-shadow: 0 2px 7px 0 rgba(0, 0, 0, .5); -webkit-touch-callout: none; -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none;}',
                    startButton: ' .' + this.props.cssClassNames.startButton + '{ display: inline-block; height: 54px; width: 60px ;background-color: rgb(38, 38, 38); color: #ffffff; cursor: pointer; margin-right: 30px; opacity: 1; font-weight: 400; text-align: center; vertical-align: middle; user-select: none; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; -khtml-user-select: none; border: none; padding: .375rem .75rem; font-size: 1rem; line-height: 1.5; border-radius: .25rem; transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out; outline: none !important; text-transform: none; overflow: visible; -webkit-appearance: button;}',
                    bpmWidgetOuter: ' .' + this.props.cssClassNames.bpmWidgetOuter + '{ -webkit-touch-callout: none; -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; margin-right: 30px; border-radius: 3px; overflow: hidden;}',
                    volWidgetOuter: ' .' + this.props.cssClassNames.volWidgetOuter + '{ -webkit-touch-callout: none; -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; border-radius: 3px; overflow: hidden;}',
                    widgetTextLabel: ' .' + this.props.cssClassNames.widgetTextLabel + '{ text-align: center; background-color: #262626; color: #ffffff; line-height: 1.5;}',
                    noTransition: '.no-transition { -webkit-transition: 0s -webkit-filter linear; -moz-transition: 0s -moz-filter linear; -moz-transition: 0s filter linear; -ms-transition: 0s -ms-filter linear; -o-transition: 0s -o-filter linear; transition: 0s filter linear, 0s -webkit-filter linear;}',
                }

                let css = ''
                Object.values(cssClasses).forEach(style => css += style)

                const addStyles = _ => {
                    const style = document.createElement('style')
                    style.id = this.props.scriptTags.style
                    style.appendChild(document.createTextNode(css))
                    document.head.appendChild(style)
                }

                if (!document.getElementById(this.props.scriptTags.style)) addStyles()
            })()

            const createDomElements = (_ => {

                const createOuterContainer = (_ => {
                    const div = document.createElement("div");
                    div.id = this.props.domIDs.container
                    document.body.appendChild(div)
                })()

                const createInnerContainer = (_ => {
                    const container = document.getElementById(this.props.domIDs.container)
                    container.classList.add(this.props.cssClassNames.outerContainer)
                    container.innerHTML = "<div id='" + this.props.domIDs.inner + "'></div>"
                })()

                const createUIElements = (_ => {
                    const inner = document.getElementById(this.props.domIDs.inner)
                    inner.classList.add(this.props.cssClassNames.innerContainer)
                    inner.innerHTML =
                        "<button id='" + this.props.domIDs.startButton + "' class='" + this.props.cssClassNames.startButton + "' type='button'>off</button>" +
                        "<div class='" + this.props.cssClassNames.bpmWidgetOuter + "'><div id='" + this.props.domIDs.bpmWidget + "'></div><div class='" + this.props.cssClassNames.widgetTextLabel + "'>bpm</div></div>" +
                        "<div class='" + this.props.cssClassNames.volWidgetOuter + "'><div id='" + this.props.domIDs.volWidget + "'></div><div class='" + this.props.cssClassNames.widgetTextLabel + "'>vol</div></div>"

                })()

            })()

            const readyCheck = _ => {
                if (this.state.toneLoaded && this.state.nexusLoaded) {
                    if (!this.state.ready) {
                        this.state.ready = true
                        this.createMetronome()
                    }
                } else {
                    let timeoutCounter = 0
                    setTimeout(() => {
                        if (timeoutCounter < 2000) {
                            timeoutCounter++
                            readyCheck()
                        } else {
                            console.log('unable to create metronome')
                        }
                    }, 100)
                }
            }

            const checkTone = _ => {
                if (typeof Tone != 'undefined') this.state.toneLoaded = true
                readyCheck()
            }

            const checkNexus = _ => {
                if (typeof Nexus != 'undefined') this.state.nexusLoaded = true
                readyCheck()
            }

            const loadToneJS = _ => {
                const script = document.createElement('script')
                script.id = this.props.scriptTags.tone
                script.src = this.props.cdn.tonejs
                script.onload = _ => checkTone()
                document.body.appendChild(script)
            }

            const loadNexusUI = _ => {
                const script = document.createElement('script')
                script.id = this.props.scriptTags.nexus
                script.src = this.props.cdn.nexusui
                script.onload = _ => checkNexus()
                document.body.appendChild(script)
            }

            const loadAnimateCSS = _ => {
                const link = document.createElement('link')
                link.id = this.props.scriptTags.animate
                link.rel = 'stylesheet'
                link.href = this.props.cdn.animate
                document.head.appendChild(link)
            }

            document.getElementById(this.props.scriptTags.animate) ? null : loadAnimateCSS()
            document.getElementById(this.props.scriptTags.tone) ? checkTone() : loadToneJS()
            document.getElementById(this.props.scriptTags.nexus) ? checkNexus() : loadNexusUI()

        })()

    }

    start() {
        if (this.controllers.event) this.stop()

        this.controllers.context = window.webkitAudioContext ? new webkitAudioContext() : new AudioContext()

        this.controllers.clock = new WAAClock(this.controllers.context)
        this.controllers.clock.start()

        const startButton = document.getElementById(this.props.domIDs.startButton)
        if (startButton) {
            startButton.style.backgroundColor = this.props.styles.green
            startButton.innerHTML = 'on'
            startButton.classList.add('noTransition') // make sure visual metronome ticks arent affected by animation transition durations
        }

        const seconds = 60 / this.state.bpm
        this.controllers.event = this.controllers.clock.callbackAtTime(_ => this.callback(), seconds).repeat(seconds)

        this.views.synth.volume.value = Tone.gainToDb(this.state.volume / 100)
        this.views.synth.triggerAttackRelease(this.state.frequency, '8n')
    }

    stop() {
        this.controllers.clock.stop()
        this.controllers.event.clear()
        this.controllers.context.close()
        this.controllers.event = null
        this.controllers.clock = null
        this.controllers.context = null


        const startButton = document.getElementById(this.props.domIDs.startButton)
        if (startButton) {
            startButton.classList.remove('noTransition') // ensure normal button interactions are affected by animation transitions
            startButton.style.backgroundColor = this.props.styles.black
            startButton.style.opacity = 1
            startButton.innerHTML = 'off'
        }
    }

    callback() {
        this.views.synth.triggerAttackRelease(this.state.frequency, '8n')

        const startButton = document.getElementById(this.props.domIDs.startButton)
        if (startButton) startButton.style.opacity < 1 ? startButton.style.opacity = 1 : startButton.style.opacity = 0.7
    }

    hide() {
        if (document.getElementById(this.props.domIDs.container)) {
            this.animateCSS(this.props.domIDs.container, 'bounceOutLeft', _ => document.getElementById(this.props.domIDs.container).style.display = 'none')
        } else {
            console.log('headless mode')
        }
    }

    show() {
        if (document.getElementById(this.props.domIDs.container)) {
            document.getElementById(this.props.domIDs.container).style.display = 'flex'
            this.animateCSS(this.props.domIDs.container, 'bounceInLeft')
        } else {
            console.log('headless mode')
        }
    }

    isOn() {
        return this.controllers.event ? true : false
    }

    setBPM(bpm) {
        if (this.isOn()) this.stop()
        this.state.bpm = bpm
    }

    setVolume(volume) {
        // only set the state property here
        this.state.volume = volume
        // actual `synth` volume is set in `start()` to avoid errors if calling `setVolume()` before `synth` is instantiated
    }

    setFrequency(hz) {
        this.state.frequency = hz
    }

    isHidden() {
        const elem = document.getElementById(this.props.domIDs.container)
        let hidden = 'undefined'
        if (elem) elem.style.display == 'none' ? hidden = true : hidden = false
        return hidden
    }

    headless() {
        const elem = document.getElementById(this.props.domIDs.container)
        if (elem) elem.parentNode.removeChild(elem)
    }

    /** `animate.css` helper */
    animateCSS(element, animationName, callback) {
        const node = document.querySelector('#' + element)
        node.classList.add('animated', animationName)

        const handleAnimationEnd = _ => {
            node.classList.remove('animated', animationName)
            node.removeEventListener('animationend', handleAnimationEnd)
            if (typeof callback === 'function') callback()
        }

        node.addEventListener('animationend', handleAnimationEnd)
    }

    draggable(element) {
        const pos = [0, 0, 0, 0]
        const self = this
        element.onmousedown = dragMouseDown

        function dragMouseDown(e) {
            e = e || window.event
            e.preventDefault()

            const getPosition = (_ => {
                pos[2] = e.clientX
                pos[3] = e.clientY * 2
            })()

            const handleMouseEvents = (_ => {
                document.onmouseup = closeDragElement
                document.onmousemove = elementDrag
            })()
        }

        function elementDrag(e) {
            e = e || window.event
            e.preventDefault()

            const calcPosition = (_ => {
                pos[0] = pos[2] - e.clientX
                pos[1] = pos[3] - e.clientY * 2
                pos[2] = e.clientX
                pos[3] = e.clientY * 2
            })()

            const setPosition = (_ => {
                const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
                const height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
                const inner = document.getElementById(self.props.domIDs.inner)

                // find absolute position
                let top = (element.offsetTop - pos[1])
                let left = (element.offsetLeft - pos[0])

                // restrict to window bounds    
                top = Math.min(Math.max(top, -height + inner.clientHeight), height)
                left = Math.min(Math.max(left, 0), width - inner.clientWidth)

                element.style.top = top + "px"
                element.style.left = left + "px"
            })()
        }

        function closeDragElement() {
            document.onmouseup = null
            document.onmousemove = null
        }
    }

}