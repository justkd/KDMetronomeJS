/**
 * Loads and checks for dependencies before reporting ready. Creates default CSS in a <style> tag.
 * 
 * 
 */
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

        const styles = {
            outerContainer: {
                opacity: 1,
                position: 'fixed',
                display: 'none',
                left: '80px',
                bottom: '80px',
                'flex-wrap': 'wrap',
                'justify-content': 'center',
                'align-items': 'center',
                'align-content': 'center',
            },
            innerContainer: {
                padding: '20px',
                display: 'flex',
                'background-color': '#ffffff',
                'flex-wrap': 'no-wrap',
                'justify-content': 'center',
                'align-items': 'center',
                'align-content': 'center',
                'border-radius': '3px',
                'box-shadow': '0 2px 7px 0 rgba(0, 0, 0, .5)',
                '-webkit-touch-callout': 'none',
                '-webkit-user-select': 'none',
                '-khtml-user-select': 'none',
                '-moz-user-select': 'none',
                '-ms-user-select': 'none',
                'user-select': 'none',
            },
            startButton: {
                display: 'inline-block',
                border: 'none',
                padding: '.375rem .75rem',
                height: '54px',
                width: '60px',
                opacity: '1',
                color: '#ffffff',
                cursor: 'pointer',
                outline: 'none !important',
                overflow: 'visible',
                'font-weight': '400',
                'font-size': '1rem',
                'line-height': '1.5',
                'margin-right': '30px',
                'border-radius': '.25rem',
                'background-color': 'rgb(38, 38, 38)',
                'text-align': 'center',
                'vertical-align': 'middle',
                '-webkit-touch-callout': 'none',
                '-webkit-user-select': 'none',
                '-khtml-user-select': 'none',
                '-moz-user-select': 'none',
                '-ms-user-select': 'none',
                'user-select': 'none',
                'text-transform': 'none',
                '-webkit-appearance': 'button',
                transition: 'color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out',
            },
            bpmWidgetOuter: {
                overflow: 'hidden',
                'margin-right': '30px',
                'border-radius': '3px',
                '-webkit-touch-callout': 'none',
                '-webkit-user-select': 'none',
                '-khtml-user-select': 'none',
                '-moz-user-select': 'none',
                '-ms-user-select': 'none',
                'user-select': 'none',
            },
            volWidgetOuter: {
                overflow: 'hidden',
                'border-radius': '3px',
                '-webkit-touch-callout': 'none',
                '-webkit-user-select': 'none',
                '-khtml-user-select': 'none',
                '-moz-user-select': 'none',
                '-ms-user-select': 'none',
                'user-select': 'none',
            },
            widgetTextLabel: {
                color: '#ffffff',
                'line-height': '1.5',
                'text-align': 'center',
                'background-color': '#262626',
            },
            noTransition: {
                '-webkit-transition': '0s -webkit-filter linear',
                '-moz-transition': '0s -moz-filter linear',
                '-moz-transition': '0s filter linear',
                '-ms-transition': '0s -ms-filter linear',
                '-o-transition': '0s -o-filter linear',
                'transition': '0s filter linear, 0s -webkit-filter linear',
            },
        }

        const createStyleString = styles => {
            let string = ' {'
            const keys = Object.keys(styles)
            keys.forEach(key => string += key + ': ' + styles[key] + ';')
            string += '}'
            return string
        }

        const cssClasses = {
            outerContainer: ' .' + _KDMetronomeInit.cssClassNames.outerContainer + createStyleString(styles.outerContainer),
            innerContainer: ' .' + _KDMetronomeInit.cssClassNames.innerContainer + createStyleString(styles.innerContainer),
            startButton: ' .' + _KDMetronomeInit.cssClassNames.startButton + createStyleString(styles.startButton),
            bpmWidgetOuter: ' .' + _KDMetronomeInit.cssClassNames.bpmWidgetOuter + createStyleString(styles.bpmWidgetOuter),
            volWidgetOuter: ' .' + _KDMetronomeInit.cssClassNames.volWidgetOuter + createStyleString(styles.volWidgetOuter),
            widgetTextLabel: ' .' + _KDMetronomeInit.cssClassNames.widgetTextLabel + createStyleString(styles.widgetTextLabel),
            noTransition: '.no-transition' + createStyleString(styles.noTransition)
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
        if (_KDMetronomeInit.state.toneLoaded && _KDMetronomeInit.state.nexusLoaded)
            if (!_KDMetronomeInit.state.ready) _KDMetronomeInit.state.ready = true
        else {
            let timeoutCounter = 0
            setTimeout(_ => {
                if (timeoutCounter < 2000) {
                    timeoutCounter++
                    _KDMetronomeInit.readyCheck()
                } else console.log('Unable to load KDMetronome dependencies.')
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

    init: skipDependencies => {
        _KDMetronomeInit.createCSS()
        if (!skipDependencies) {
            _KDMetronomeInit.loadAnimateCSS()
            _KDMetronomeInit.loadToneJS()
            _KDMetronomeInit.loadNexusUI()
        } else Object.values(_KDMetronomeInit.state).forEach(value => value = true)
    },

}
Object.freeze(_KDMetronomeInit)
_KDMetronomeInit.init()

class KDMetronome {
    constructor(toggleID, parentID) {

        // UTILITY

        const _utility = {

            createUUID: _ => {
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
            },

            animateCSS: (element, animationName, callback) => {
                const node = document.querySelector('#' + element)
                node.classList.add('animated', animationName)

                const handleAnimationEnd = _ => {
                    node.classList.remove('animated', animationName)
                    node.removeEventListener('animationend', handleAnimationEnd)
                    if (typeof callback === 'function') callback()
                }

                node.addEventListener('animationend', handleAnimationEnd)
            },

            clip: (value, min, max) => Math.min(Math.max(min, value), max),

            makeDraggable: element => {
                const pos = [0, 0, 0, 0]

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
                        top = _utility.clip(top, -height + inner.clientHeight, height)
                        left = _utility.clip(left, 0, width - inner.clientWidth)

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
            },

        }

        // PUBLIC PROPERTIES

        const _props = {
            uuid: _utility.createUUID(),

            domIDs: {},

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
                hz: {
                    min: 20,
                    max: 20500,
                },
            },

            defaults: {
                volume: 50,
                volumeScale: 1.6,
                bpm: 72,
                frequency: 600,
                callback: _ => {
                    this.triggerSynth()
                    _private.startButtonVisualFeedback()
                },
            },

            callback: _ => _props.defaults.callback(),
        }

        _props.domIDs = {
            parentContainer: parentID ? parentID : 'kdmetronome--body',
            toggle: typeof toggleID === 'object' ? null : toggleID,
            container: 'kdmetronome--outer-' + _props.uuid, // outer metronome container div that will be animated on and off screen
            inner: 'kdmetronome--inner-' + _props.uuid, // inner container that will actually hold UI elements
            startButton: 'kdmetronome--startbutton-' + _props.uuid,
            bpmWidget: 'kdmetronome--bpmwidget-' + _props.uuid,
            volWidget: 'kdmetronome--volwidget-' + _props.uuid,
        }

        const _state = {
            ready: false,
            bpm: _props.defaults.bpm,
            volume: _props.defaults.volume,
            frequency: _props.defaults.frequency,
            headless: false,
            ticks: 0,
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

        let _public = {

            callback: callback => {
                if (typeof callback === 'function') _props.callback = callback
                else if (callback === 'default') _props.callback = _ => _props.defaults.callback()
            },

            setOptions: options => {
                if (options.toggleID) _props.domIDs.toggle = options.toggleID
                if (options.headless) this.headless(options.headless)
                if (options.bpm) this.bpm(options.bpm)
                if (options.volume) this.volume(options.volume)
                if (options.frequency) this.frequency(options.frequency)
            },

            start: _ => {
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

                const onTick = _ => {
                    _state.ticks++
                    _props.callback()
                }

                const seconds = 60 / _state.bpm
                _controllers.event = _controllers.clock.callbackAtTime(onTick, seconds).repeat(seconds)
            },

            stop: _ => {
                _controllers.clock.stop()
                _controllers.event.clear()
                _controllers.context.close()
                _controllers.event = null
                _controllers.clock = null
                _controllers.context = null
                _state.ticks = 0

                const startButton = document.getElementById(_props.domIDs.startButton)
                if (startButton) {
                    startButton.classList.remove('noTransition') // ensure normal button interactions are affected by animation transitions
                    startButton.style.backgroundColor = _props.styles.black
                    startButton.style.opacity = 1
                    startButton.innerHTML = 'off'
                }
            },

            hide: _ => {
                const elem = document.getElementById(_props.domIDs.container)
                if (elem) _utility.animateCSS(_props.domIDs.container, 'bounceOutLeft', _ => elem.style.display = 'none')
                else console.log('N/A: headless mode')
            },

            show: _ => {
                const elem = document.getElementById(_props.domIDs.container)
                if (elem) {
                    elem.style.display = 'flex'
                    _utility.animateCSS(_props.domIDs.container, 'bounceInLeft')
                } else console.log('N/A: headless mode')
            },

            running: _ => _controllers.event ? true : false,

            bpm: bpm => {
                if (typeof bpm === 'number' && _state.bpm != bpm) _views.bpmWidget.value = _utility.clip(bpm, _props.bounds.bpm.min, _props.bounds.bpm.max)
                return _state.bpm
            },

            volume: volume => {
                if (typeof volume === 'number' && _state.volume != volume) _views.volumeWidget.value = _utility.clip(volume, _props.bounds.volume.min, _props.bounds.volume.max)
                return _state.volume
            },

            frequency: hz => {
                if (typeof hz === 'number') _state.frequency = _utility.clip(hz, _props.bounds.hz.min, _props.bounds.hz.max)
                return _state.frequency
            },

            hidden: _ => {
                const elem = document.getElementById(_props.domIDs.container)
                return elem ? (elem.style.display == 'none' ? true : false) : null
            },

            headless: headless => {
                if (typeof headless === 'boolean') {
                    _state.headless = headless
                    const elem = document.getElementById(_props.domIDs.container)
                    if (elem) elem.parentNode.removeChild(elem)
                }
                return _state.headless
            },

            triggerSynth: _ => _views.synth.triggerAttackRelease(_state.frequency, '8n'),

            ticks: _ => _state.ticks,

            state: _ => _state,

            props: _ => _props,

            views: _ => _views,

            controllers: _ => _controllers,

            ready: callback => {
                if (typeof callback === 'function') {
                    if (_state.ready) callback()
                    else {
                        let timeoutCounter = 0
                        setTimeout(_ => {
                            if (timeoutCounter < 2000) {
                                timeoutCounter++
                                this.ready(callback)
                            } else console.log('Unable to create metronome.')
                        }, 100)
                    }
                }
                return _state.ready
            },

        }

        // PRIVATE METHODS

        const _private = {

            readyCheck: _ => {
                if (_KDMetronomeInit.state.ready) {
                    _private.createMetronome()
                    _state.ready = true
                } else {
                    let timeoutCounter = 0
                    setTimeout(_ => {
                        if (timeoutCounter < 2000) {
                            timeoutCounter++
                            _private.readyCheck()
                        } else console.log('Unable to create metronome.')
                    }, 100)
                }
            },

            startButtonVisualFeedback: _ => {
                const startButton = document.getElementById(_props.domIDs.startButton)
                if (startButton) startButton.style.opacity < 1 ? startButton.style.opacity = 1 : startButton.style.opacity = 0.7
            },

            createMetronome: _ => {

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

                    _views.synth.volume.value = Tone.gainToDb((_state.volume * _props.defaults.volumeScale) / 100)
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
                            if (this.running()) this.stop()
                            if (_state.bpm != value) _state.bpm = value
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
                            if (_state.volume != value) {
                                _state.volume = value
                                _views.synth.volume.value = Tone.gainToDb((_state.volume * _props.defaults.volumeScale) / 100)
                            }
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

                if (typeof toggleID === 'object') this.setOptions(toggleID)

                if (document.getElementById(_props.domIDs.container)) {
                    document.getElementById(_props.domIDs.container).style.display = 'none' // prepare container for this.hidden() check
                    document.getElementById(_props.domIDs.startButton).style.opacity = 1 // prepare start button for opacity check
                    /* Bind show/hide to the provided toggle element if available. */
                    if (_props.domIDs.toggle) document.getElementById(_props.domIDs.toggle).addEventListener("click", e => this.hidden() ? this.show() : this.hide())
                    /* Bind start button action */
                    document.getElementById(_props.domIDs.startButton).addEventListener("click", e => _controllers.event ? this.stop() : this.start())
                    /* make the container draggable */
                    _utility.makeDraggable(document.getElementById(_props.domIDs.container))
                }

            },

            generateAPI: _ => {
                Object.keys(_public).forEach(method => this[method] = _public[method])
                _public = null
            },

            load: _ => {

                const createDomElements = (_ => {

                    const createOuterContainer = (_ => {
                        const div = document.createElement("div");
                        const parent = _props.domIDs.parentContainer === 'kdmetronome--body' ? document.body : document.getElementById(_props.domIDs.parentContainer)
                        div.id = _props.domIDs.container
                        parent.appendChild(div)
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

                _private.generateAPI()
                _private.readyCheck()
            },

        }
        _private.load()

    }

}