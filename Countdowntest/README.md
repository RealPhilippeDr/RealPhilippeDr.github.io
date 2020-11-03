# Countdown Timer
Advanced countdown timer that can be used in web pages build with vanilla JavaScript. This project is in alpha stage we need to hard code the values for the timer to run. In future updates dynamic timer functionality will be added.

Check out the [working demo page](http://raajnadar.github.io/countdown-timer)

## Usage
Follow the two steps given below so that the script runs properly.

#### 1) First step - HTML mark-up

> You need to hardcode the values initally this will be improved in future updates.

```html
<div class="card ct--container-main">
    <div id="ct--result">
        <div class="ct--day-container">
            <div id="ct--day">01</div>
            <div>Days</div>
        </div>
        <div class="ct--hour-container">
            <div id="ct--hour">00</div>
            <div>Hours</div>
        </div>
        <div class="ct--min-container">
            <div id="ct--min">00</div>
            <div>Minutes</div>
        </div>
        <div class="ct--sec-container">
            <div id="ct--sec">11</div>
            <div>Seconds</div>
        </div>
    </div>
    <div id="ct--stop"><p></p></div>
</div>
```

#### 2) Second step -  Import the styles and scripts

```
<link rel="stylesheet" href="css/timer.css">
```

Download the style-sheet file `css/timer.css` from this repository
```
<script type="text/javascript" src="js/timer.js"></script>
```
Download the script file `js/timer.js` from this repository and paste the above code snippet before closing body tag.

> All done! Now the countdown timer is ready to tick...

## Features  
* Build with flex-box (Responsive works on all screen size)
* Start / Stop / Pause button
* Stop with smooth animation
* Live updater

## To-do list
* Dynamic timer value
* Dynamic value calculator

## Bug Report
Found any bug in this project? It would be great if you raise an issue on GitHub or you can contribute to this repository.

## Author
Project Lead - [Rajendran Nadar](https://facebook.com/raajnadar)

## License 
MIT
