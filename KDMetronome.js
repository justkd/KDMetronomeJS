const KDMetronomeInit = {
    cdn: {
        tonejs: 'https://cdnjs.cloudflare.com/ajax/libs/tone/14.3.32/Tone.js',
        nexusui: 'https://cdn.jsdelivr.net/npm/nexusui@2.0.10/dist/NexusUI.min.js',
        animate: 'https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.7.2/animate.min.css',
    },

    scriptTags: {
        tone: 'kdmetronome--tonejs--script',
        nexus: 'kdmetronome--nexusui--script',
        animate: 'kdmetronome--animatecss--style',
        style: 'kdmetronome--styles',
    },

    cssClassNames: {
        outerContainer: 'kdmetronome--outer-container',
        innerContainer: 'kdmetronome--inner-container',
        startButton: 'kdmetronome--start-button',
        bpmWidgetOuter: 'kdmetronome--bpm-widget-outer',
        volWidgetOuter: 'kdmetronome--vol-widget-outer',
        widgetTextLabel: 'kdmetronome--widget-text-label',
    },

    state: {
        toneLoaded: false,
        nexusLoaded: false,
        ready: false,
    },

    createCSS: _ => {

        const cssClasses = {
            outerContainer: ' .' + KDMetronomeInit.cssClassNames.outerContainer + ' { opacity: 1; position: fixed; display: none; left: 80px; bottom: 80px; flex-wrap: wrap; justify-content: center; align-items: center; align-content: center;}',
            innerContainer: ' .' + KDMetronomeInit.cssClassNames.innerContainer + '{ background-color: #ffffff; padding: 20px; display: flex; flex-wrap: no-wrap; justify-content: center; align-items: center; align-content: center; border-radius: 3px; box-shadow: 0 2px 7px 0 rgba(0, 0, 0, .5); -webkit-touch-callout: none; -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none;}',
            startButton: ' .' + KDMetronomeInit.cssClassNames.startButton + '{ display: inline-block; height: 54px; width: 60px ;background-color: rgb(38, 38, 38); color: #ffffff; cursor: pointer; margin-right: 30px; opacity: 1; font-weight: 400; text-align: center; vertical-align: middle; user-select: none; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; -khtml-user-select: none; border: none; padding: .375rem .75rem; font-size: 1rem; line-height: 1.5; border-radius: .25rem; transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out; outline: none !important; text-transform: none; overflow: visible; -webkit-appearance: button;}',
            bpmWidgetOuter: ' .' + KDMetronomeInit.cssClassNames.bpmWidgetOuter + '{ -webkit-touch-callout: none; -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; margin-right: 30px; border-radius: 3px; overflow: hidden;}',
            volWidgetOuter: ' .' + KDMetronomeInit.cssClassNames.volWidgetOuter + '{ -webkit-touch-callout: none; -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; border-radius: 3px; overflow: hidden;}',
            widgetTextLabel: ' .' + KDMetronomeInit.cssClassNames.widgetTextLabel + '{ text-align: center; background-color: #262626; color: #ffffff; line-height: 1.5;}',
            noTransition: '.no-transition { -webkit-transition: 0s -webkit-filter linear; -moz-transition: 0s -moz-filter linear; -moz-transition: 0s filter linear; -ms-transition: 0s -ms-filter linear; -o-transition: 0s -o-filter linear; transition: 0s filter linear, 0s -webkit-filter linear;}',
        }

        let css = ''
        Object.values(cssClasses).forEach(style => css += style)

        const addStyles = _ => {
            const style = document.createElement('style')
            style.id = KDMetronomeInit.scriptTags.style
            style.appendChild(document.createTextNode(css))
            document.head.appendChild(style)
        }

        if (!document.getElementById(KDMetronomeInit.scriptTags.style)) addStyles()
    },

    readyCheck: _ => {
        if (KDMetronomeInit.state.toneLoaded && KDMetronomeInit.state.nexusLoaded) {
            if (!KDMetronomeInit.state.ready) {
                KDMetronomeInit.state.ready = true
            }
        } else {
            let timeoutCounter = 0
            setTimeout(() => {
                if (timeoutCounter < 2000) {
                    timeoutCounter++
                    KDMetronomeInit.readyCheck()
                } else {
                    console.log('unable to create metronome')
                }
            }, 100)
        }
    },

    checkTone: _ => {
        if (typeof Tone != 'undefined') KDMetronomeInit.state.toneLoaded = true
        KDMetronomeInit.readyCheck()
    },

    checkNexus: _ => {
        if (typeof Nexus != 'undefined') KDMetronomeInit.state.nexusLoaded = true
        KDMetronomeInit.readyCheck()
    },

    loadToneJS: _ => {
        const script = document.createElement('script')
        script.id = KDMetronomeInit.scriptTags.tone
        script.src = KDMetronomeInit.cdn.tonejs
        script.onload = _ => KDMetronomeInit.checkTone()
        document.body.appendChild(script)
    },

    loadNexusUI: _ => {
        const script = document.createElement('script')
        script.id = KDMetronomeInit.scriptTags.nexus
        script.src = KDMetronomeInit.cdn.nexusui
        script.onload = _ => KDMetronomeInit.checkNexus()
        document.body.appendChild(script)
    },

    loadAnimateCSS: _ => {
        const link = document.createElement('link')
        link.id = KDMetronomeInit.scriptTags.animate
        link.rel = 'stylesheet'
        link.href = KDMetronomeInit.cdn.animate
        document.head.appendChild(link)
    },

    init: _ => {
        KDMetronomeInit.createCSS()
        KDMetronomeInit.loadAnimateCSS()
        KDMetronomeInit.loadToneJS()
        KDMetronomeInit.loadNexusUI()
    },

}
KDMetronomeInit.init()


