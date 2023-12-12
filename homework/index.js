const sliderMinX = 0
const sliderMaxX = 240

const coldGradient = {start: '#5564C2', end: '#3A2E8D'}
const hotGradient = {start:'#F0AE4B', end: '#9B4D1B'}

new Vue({
  el: '#app',
  data: {
    dragging: false,
    initialMouseX: 0,
    sliderX: 0,
    initialSliderX: 0,
    temperatureGrades: [35, 36.6, 38, 40, 42],
    gradientStart: coldGradient.start,
    gradientEnd: coldGradient.end,
    temperatureMessage: ''
  },
  filters: {
    round (num) {
      return Math.round(num)
    }
  },
  methods: {
    startDrag (e) {
      this.dragging = true
      this.initialMouseX = e.pageX
      this.initialSliderX = this.sliderX
    },
    stopDrag () {
      this.dragging = false
    },
    mouseMoving(e) {
        if (this.dragging) {
          const dragAmount = e.pageX - this.initialMouseX;
          const targetX = this.initialSliderX + dragAmount;
      
          // keep slider inside limits
          this.sliderX = Math.max(Math.min(targetX, sliderMaxX), sliderMinX);
      
          // set bg color based on temperature
          if (this.currentTemperature < 35) {
            // Minimum temperature background color: #98a832
            this.gradientStart = '#98a832';
            this.gradientEnd = '#98a832';
          } else if (this.currentTemperature < 37) {
            // Gradient from #98a832 to #a88f32
            const normalizedTemp = (this.currentTemperature - 35) / (37 - 35);
            const blendedColor = blendColors('#98a832', '#a88f32', normalizedTemp);
            this.gradientStart = blendedColor;
            this.gradientEnd = blendedColor;
          } else if (this.currentTemperature < 38) {
            // Gradient from #a88f32 to #a87932
            const normalizedTemp = (this.currentTemperature - 37) / (38 - 37);
            const blendedColor = blendColors('#a88f32', '#a87932', normalizedTemp);
            this.gradientStart = blendedColor;
            this.gradientEnd = blendedColor;
          } else if (this.currentTemperature <= 42) {
            // Gradient from #a87932 to #a83e32
            const normalizedTemp = (this.currentTemperature - 38) / (42 - 38);
            const blendedColor = blendColors('#a87932', '#a83e32', normalizedTemp);
            this.gradientStart = blendedColor;
            this.gradientEnd = blendedColor;
          }
        }
        if (this.currentTemperature < 36) {
            this.temperatureMessage = 'Your temperature is low. Please heat your body or eat something.';
          } else if (this.currentTemperature < 37) {
            this.temperatureMessage = 'Your body is in normal temperature.';
          } else if (this.currentTemperature < 40) {
            this.temperatureMessage = 'You have a little warmth.';
          } else if (this.currentTemperature < 42) {
            this.temperatureMessage = 'You have very high heat. Call an ambulance.';
          } else {
            // handle temperatures above 40 if needed
            this.temperatureMessage = ''; // clear the message for temperatures above 40
          }
      }
      
      ,
    tempElementStyle (tempNumber) {
      const nearDistance = 3
      const liftDistance = 12
      
      // lifts up the element when the current temperature is near it
      const diff = Math.abs(this.currentTemperature - tempNumber)
      const distY = (diff/nearDistance) - 1
      
      // constrain the distance so that the element doesn't go to the bottom
      const elementY = Math.min(distY*liftDistance, 0)
      return `transform: translate3d(0, ${elementY}px, 0)`
    }
  },
  computed: {
    currentTemperature () {
      const tempRangeStart = 35
      const tempRange = 7 // from 10 - 30
      return (this.sliderX / sliderMaxX * tempRange ) + tempRangeStart
    },
    sliderStyle () {
      return `transform: translate3d(${this.sliderX}px,0,0)`
    },
    bgStyle () {
      return `background: linear-gradient(to bottom right, ${this.gradientStart}, ${this.gradientEnd});`
    }
  }
})


function blendColors(color1, color2, ratio) {
    const hex = (x) => {
      const hexString = x.toString(16)
      return hexString.length === 1 ? '0' + hexString : hexString
    }
  
    const r = Math.ceil(
      parseInt(color1.substring(1, 3), 16) * (1 - ratio) +
        parseInt(color2.substring(1, 3), 16) * ratio
    )
    const g = Math.ceil(
      parseInt(color1.substring(3, 5), 16) * (1 - ratio) +
        parseInt(color2.substring(3, 5), 16) * ratio
    )
    const b = Math.ceil(
      parseInt(color1.substring(5, 7), 16) * (1 - ratio) +
        parseInt(color2.substring(5, 7), 16) * ratio
    )
  
    return `#${hex(r)}${hex(g)}${hex(b)}`
  }
  