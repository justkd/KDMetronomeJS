const _KDMetronomeInit = {
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
            outerContainer: ' .' + _KDMetronomeInit.cssClassNames.outerContainer + ' { opacity: 1; position: fixed; display: none; left: 80px; bottom: 80px; flex-wrap: wrap; justify-content: center; align-items: center; align-content: center;}',
            innerContainer: ' .' + _KDMetronomeInit.cssClassNames.innerContainer + '{ background-color: #ffffff; padding: 20px; display: flex; flex-wrap: no-wrap; justify-content: center; align-items: center; align-content: center; border-radius: 3px; box-shadow: 0 2px 7px 0 rgba(0, 0, 0, .5); -webkit-touch-callout: none; -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none;}',
            startButton: ' .' + _KDMetronomeInit.cssClassNames.startButton + '{ display: inline-block; height: 54px; width: 60px ;background-color: rgb(38, 38, 38); color: #ffffff; cursor: pointer; margin-right: 30px; opacity: 1; font-weight: 400; text-align: center; vertical-align: middle; user-select: none; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; -khtml-user-select: none; border: none; padding: .375rem .75rem; font-size: 1rem; line-height: 1.5; border-radius: .25rem; transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out; outline: none !important; text-transform: none; overflow: visible; -webkit-appearance: button;}',
            bpmWidgetOuter: ' .' + _KDMetronomeInit.cssClassNames.bpmWidgetOuter + '{ -webkit-touch-callout: none; -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; margin-right: 30px; border-radius: 3px; overflow: hidden;}',
            volWidgetOuter: ' .' + _KDMetronomeInit.cssClassNames.volWidgetOuter + '{ -webkit-touch-callout: none; -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; border-radius: 3px; overflow: hidden;}',
            widgetTextLabel: ' .' + _KDMetronomeInit.cssClassNames.widgetTextLabel + '{ text-align: center; background-color: #262626; color: #ffffff; line-height: 1.5;}',
            noTransition: '.no-transition { -webkit-transition: 0s -webkit-filter linear; -moz-transition: 0s -moz-filter linear; -moz-transition: 0s filter linear; -ms-transition: 0s -ms-filter linear; -o-transition: 0s -o-filter linear; transition: 0s filter linear, 0s -webkit-filter linear;}',
        }

        let css = ''
        Object.values(cssClasses).forEach(style => css += style)

        const addStyles = _ => {
            const style = document.createElement('style')
            style.id = _KDMetronomeInit.scriptTags.style
            style.appendChild(document.createTextNode(css))
            document.head.appendChild(style)
        }

        if (!document.getElementById(_KDMetronomeInit.scriptTags.style)) addStyles()
    },

    readyCheck: _ => {
        if (_KDMetronomeInit.state.toneLoaded && _KDMetronomeInit.state.nexusLoaded) {
            if (!_KDMetronomeInit.state.ready) _KDMetronomeInit.state.ready = true
        } else {
            let timeoutCounter = 0
            setTimeout(() => {
                if (timeoutCounter < 2000) {
                    timeoutCounter++
                    _KDMetronomeInit.readyCheck()
                } else {
                    console.log('Unable to load KDMetronome dependencies.')
                }
            }, 100)
        }
    },

    checkTone: _ => {
        if (typeof Tone != 'undefined') _KDMetronomeInit.state.toneLoaded = true
        _KDMetronomeInit.readyCheck()
    },

    checkNexus: _ => {
        if (typeof Nexus != 'undefined') _KDMetronomeInit.state.nexusLoaded = true
        _KDMetronomeInit.readyCheck()
    },

    loadToneJS: _ => {
        const script = document.createElement('script')
        script.id = _KDMetronomeInit.scriptTags.tone
        script.src = _KDMetronomeInit.cdn.tonejs
        script.onload = _ => _KDMetronomeInit.checkTone()
        document.body.appendChild(script)
    },

    loadNexusUI: _ => {
        const script = document.createElement('script')
        script.id = _KDMetronomeInit.scriptTags.nexus
        script.src = _KDMetronomeInit.cdn.nexusui
        script.onload = _ => _KDMetronomeInit.checkNexus()
        document.body.appendChild(script)
    },

    loadAnimateCSS: _ => {
        const link = document.createElement('link')
        link.id = _KDMetronomeInit.scriptTags.animate
        link.rel = 'stylesheet'
        link.href = _KDMetronomeInit.cdn.animate
        document.head.appendChild(link)
    },

    init: _ => {
        _KDMetronomeInit.createCSS()
        _KDMetronomeInit.loadAnimateCSS()
        _KDMetronomeInit.loadToneJS()
        _KDMetronomeInit.loadNexusUI()
    },

}
Object.freeze(_KDMetronomeInit)
_KDMetronomeInit.init()