class KDMetronome {
    constructor(toggleID, bpm) {

        // UTILITY

        const _getUUID = _ => {
            var d = new Date().getTime() //Timestamp
            var d2 = (performance && performance.now && (performance.now() * 1000)) || 0 //Time in microseconds since page-load or 0 if unsupported
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
                var r = Math.random() * 16 //random number between 0 and 16
                if (d > 0) { //Use timestamp until depleted
                    r = (d + r) % 16 | 0
                    d = Math.floor(d / 16)
                } else { //Use microseconds since page-load if supported
                    r = (d2 + r) % 16 | 0
                    d2 = Math.floor(d2 / 16)
                }
                return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
            })
        }

        /** `animate.css` helper */
        const _animateCSS = (element, animationName, callback) => {
            const node = document.querySelector('#' + element)
            node.classList.add('animated', animationName)

            const handleAnimationEnd = _ => {
                node.classList.remove('animated', animationName)
                node.removeEventListener('animationend', handleAnimationEnd)
                if (typeof callback === 'function') callback()
            }

            node.addEventListener('animationend', handleAnimationEnd)
        }

        const _makeDraggable = element => {
            const pos = [0, 0, 0, 0]
            const self = this

            const closeDragElement = _ => {
                document.onmouseup = null
                document.onmousemove = null
            }

            const elementDrag = e => {
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

            const dragMouseDown = e => {
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

            element.onmousedown = dragMouseDown
        }

        const _uuid = _getUUID()

        // PUBLIC PROPERTIES

        this.props = {
            uuid: _uuid,

            domIDs: {
                toggle: typeof toggleID === 'object' ? null : toggleID,
                container: 'kdmetronome--outer-' + _uuid, // outer metronome container div that will be animated on and off screen
                inner: 'kdmetronome--inner-' + _uuid, // inner container that will actually hold UI elements
                startButton: 'kdmetronome--startbutton-' + _uuid,
                bpmWidget: 'kdmetronome--bpmwidget-' + _uuid,
                volWidget: 'kdmetronome--volwidget-' + _uuid,
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
                    min: 0,
                    max: 100,
                },
            },

            defaults: {
                volume: 50,
                bpm: 72,
                frequency: 600,
            },

        }

        this.state = {
            bpm: bpm ? bpm : this.props.defaults.bpm,
            volume: this.props.defaults.volume,
            frequency: this.props.defaults.frequency,
            headless: false,
        }

        // PRIVATE PROPERTIES

        this._controllers = {
            context: null,
            clock: null,
            event: null,
        }

        this._views = {
            synth: null,
            bpmWidget: null,
            volumeWidget: null,
        }

        // PUBLIC METHODS

        let _callback = _ => _defaultCallback()

        const _setOptions = options => {
            if (options.headless) _headless(options.headless)
            if (options.toggleID) this.props.domIDs.toggle = options.toggleID
            if (options.bpm) this.state.bpm = options.bpm
            if (options.volume) this.state.volume = options.volume
            if (options.frequency) this.state.frequency = options.frequency
        }

        const _start = _ => {
            if (this._controllers.event) this.stop()

            this._controllers.context = window.webkitAudioContext ? new webkitAudioContext() : new AudioContext()

            this._controllers.clock = new WAAClock(this._controllers.context)
            this._controllers.clock.start()

            const startButton = document.getElementById(this.props.domIDs.startButton)
            if (startButton) {
                startButton.style.backgroundColor = this.props.styles.green
                startButton.innerHTML = 'on'
                startButton.classList.add('noTransition') // make sure visual metronome ticks arent affected by animation transition durations
            }

            const seconds = 60 / this.state.bpm
            this._controllers.event = this._controllers.clock.callbackAtTime(_ => _callback(), seconds).repeat(seconds)

            this._views.synth.volume.value = Tone.gainToDb(this.state.volume / 100)
            _callback()
        }

        const _stop = _ => {
            this._controllers.clock.stop()
            this._controllers.event.clear()
            this._controllers.context.close()
            this._controllers.event = null
            this._controllers.clock = null
            this._controllers.context = null


            const startButton = document.getElementById(this.props.domIDs.startButton)
            if (startButton) {
                startButton.classList.remove('noTransition') // ensure normal button interactions are affected by animation transitions
                startButton.style.backgroundColor = this.props.styles.black
                startButton.style.opacity = 1
                startButton.innerHTML = 'off'
            }
        }

        const _hide = _ => {
            if (document.getElementById(this.props.domIDs.container)) {
                _animateCSS(this.props.domIDs.container, 'bounceOutLeft', _ => document.getElementById(this.props.domIDs.container).style.display = 'none')
            } else {
                console.log('unable to hide: headless mode')
            }
        }

        const _show = _ => {
            if (document.getElementById(this.props.domIDs.container)) {
                document.getElementById(this.props.domIDs.container).style.display = 'flex'
                _animateCSS(this.props.domIDs.container, 'bounceInLeft')
            } else {
                console.log('unable to show: headless mode')
            }
        }

        const _running = _ => {
            return this._controllers.event ? true : false
        }

        const _bpm = bpm => {
            if (bpm) {
                if (this.running()) this.stop()
                this.state.bpm = bpm
            }
            return this.state.bpm
        }

        const _volume = volume => {
            if (volume) this.state.volume = volume
            return this.state.volume
        }

        const _frequency = hz => {
            if (hz) this.state.frequency = hz
            return this.state.frequency
        }

        const _hidden = _ => {
            const elem = document.getElementById(this.props.domIDs.container)
            let hidden = 'undefined'
            if (elem) elem.style.display == 'none' ? hidden = true : hidden = false
            return hidden
        }

        const _headless = headless => {
            if (typeof headless === 'boolean') {
                this.state.headless = headless
                const elem = document.getElementById(this.props.domIDs.container)
                if (elem) elem.parentNode.removeChild(elem)
            }
            return this.state.headless
        }

        // PRIVATE METHODS
        const _readyCheck = _ => {
            if (KDMetronomeInit.state.ready) {
                _createMetronome()
            } else {
                let timeoutCounter = 0
                setTimeout(() => {
                    if (timeoutCounter < 2000) {
                        timeoutCounter++
                        _readyCheck()
                    } else {
                        console.log('unable to create metronome')
                    }
                }, 100)
            }
        }

        const _load = (_ => {

            const createDomElements = (_ => {

                const createOuterContainer = (_ => {
                    const div = document.createElement("div");
                    div.id = this.props.domIDs.container
                    document.body.appendChild(div)
                })()

                const createInnerContainer = (_ => {
                    const container = document.getElementById(this.props.domIDs.container)
                    container.classList.add(KDMetronomeInit.cssClassNames.outerContainer)
                    container.innerHTML = "<div id='" + this.props.domIDs.inner + "'></div>"
                })()

                const createUIElements = (_ => {
                    const inner = document.getElementById(this.props.domIDs.inner)
                    inner.classList.add(KDMetronomeInit.cssClassNames.innerContainer)
                    inner.innerHTML =
                        "<button id='" + this.props.domIDs.startButton + "' class='" + KDMetronomeInit.cssClassNames.startButton + "' type='button'>off</button>" +
                        "<div class='" + KDMetronomeInit.cssClassNames.bpmWidgetOuter + "'><div id='" + this.props.domIDs.bpmWidget + "'></div><div class='" + KDMetronomeInit.cssClassNames.widgetTextLabel + "'>bpm</div></div>" +
                        "<div class='" + KDMetronomeInit.cssClassNames.volWidgetOuter + "'><div id='" + this.props.domIDs.volWidget + "'></div><div class='" + KDMetronomeInit.cssClassNames.widgetTextLabel + "'>vol</div></div>"
                })()

            })()

            if (typeof toggleID === 'object') _setOptions(toggleID)

            _readyCheck()
        })()

        const _defaultCallback = _ => {
            this._views.synth.triggerAttackRelease(this.state.frequency, '8n')

            const startButton = document.getElementById(this.props.domIDs.startButton)
            if (startButton) startButton.style.opacity < 1 ? startButton.style.opacity = 1 : startButton.style.opacity = 0.7
        }

        const _setCallback = callback => {
            if (typeof callback === 'function') {
                _callback = callback
            } else if (callback === 'default') {
                _callback = _ => _defaultCallback()
            }
        }

        const _createMetronome = _ => {

            const createSynth = (_ => {
                this._views.synth = new Tone.Synth({
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

                this._views.synth.volume.value = Tone.gainToDb(this.state.volume / 100)
            })()

            const createBpmWidget = (_ => {
                if (document.getElementById(this.props.domIDs.container)) {
                    const widget = '#' + this.props.domIDs.bpmWidget

                    this._views.bpmWidget = new Nexus.Number(widget, {
                        'size': [60, 30],
                        'value': this.state.bpm,
                        'min': this.props.bounds.bpm.min,
                        'max': this.props.bounds.bpm.max,
                        'step': 1
                    })

                    this._views.bpmWidget.on('change', value => {
                        this.bpm(value)
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

                    this._views.volumeWidget = new Nexus.Number(widget, {
                        'size': [60, 30],
                        'value': this.state.volume,
                        'min': this.props.bounds.volume.min,
                        'max': this.props.bounds.volume.max,
                        'step': 1
                    })

                    this._views.volumeWidget.on('change', value => {
                        this._views.synth.volume.value = Tone.gainToDb(value / 100)
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
                document.getElementById(this.props.domIDs.container).style.display = 'none' // prepare container for this.hidden() check
                document.getElementById(this.props.domIDs.startButton).style.opacity = 1 // prepare start button for opacity check
                /* Bind show/hide to the provided toggle element if available. */
                if (this.props.domIDs.toggle) document.getElementById(this.props.domIDs.toggle).addEventListener("click", e => this.hidden() ? this.show() : this.hide())
                /* Bind start button action */
                document.getElementById(this.props.domIDs.startButton).addEventListener("click", e => this._controllers.event ? this.stop() : this.start())
                /* make the container draggable */
                _makeDraggable(document.getElementById(this.props.domIDs.container))
            }

        }

        // API

        this.callback = callback => _setCallback(callback)
        this.setOptions = options => _setOptions(options)
        this.start = _ => _start()
        this.stop = _ => _stop()
        this.hide = _ => _hide()
        this.show = _ => _show()
        this.running = _ => _running()
        this.bpm = bpm => _bpm(bpm)
        this.volume = volume => _volume(volume)
        this.frequency = hz => _frequency(hz)
        this.hidden = _ => _hidden()
        this.headless = headless => _headless(headless)
    }

}