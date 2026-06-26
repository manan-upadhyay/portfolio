# Web Audio API Deep Dive — Your `sound.js` Explained

This guide will take you from zero audio knowledge to being able to intentionally tweak every parameter in your [sound.js](file:///Users/mananupadhyay/Desktop/Projects/React/3d-portfolio/src/lib/sound.js). We'll start with physics, build up the vocabulary, then do a line-by-line breakdown of the hero bed.

---

## Part 1: What Is Sound, Physically?

Sound is **air vibrating back and forth**. A speaker cone pushes air forward, then pulls back — that's one **cycle**. How many cycles happen per second is the **frequency**, measured in **Hertz (Hz)**.

| Frequency | What it sounds like | Example |
|-----------|-------------------|---------|
| 20–80 Hz | Deep rumble, sub-bass | Earthquake, bass drop |
| 80–250 Hz | Low warmth, bass | Male voice fundamental |
| 250–2000 Hz | Body, midrange | Guitar, speech clarity |
| 2000–6000 Hz | Presence, brightness | Cymbal attack, "s" sounds |
| 6000–20000 Hz | Air, sparkle, sizzle | Hi-hat shimmer |

> [!TIP]
> **Doubling a frequency raises pitch by one octave.** 440 Hz is the note A4. 880 Hz is A5 (one octave higher). 220 Hz is A3 (one octave lower). This is why musical pitch is *logarithmic* — equal *ratios* sound like equal steps.

**Amplitude** is how far the air pushes — it's **loudness**. In Web Audio, amplitude is a number from `0` (silence) to `1` (full scale). Values above `1` clip and distort.

---

## Part 2: The AudioContext — Your Virtual Studio

```
┌─────────────────── AudioContext ───────────────────┐
│                                                     │
│  [Oscillator] ──→ [Filter] ──→ [Gain] ──→          │
│                                          ↓          │
│                                     [Master Gain]   │
│                                          ↓          │
│                                     [Compressor]    │
│                                          ↓          │
│                                     [Destination]   │ ← your speakers
│                                                     │
└─────────────────────────────────────────────────────┘
```

The `AudioContext` is a **virtual audio studio** that runs inside the browser. Everything in Web Audio is a **node** — a little processing box. You connect nodes together like audio cables:

```js
source.connect(filter).connect(gain).connect(destination)
```

This is called a **signal chain**. Audio flows left-to-right through each node.

### Your file's context setup: [Lines 63–90](file:///Users/mananupadhyay/Desktop/Projects/React/3d-portfolio/src/lib/sound.js#L63-L90)

```js
ctx = new AC();                    // Create the studio
master = ctx.createGain();         // Master volume knob
comp = ctx.createDynamicsCompressor(); // Safety limiter
master.connect(comp);              // Volume → Limiter
comp.connect(ctx.destination);     // Limiter → Speakers
```

**Every sound in the entire file** eventually flows into `master`, so one gain knob controls everything.

---

## Part 3: Oscillators — The Sound Sources

An **oscillator** is a node that generates a repeating waveform — a pure electronic tone. It has two key properties:

- **`frequency`** — pitch in Hz (how fast it vibrates)
- **`type`** — the *shape* of the wave (what it sounds like)

### The Four Waveform Types

````carousel
### `'sine'` — Pure, clean, smooth

```
     ╭──╮
    ╱    ╲
───╱──────╲──────╱──
             ╲  ╱
              ╰─╯
```

- **Sound**: A flute, a tuning fork, a pure whistle
- **Character**: No harmonics — just the fundamental frequency. Extremely clean and round
- **Use in your code**: Soft resolve tones, the shimmer in the arsenal drone, the "turn" LFO
- **When to use**: When you want something gentle, warm, or when modulating another parameter (LFOs)

---

### `'sawtooth'` — Bright, buzzy, rich

```
   ╱|   ╱|   ╱|
  ╱ |  ╱ |  ╱ |
 ╱  | ╱  | ╱  |
╱   |╱   |╱   |
```

- **Sound**: A synth brass, a buzzy string, an analog synth lead
- **Character**: Contains **all harmonics** (2nd, 3rd, 4th, etc.) — the richest waveform. Bright and aggressive
- **Use in your code**: The hero rumble oscillator (`rumble.type = 'sawtooth'`), the error buzz, the gear-click LFO
- **When to use**: When you want something that cuts through, or you plan to filter it down

---

### `'triangle'` — Soft, hollow, mellow

```
   ╱╲      ╱╲
  ╱  ╲    ╱  ╲
 ╱    ╲  ╱    ╲
╱      ╲╱      ╲
```

- **Sound**: A clarinet, a soft woodwind, a muted synth
- **Character**: Only **odd harmonics**, and they fall off fast — much softer than sawtooth
- **Use in your code**: Arsenal drone's second oscillator, the confirm chime, the glitch decode blips
- **When to use**: When you want warmth without brightness

---

### `'square'` — Hollow, video-game, reedy

```
 ┌──┐  ┌──┐  ┌──┐
 │  │  │  │  │  │
─┘  └──┘  └──┘  └──
```

- **Sound**: 8-bit video game, a hollow reed, a claviature
- **Character**: Only **odd harmonics** (like triangle) but they don't fall off as fast — more nasal and hollow
- **Use in your code**: Not used currently, but available
- **When to use**: For retro or digital-sounding effects
````

> [!IMPORTANT]
> **Harmonics** are multiples of the fundamental frequency. If your fundamental is 100 Hz, the 2nd harmonic is 200 Hz, the 3rd is 300 Hz, etc. More harmonics = brighter, buzzier sound. Fewer harmonics = smoother, duller sound. **This is why a sawtooth at 64 Hz sounds much more "textured" than a sine at 64 Hz** — the sawtooth contains dozens of frequencies above 64 Hz that add richness.

---

## Part 4: Filters — Sculpting the Sound

A **BiquadFilter** removes or emphasizes certain frequencies. Think of it as an EQ with surgical precision.

### Filter Types Used in Your Code

#### `'lowpass'` — Lets low frequencies through, cuts highs

```
Volume
  │█████████
  │         ╲
  │          ╲
  │           ╲___________
  └───────────────────────→ Frequency
         ↑
     cutoff frequency
```

- **What it does**: Everything below the cutoff passes through. Everything above gets quieter
- **In your code**: The rumble in the hero bed uses `lowpass` at 180 Hz — this takes the buzzy sawtooth and strips away all the brightness, leaving only the deep rumble
- **Analogy**: Like putting your hand over a speaker — you hear mostly bass

#### `'bandpass'` — Only lets a narrow band through

```
Volume
  │         ╱█╲
  │        ╱ █ ╲
  │       ╱  █  ╲
  │______╱   █   ╲_______
  └───────────────────────→ Frequency
             ↑
        center frequency
```

- **What it does**: Picks out ONE frequency region and kills everything above and below
- **In your code**: The gear-tooth clicks use bandpass at 2200 Hz and 1150 Hz — this takes raw noise and extracts only those specific metallic resonances
- **Analogy**: Like cupping your hands over your ears and humming — you hear one narrow pitch

#### `'highpass'` — Lets high frequencies through, cuts lows

- Opposite of lowpass. Not used directly in your hero bed, but good to know

### The `Q` Parameter (Quality Factor)

**Q controls how *sharp* the filter is.**

| Q Value | Behavior | Sound |
|---------|----------|-------|
| 0.5–1 | Gentle slope | Subtle, natural shaping |
| 2–5 | Moderate | Noticeable "poke" at the frequency |
| 7–15 | Sharp, resonant | Metallic, ringy, laser-like |
| 20+ | Extreme | Self-oscillating, like a tuning fork |

**In your hero bed code:**
- `rumLp.Q.value = 0.5` → very gentle lowpass, natural-sounding warmth
- `bp.Q.value = 9` → sharp bandpass, creating a distinct metallic **ping** at 2200 Hz
- `bp2.Q.value = 7` → slightly less sharp, a second metallic resonance at 1150 Hz

> [!TIP]
> **For lowpass/highpass**, Q creates a "bump" right at the cutoff frequency before dropping off. High Q = more bump = more resonant "wah" character.
>
> **For bandpass**, Q controls the *width* of the band. High Q = narrow band = more "pitched" / ringy. Low Q = wide band = more natural / breathy.

---

## Part 5: Gain Nodes — Volume Control

A `GainNode` is simply a **volume knob**. Its `gain.value` multiplies the signal:

| Value | Effect |
|-------|--------|
| `0` | Silence |
| `0.0001` | Effectively silent (used instead of 0 because `exponentialRampToValueAtTime` can't go to exactly 0) |
| `0.1–0.3` | Quiet |
| `0.5` | Half volume |
| `1.0` | Full volume (no change) |
| `> 1.0` | Amplification (louder, risk of clipping) |

> [!NOTE]
> Why `0.0001` instead of `0`? The Web Audio function `exponentialRampToValueAtTime()` mathematically cannot ramp to zero (you can't exponentially approach zero — it's an asymptote). So `0.0001` is "close enough to silent" that you can't hear it, but the math still works.

### Gain Scheduling — Envelopes

Instead of just setting a volume, you can **schedule** changes over time:

```js
g.gain.setValueAtTime(0.0001, t0);                          // Start silent
g.gain.exponentialRampToValueAtTime(peak, t0 + attack);      // Fade IN to peak
g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);       // Fade OUT to silent
```

This creates an **envelope** — the loudness shape over time:

```
Volume
  │      ╱╲
  │     ╱  ╲
  │    ╱    ╲
  │   ╱      ╲
  │  ╱        ╲
  │ ╱          ╲______
  └────────────────────→ Time
     ↑     ↑        ↑
   start  peak    end
   attack  ← decay →
```

Your [blip() helper](file:///Users/mananupadhyay/Desktop/Projects/React/3d-portfolio/src/lib/sound.js#L103-L117) creates exactly this shape. The `attack` parameter controls how fast the sound reaches peak volume (shorter = snappier, like a click; longer = softer fade-in).

### `setTargetAtTime()` — Smooth Exponential Glide

```js
g.gain.setTargetAtTime(targetValue, startTime, timeConstant);
```

This smoothly glides toward a target value. The **time constant** (3rd parameter) is how long it takes to get ~63% of the way there. Used in your beds for smooth fades:

```js
// Line 265: setTargetAtTime(level * peak, now(), 0.3)
// "Glide to this level over ~0.3 seconds" — prevents abrupt jumps
```

---

## Part 6: White Noise — The Raw Material

### What is white noise? [Lines 84–87](file:///Users/mananupadhyay/Desktop/Projects/React/3d-portfolio/src/lib/sound.js#L84-L87)

```js
const len = ctx.sampleRate * 2;                    // 2 seconds of audio
noise = ctx.createBuffer(1, len, ctx.sampleRate);  // 1 channel, `len` samples
const data = noise.getChannelData(0);              // Raw sample array
for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;  // Random values -1 to +1
```

White noise is **every frequency playing simultaneously at equal volume** — like TV static or a waterfall. Each sample is a random number between -1 and +1.

**Why is it useful?** Because you can then **filter it** to extract any frequency range you want:

- Lowpass filter on noise → wind, ocean, rumble
- Bandpass filter on noise → metallic ping, resonant click, specific "color"
- Highpass filter on noise → hiss, sparkle, air

**Your hero bed uses noise filtered through two bandpass filters to create "gear tooth clicks"** — extracting metallic-sounding resonances from raw static.

---

## Part 7: LFOs — Making Things Move

An **LFO (Low-Frequency Oscillator)** is an oscillator that's too slow to hear as a pitch. Instead of making sound, it **modulates (wiggles) another parameter** over time.

```
Think of it like this:
- A regular oscillator at 440 Hz → you hear a note
- An LFO at 0.5 Hz → you DON'T hear it, but it wiggles something
  else (volume, filter cutoff, etc.) once every 2 seconds
```

### LFO in the hero bed — the "turn" tremolo: [Lines 338–340](file:///Users/mananupadhyay/Desktop/Projects/React/3d-portfolio/src/lib/sound.js#L338-L340)

```js
const turn = ctx.createOscillator();
turn.type = 'sine';
turn.frequency.value = 0.5;        // 0.5 Hz = one cycle every 2 seconds
const turnAmt = ctx.createGain();
turnAmt.gain.value = 0.07;         // Only wiggle by ±0.07
turn.connect(turnAmt).connect(rumG.gain);  // Wiggle the rumble's volume
```

What's happening:
1. `turn` generates a sine wave at 0.5 Hz (one smooth cycle every 2 seconds)
2. `turnAmt` scales it down to ±0.07 (so the wiggle is subtle)
3. This wiggle is connected to `rumG.gain` (the rumble's volume)

**Result**: The rumble gets slightly louder, then slightly quieter, then louder... in a smooth 2-second cycle. It sounds like a big gear **slowly turning** — the volume swells as a tooth passes, then dips.

### LFO for gear clicks: [Lines 348–350](file:///Users/mananupadhyay/Desktop/Projects/React/3d-portfolio/src/lib/sound.js#L348-L350)

```js
const lfo = ctx.createOscillator();
lfo.type = 'sawtooth';
lfo.frequency.value = 1.6;         // 1.6 Hz = ~1.6 clicks per second
const lfoAmt = ctx.createGain();
lfoAmt.gain.value = -0.18;         // NEGATIVE = inverted
lfo.connect(lfoAmt).connect(gate.gain);
```

A **sawtooth** LFO looks like this:

```
Normal sawtooth:        Inverted (negative gain):
   ╱|   ╱|                |╲   |╲
  ╱ |  ╱ |                | ╲  | ╲
 ╱  | ╱  |                |  ╲ |  ╲
╱   |╱   |                |   ╲|   ╲
```

The **inverted sawtooth** creates a sharp spike followed by a fast decay — exactly like a mechanical **click**. It slams the gate open, then quickly closes it. At 1.6 Hz, that's about 1.6 clicks per second.

> [!IMPORTANT]
> **The negative gain value is the key trick here.** `lfoAmt.gain.value = -0.18` inverts the sawtooth, turning a gradual rise into a sharp fall. This is what creates the "tick...tick...tick" quality instead of a "whoooosh...whoooosh" swell.

---

## Part 8: The DynamicsCompressor — Safety Net

[Lines 73–78](file:///Users/mananupadhyay/Desktop/Projects/React/3d-portfolio/src/lib/sound.js#L73-L78):

```js
comp = ctx.createDynamicsCompressor();
comp.threshold.value = -10;   // Start compressing when signal exceeds -10 dB
comp.knee.value = 24;         // Soft transition into compression (gentle)
comp.ratio.value = 12;        // For every 12 dB over threshold, only let 1 dB through
comp.attack.value = 0.003;    // React in 3ms (fast catch)
comp.release.value = 0.25;    // Release over 250ms (smooth recovery)
```

A compressor is a **safety limiter** — it prevents overlapping sounds from getting painfully loud. When multiple cues play at once, the total volume could spike. The compressor catches those spikes and squashes them down.

| Parameter | What it does | Your value | Effect |
|-----------|-------------|-----------|--------|
| threshold | Volume level where compression kicks in | -10 dB | Fairly aggressive — catches most peaks |
| knee | How gradually compression engages | 24 dB | Very soft transition — sounds natural |
| ratio | How much to squash (12:1 means heavy) | 12:1 | Strong limiting — nearly a brick wall |
| attack | How fast it reacts | 3 ms | Very fast — catches transient clicks |
| release | How fast it lets go | 250 ms | Smooth release — no pumping artifacts |

---

## Part 9: The `blip()` and `swoosh()` Helpers

These are the two building blocks that every cue in the file is made from.

### [blip()](file:///Users/mananupadhyay/Desktop/Projects/React/3d-portfolio/src/lib/sound.js#L103-L117) — A pitched tone with an envelope

```
[Oscillator] ──→ [Gain (envelope)] ──→ [destination]
     │
     └── optional frequency glide (glideTo)
```

Parameters you can tweak:
- **`freq`**: Starting pitch in Hz
- **`type`**: Waveform (`'sine'`, `'sawtooth'`, `'triangle'`, `'square'`)
- **`dur`**: Total duration in seconds
- **`peak`**: Maximum loudness (0–1)
- **`attack`**: How fast it reaches peak (seconds). 0.001 = instant snap. 0.05 = soft fade
- **`glideTo`**: If set, the pitch slides to this frequency over the duration
- **`detune`**: Shifts pitch by cents (100 cents = 1 semitone). Used for subtle detuning effects

### [swoosh()](file:///Users/mananupadhyay/Desktop/Projects/React/3d-portfolio/src/lib/sound.js#L120-L136) — A filtered noise burst

```
[Noise Buffer] ──→ [BiquadFilter] ──→ [Gain (envelope)] ──→ [destination]
                        │
                        └── frequency sweeps from `from` to `to`
```

Parameters:
- **`dur`**: Length of the whoosh
- **`peak`**: Maximum loudness
- **`type`**: Filter type (`'bandpass'`, `'lowpass'`, `'highpass'`)
- **`from`** / **`to`**: The filter frequency sweeps between these. `from: 1600, to: 400` = a downward sweep (falling pitch). `from: 260, to: 1500` = an upward sweep (rising)
- **`q`**: Filter sharpness (see Part 4)

---

## Part 10: The `makeBed()` System — [Lines 241–291](file:///Users/mananupadhyay/Desktop/Projects/React/3d-portfolio/src/lib/sound.js#L241-L291)

A "bed" is a **continuous ambient sound** that loops as long as a section is visible. `makeBed()` is a factory function that manages the lifecycle:

```
                    ┌─── Has mp3 sample? ──→ Play looping mp3
    setLevel(0.8) ──┤
                    └─── No sample?       ──→ Run synth build() function
```

Key concepts:
- **`level`** (0–1): Controlled by scroll position. As you scroll toward the Hero section, level increases; as you scroll away, it decreases
- **`peak`**: Maximum volume cap from CONFIG (e.g., `0.5` for hero)
- **`wanted`**: Whether the bed should be playing at all
- **Lazy construction**: Nodes are only created when actually needed (`ensure()`)
- **Clean teardown**: When `level` drops to ~0, everything is disconnected to save CPU

The actual volume at any moment is `level × peak`. So if you're scrolled 60% toward the Hero and peak is 0.5, the bed plays at `0.6 × 0.5 = 0.3`.

---

## Part 11: 🎯 THE HERO BED — Line-by-Line Breakdown

[Lines 328–368](file:///Users/mananupadhyay/Desktop/Projects/React/3d-portfolio/src/lib/sound.js#L328-L368) — This is the synthesized "astrolabe gear" sound. Here's the full signal flow:

```
┌─────────────────────────── HERO BED ───────────────────────────────┐
│                                                                     │
│   LAYER 1: ROTATIONAL RUMBLE                                        │
│   ┌──────────┐    ┌──────────┐    ┌──────────┐                      │
│   │ Sawtooth │──→ │ Lowpass  │──→ │ Gain     │──→─┐                 │
│   │ 64 Hz    │    │ 180 Hz   │    │ 0.16     │    │                 │
│   └──────────┘    │ Q=0.5    │    └────▲─────┘    │                 │
│                   └──────────┘         │          │                 │
│                              ┌─────────┘          │                 │
│                    ┌─────────┴────┐               │                 │
│                    │ Sine LFO     │               │                 │
│                    │ 0.5 Hz       │               │   ┌──────────┐  │
│                    │ amt: ±0.07   │               ├──→│ Master   │  │
│                    └──────────────┘               │   │ Gain     │──┤──→ master
│                                                   │   │ (0.0001) │  │
│   LAYER 2: GEAR-TOOTH CLICKS                      │   └──────────┘  │
│   ┌──────────┐    ┌──────────┐                    │                 │
│   │ White    │──→ │ Bandpass │──→─┐               │                 │
│   │ Noise    │    │ 2200 Hz  │    │ ┌──────────┐  │                 │
│   │ (loop)   │    │ Q=9      │    ├→│ Gate     │──┘                 │
│   │          │    └──────────┘    │ │ Gain     │                    │
│   │          │    ┌──────────┐    │ │ 0.18     │                    │
│   │          │──→ │ Bandpass │──→─┘ └────▲─────┘                    │
│   └──────────┘    │ 1150 Hz  │          │                           │
│                   │ Q=7      │  ┌───────┴────────┐                  │
│                   └──────────┘  │ Sawtooth LFO   │                  │
│                                 │ 1.6 Hz         │                  │
│                                 │ amt: -0.18     │                  │
│                                 │ (inverted)     │                  │
│                                 └────────────────┘                  │
└─────────────────────────────────────────────────────────────────────┘
```

### Line-by-Line:

#### The output gain (line 332)
```js
const g = ctx.createGain(); g.gain.value = 0.0001;
```
This is the **master volume** for the entire hero bed. Starts silent. The `makeBed()` system will smoothly ramp it up/down based on scroll position.

---

#### LAYER 1: Rotational Rumble (lines 335–341)

```js
// Line 335: The rumble source
const rumble = ctx.createOscillator();
rumble.type = 'sawtooth';         // Rich in harmonics → gives the filter material to work with
rumble.frequency.value = 64;      // ~C2 — a low bass note, just above the threshold of "feeling" vs "hearing"
```
**Why sawtooth at 64 Hz?** A sawtooth contains ALL harmonics (128 Hz, 192 Hz, 256 Hz...). The lowpass filter will then carve away the upper ones, leaving a thick, rumbly bass. If you used `'sine'` here, the lowpass would have almost nothing to filter — it'd just be a clean hum.

> **Tweak**: Change `64` to `48` for deeper rumble, `80` for higher/more audible. Change to `'triangle'` for softer character.

```js
// Line 336: The lowpass filter that shapes the rumble
const rumLp = ctx.createBiquadFilter();
rumLp.type = 'lowpass';
rumLp.frequency.value = 180;      // Only let frequencies below 180 Hz pass
rumLp.Q.value = 0.5;              // Very gentle slope — no resonant bump
```
**Why 180 Hz?** The sawtooth at 64 Hz has harmonics at 128, 192, 256, 320... The filter at 180 Hz means: the fundamental (64) passes fully, the 2nd harmonic (128) passes mostly, the 3rd (192) is cut, and everything above is gone. **Result: a warm, low rumble without any brightness.**

> **Tweak**: Raise to `300` → brighter, buzzier rumble. Lower to `100` → deeper, more subby, almost inaudible on small speakers. Raise Q to `3` → adds a resonant "wuh" character at the cutoff.

```js
// Line 337: Volume control for just the rumble layer
const rumG = ctx.createGain();
rumG.gain.value = 0.16;           // Quiet — this is an ambient background texture
```
> **Tweak**: `0.25` → louder rumble. `0.08` → barely there.

```js
// Lines 338–340: The "turn" LFO — makes the rumble pulse slowly
const turn = ctx.createOscillator();
turn.type = 'sine';               // Smooth wobble
turn.frequency.value = 0.5;       // One full cycle every 2 seconds
const turnAmt = ctx.createGain();
turnAmt.gain.value = 0.07;        // Wiggles rumG.gain by ±0.07
turn.connect(turnAmt).connect(rumG.gain);
```
The rumble volume is nominally `0.16`. The LFO adds/subtracts `0.07`, so the volume undulates between `0.09` and `0.23` in a smooth 2-second cycle. This creates the sensation of a **big gear slowly rotating**.

> **Tweak**: `frequency: 0.2` → slower, lazier turn. `frequency: 1.0` → faster, more nervous. `turnAmt.gain.value = 0.15` → more dramatic volume swell. `0.02` → barely perceptible movement.

```js
// Line 341: Wire it up
rumble.connect(rumLp).connect(rumG).connect(g);
// Sawtooth → Lowpass → Volume → Master Gain
```

---

#### LAYER 2: Gear-Tooth Clicks (lines 344–353)

```js
// Line 344: Noise source
const src = ctx.createBufferSource();
src.buffer = noise;               // The pre-built white noise buffer
src.loop = true;                  // Loop forever (it's a continuous bed)
```

```js
// Line 345: First bandpass filter — extracts a high metallic "ping"
const bp = ctx.createBiquadFilter();
bp.type = 'bandpass';
bp.frequency.value = 2200;        // Center frequency: 2200 Hz (bright, metallic, "tink")
bp.Q.value = 9;                   // Very narrow band → strongly pitched, ringy
```
This takes the noise (which contains ALL frequencies) and extracts a very narrow slice around 2200 Hz. With Q=9, this sounds like a metallic **tink** or **ping** — almost like tapping a thin piece of metal.

> **Tweak**: `2200` → `3500` for thinner, more "ticky" sound. `1000` for a more hollow, woody tick. Q of `4` → wider, more "shh"-like. Q of `15` → extremely pitched, almost a pure tone.

```js
// Line 346: Second bandpass filter — a lower metallic resonance
const bp2 = ctx.createBiquadFilter();
bp2.type = 'bandpass';
bp2.frequency.value = 1150;       // Lower: 1150 Hz (adds body to the click)
bp2.Q.value = 7;                  // Slightly wider than bp
```
Two resonances at different frequencies create a more **complex, realistic** click — like a real gear has multiple resonant modes when struck.

> **Tweak**: Remove `bp2` entirely for a simpler, thinner click. Change to `800` for a more "clunky" quality. Change to `3000` for more "sparkle."

```js
// Line 347: The gate that creates the rhythmic clicking
const gate = ctx.createGain();
gate.gain.value = 0.18;           // Base level — how loud the clicks are
```

```js
// Lines 348–350: The click rhythm LFO
const lfo = ctx.createOscillator();
lfo.type = 'sawtooth';            // Sharp transitions (see Part 7 above)
lfo.frequency.value = 1.6;        // 1.6 clicks per second
const lfoAmt = ctx.createGain();
lfoAmt.gain.value = -0.18;        // INVERTED → creates sharp attack + fast decay
lfo.connect(lfoAmt).connect(gate.gain);
```
The sawtooth goes from -1 to +1 linearly, then snaps back to -1. Multiplied by -0.18, it goes from +0.18 to -0.18. Added to the gate's base of 0.18:
- **Peak**: 0.18 + 0.18 = **0.36** (loud click at the snap)
- **Valley**: 0.18 - 0.18 = **0.00** (silence between clicks)

So the noise rings for a brief instant at the snap, then decays to silence. At 1.6 Hz, that's a click roughly every 625ms.

> **Tweak**: `1.6` → `0.8` for slower, more deliberate ticking. `3.0` for faster, more clockwork-like. `lfoAmt: -0.10` for subtler clicks that don't fully gate to silence. `gate.gain.value = 0.10` for quieter clicks overall.

```js
// Lines 351–353: Wire both filters into the gate
src.connect(bp).connect(gate);    // Noise → Bandpass 2200 → Gate
src.connect(bp2).connect(gate);   // Noise → Bandpass 1150 → Gate (mixed)
gate.connect(g);                  // Gate → Master Gain
```
Both filtered noise streams feed into the same gate, so both resonances click in unison.

---

#### Start everything (line 356)
```js
[rumble, turn, lfo].forEach((o) => o.start()); src.start();
```
All oscillators and the noise source begin playing simultaneously.

#### Teardown (lines 359–364)
```js
stop() {
  const t = now();
  g.gain.setTargetAtTime(0.0001, t, 0.2);   // Fade to silence over ~200ms
  try { src.stop(t + 0.6); } catch {}        // Stop noise after 600ms
  // Stop all oscillators after 600ms
  [rumble, turn, lfo].forEach((o) => { try { o.stop(t + 0.6); } catch {} });
  // Disconnect everything after 800ms (after all fades complete)
  setTimeout(() => { [...allNodes].forEach((n) => n.disconnect()); }, 800);
}
```
The 600ms delay after the 200ms fade ensures everything has faded to silence before nodes are stopped. The 800ms setTimeout ensures all nodes are cleaned up (disconnected) after everything has fully stopped.

---

## Part 12: Practical Tweaking Guide

Here's a recipe sheet for achieving different moods:

### Want a deeper, more cinematic rumble?
```js
rumble.frequency.value = 48;       // Lower pitch (was 64)
rumLp.frequency.value = 120;       // Tighter filter (was 180)
rumG.gain.value = 0.22;            // Louder (was 0.16)
turn.frequency.value = 0.25;       // Slower rotation (was 0.5)
turnAmt.gain.value = 0.12;         // More dramatic swell (was 0.07)
```

### Want softer, less mechanical clicks?
```js
bp.frequency.value = 1800;         // Lower, less harsh (was 2200)
bp.Q.value = 5;                    // Wider, softer (was 9)
bp2.Q.value = 4;                   // Wider (was 7)
gate.gain.value = 0.10;            // Quieter clicks (was 0.18)
lfo.frequency.value = 0.9;         // Slower ticking (was 1.6)
lfoAmt.gain.value = -0.09;         // Less sharp gating (was -0.18)
```

### Want to remove clicks entirely (just rumble)?
Remove or comment out lines 344–353 and line 352's connection, keeping only the rumble layer. Or set `gate.gain.value = 0`.

### Want a warmer, pad-like drone instead of a gear?
```js
rumble.type = 'triangle';          // Softer waveform (was 'sawtooth')
rumble.frequency.value = 55;       // A1 note
rumLp.frequency.value = 400;       // Let more harmonics through
rumLp.Q.value = 2;                 // Slight resonant warmth
turn.frequency.value = 0.1;        // Very slow breathing
turnAmt.gain.value = 0.04;         // Subtle movement
// Set click gate to 0 or remove click layer
gate.gain.value = 0;
```

### Want an ethereal, spacey atmosphere?
```js
rumble.type = 'sine';              // Pure tone, no harmonics
rumble.frequency.value = 110;      // Higher, more audible
rumLp.frequency.value = 800;       // Let a lot through (sine has no harmonics anyway)
// Change clicks to "sparkle" — high, gentle resonances
bp.frequency.value = 4500;         // High sparkle
bp.Q.value = 12;                   // Very ringy
bp2.frequency.value = 6000;        // Higher sparkle
bp2.Q.value = 10;
lfo.frequency.value = 2.5;         // Faster, like gentle rain
lfoAmt.gain.value = -0.08;         // Softer gating
gate.gain.value = 0.06;            // Very quiet
```

---

## Quick Reference Card

| Concept | What it controls | Low value → | High value → |
|---------|-----------------|-------------|--------------|
| `frequency` (oscillator) | Pitch | Deep bass rumble | High pitch squeal |
| `type` (oscillator) | Tone quality | `sine` = clean | `sawtooth` = buzzy |
| `frequency` (filter) | What frequencies pass | Only bass survives | Everything passes |
| `Q` (filter) | Filter sharpness | Gentle slope | Resonant ring |
| `gain.value` | Volume | Silence | Loud |
| LFO `frequency` | Speed of modulation | Slow breathing | Fast tremolo/clicking |
| LFO amount (`gain`) | Depth of modulation | Barely moves | Dramatic swell |
| Negative LFO amount | Inverts the shape | — | Sharp attack, fast decay |

> [!TIP]
> **The best way to learn is to change one number at a time**, reload, and listen. Change the rumble frequency by ±20 Hz. Double the LFO speed. Halve the Q. Each tweak teaches you more than reading ever could. The signal flow diagram above is your map — trace each path to understand what feeds what.