class KDMetronome {
    constructor(toggleID, bpm) {

        // UTILITY

        const _createUUID = _ => {
            let date = new Date().getTime()
            let ms = (performance && performance.now && (performance.now() * 1000)) || 0 // time in microseconds since page-load or 0 if unsupported
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
                let random = Math.random() * 16 // random number between 0 and 16
                if (date > 0) { // use timestamp until depleted
                    random = (date + random) % 16 | 0
                    date = Math.floor(date / 16)
                } else { // use microseconds since page-load if supported
                    random = (ms + random) % 16 | 0
                    ms = Math.floor(ms / 16)
                }
                return (c === 'x' ? random : (random & 0x3 | 0x8)).toString(16)
            })
        }

        const _uuid = _createUUID()

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
            //const self = this

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
                    const inner = document.getElementById(_props.domIDs.inner)

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

        // PUBLIC PROPERTIES

        const _props = {
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

        const _state = {
            bpm: bpm ? bpm : _props.defaults.bpm,
            volume: _props.defaults.volume,
            frequency: _props.defaults.frequency,
            headless: false,
        }

        // PRIVATE PROPERTIES

        const _controllers = {
            context: null,
            clock: null,
            event: null,
        }

        const _views = {
            synth: null,
            bpmWidget: null,
            volumeWidget: null,
        }

        // PUBLIC METHODS

        let _callback = _ => _defaultCallback()

        const _setOptions = options => {
            if (options.headless) _headless(options.headless)
            if (options.toggleID) _props.domIDs.toggle = options.toggleID
            if (options.bpm) _state.bpm = options.bpm
            if (options.volume) _state.volume = options.volume
            if (options.frequency) _state.frequency = options.frequency
        }

        const _start = _ => {
            if (_controllers.event) this.stop()

            _controllers.context = window.webkitAudioContext ? new webkitAudioContext() : new AudioContext()

            _controllers.clock = new WAAClock(_controllers.context)
            _controllers.clock.start()

            const startButton = document.getElementById(_props.domIDs.startButton)
            if (startButton) {
                startButton.style.backgroundColor = _props.styles.green
                startButton.innerHTML = 'on'
                startButton.classList.add('noTransition') // make sure visual metronome ticks arent affected by animation transition durations
            }

            const seconds = 60 / _state.bpm
            _controllers.event = _controllers.clock.callbackAtTime(_ => _callback(), seconds).repeat(seconds)

            _views.synth.volume.value = Tone.gainToDb(_state.volume / 100)
            _callback()
        }

        const _stop = _ => {
            _controllers.clock.stop()
            _controllers.event.clear()
            _controllers.context.close()
            _controllers.event = null
            _controllers.clock = null
            _controllers.context = null


            const startButton = document.getElementById(_props.domIDs.startButton)
            if (startButton) {
                startButton.classList.remove('noTransition') // ensure normal button interactions are affected by animation transitions
                startButton.style.backgroundColor = _props.styles.black
                startButton.style.opacity = 1
                startButton.innerHTML = 'off'
            }
        }

        const _hide = _ => {
            if (document.getElementById(_props.domIDs.container)) {
                _animateCSS(_props.domIDs.container, 'bounceOutLeft', _ => document.getElementById(_props.domIDs.container).style.display = 'none')
            } else {
                console.log('unable to hide: headless mode')
            }
        }

        const _show = _ => {
            if (document.getElementById(_props.domIDs.container)) {
                document.getElementById(_props.domIDs.container).style.display = 'flex'
                _animateCSS(_props.domIDs.container, 'bounceInLeft')
            } else {
                console.log('unable to show: headless mode')
            }
        }

        const _running = _ => _controllers.event ? true : false

        const _bpm = bpm => {
            if (bpm) {
                if (this.running()) this.stop()
                _state.bpm = bpm
            }
            return _state.bpm
        }

        const _volume = volume => {
            if (volume) _state.volume = volume
            return _state.volume
        }

        const _frequency = hz => {
            if (hz) _state.frequency = hz
            return _state.frequency
        }

        const _hidden = _ => {
            const elem = document.getElementById(_props.domIDs.container)
            let hidden = 'undefined'
            if (elem) elem.style.display == 'none' ? hidden = true : hidden = false
            return hidden
        }

        const _headless = headless => {
            if (typeof headless === 'boolean') {
                _state.headless = headless
                const elem = document.getElementById(_props.domIDs.container)
                if (elem) elem.parentNode.removeChild(elem)
            }
            return _state.headless
        }

        const _getState = _ => _state

        const _getProps = _ => _props

        const _getViews = _ => _views

        const _getControllers = _ => _controllers

        // PRIVATE METHODS
        const _readyCheck = _ => {
            if (_KDMetronomeInit.state.ready) {
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
                    div.id = _props.domIDs.container
                    document.body.appendChild(div)
                })()

                const createInnerContainer = (_ => {
                    const container = document.getElementById(_props.domIDs.container)
                    container.classList.add(_KDMetronomeInit.cssClassNames.outerContainer)
                    container.innerHTML = "<div id='" + _props.domIDs.inner + "'></div>"
                })()

                const createUIElements = (_ => {
                    const inner = document.getElementById(_props.domIDs.inner)
                    inner.classList.add(_KDMetronomeInit.cssClassNames.innerContainer)
                    inner.innerHTML =
                        "<button id='" + _props.domIDs.startButton + "' class='" + _KDMetronomeInit.cssClassNames.startButton + "' type='button'>off</button>" +
                        "<div class='" + _KDMetronomeInit.cssClassNames.bpmWidgetOuter + "'><div id='" + _props.domIDs.bpmWidget + "'></div><div class='" + _KDMetronomeInit.cssClassNames.widgetTextLabel + "'>bpm</div></div>" +
                        "<div class='" + _KDMetronomeInit.cssClassNames.volWidgetOuter + "'><div id='" + _props.domIDs.volWidget + "'></div><div class='" + _KDMetronomeInit.cssClassNames.widgetTextLabel + "'>vol</div></div>"
                })()

            })()

            if (typeof toggleID === 'object') _setOptions(toggleID)

            _readyCheck()
        })()

        const _defaultCallback = _ => {
            _views.synth.triggerAttackRelease(_state.frequency, '8n')

            const startButton = document.getElementById(_props.domIDs.startButton)
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
                _views.synth = new Tone.Synth({
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

                _views.synth.volume.value = Tone.gainToDb(_state.volume / 100)
            })()

            const createBpmWidget = (_ => {
                if (document.getElementById(_props.domIDs.container)) {
                    const widget = '#' + _props.domIDs.bpmWidget

                    _views.bpmWidget = new Nexus.Number(widget, {
                        'size': [60, 30],
                        'value': _state.bpm,
                        'min': _props.bounds.bpm.min,
                        'max': _props.bounds.bpm.max,
                        'step': 1
                    })

                    _views.bpmWidget.on('change', value => {
                        this.bpm(value)
                    })

                    // /* center text, update font */
                    Object.values(document.getElementById(_props.domIDs.bpmWidget).children).forEach(child => {
                        child.style.textAlign = 'center'
                        child.style.backgroundColor = _props.styles.grey
                        child.style.color = _props.styles.black
                        child.style.fontFamily = _props.styles.fontFamily
                    })
                }
            })()

            const createVolumeWidget = (_ => {
                if (document.getElementById(_props.domIDs.container)) {
                    const widget = '#' + _props.domIDs.volWidget

                    _views.volumeWidget = new Nexus.Number(widget, {
                        'size': [60, 30],
                        'value': _state.volume,
                        'min': _props.bounds.volume.min,
                        'max': _props.bounds.volume.max,
                        'step': 1
                    })

                    _views.volumeWidget.on('change', value => {
                        _views.synth.volume.value = Tone.gainToDb(value / 100)
                        _state.volume = value
                    })

                    // /* center text, update font */
                    Object.values(document.getElementById(_props.domIDs.volWidget).children).forEach(child => {
                        child.style.textAlign = 'center'
                        child.style.backgroundColor = _props.styles.grey
                        child.style.color = _props.styles.black
                        child.style.fontFamily = _props.styles.fontFamily
                    })
                }
            })()

            if (document.getElementById(_props.domIDs.container)) {
                document.getElementById(_props.domIDs.container).style.display = 'none' // prepare container for this.hidden() check
                document.getElementById(_props.domIDs.startButton).style.opacity = 1 // prepare start button for opacity check
                /* Bind show/hide to the provided toggle element if available. */
                if (_props.domIDs.toggle) document.getElementById(_props.domIDs.toggle).addEventListener("click", e => this.hidden() ? this.show() : this.hide())
                /* Bind start button action */
                document.getElementById(_props.domIDs.startButton).addEventListener("click", e => _controllers.event ? this.stop() : this.start())
                /* make the container draggable */
                _makeDraggable(document.getElementById(_props.domIDs.container))
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
        this.state = _ => _getState()
        this.props = _ => _getProps()
        this.controllers = _ => _getControllers()
        this.views = _ => _getViews()
        this.uuid = _ => _uuid

    }

}