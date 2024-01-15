function submit() {
    let arrival = document.getElementById("arrival");
    let overtime = document.getElementById("overtime");
    let pausetime = document.getElementById("pauseValue");
    let worktime = document.getElementById("worktime");
    let tempTime, quitTime;

    if (arrival.value === "") {
        window.alert("Geben Sie eine Ankunftszeit an!");
        return;
    }

    if (parseInt(arrival.value.split(":")[0]) <= 5 || (parseInt(arrival.value.split(":")[0]) >= 10 && parseInt(arrival.value.split(":")[1]) >= 1)) {
        //console.log(parseInt(arrival.value.split(":")[1]));
        window.alert("Sie können nur zwischen 6Uhr und 10Uhr anfangen zuarbeiten!")
        return;
    }

    if (overtime.value === "") {
        tempTime = addMinutes(arrival.value, pausetime.value);
    } else {
        let overtimeString = parseInt(overtime.value.split(":")[0] * 60) + parseInt(overtime.value.split(":")[1]);
        tempTime = addMinutes(addMinutes(arrival.value, pausetime.value), overtimeString);
    }

    if (worktime.value === "") {
        window.alert("Ungültige Arbeitszeit!");
        return;
    } else {
        let worktimeString = parseInt(worktime.value.split(":")[0] * 60) + parseInt(worktime.value.split(":")[1]);
        quitTime = addMinutes(tempTime, worktimeString);
        document.getElementById("endtime").value = quitTime;
    }

    if (parseInt(quitTime.split(":")[0]) >= 20) {
        window.alert("Sie können nur bis ab 20 Uhr arbeiten!");
        return;
    }

    // console.log(quitTime);
    countdown(quitTime, arrival.value);
}

function addMinutes(time, minsToAdd) {
    function D(J) {
        return (J < 10 ? '0' : '') + J;
    }

    let piece = time.split(':');
    let mins = piece[0] * 60 + +piece[1] + +minsToAdd;

    return D(mins % (24 * 60) / 60 | 0) + ':' + D(mins % 60);
}

function countdown(pTime, pArrival) {
    const countDownDate = new Date("Jan 5, 2100 " + pTime + ":00").getTime();
    const arrival = new Date("Jan 5, 2100 " + pArrival + ":00").getTime();
    const distance1 = countDownDate - arrival;

    //console.log("Distance1: " + distance1);
    let hour = Math.floor((distance1 % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minute = Math.floor((distance1 % (1000 * 60 * 60)) / (1000 * 60));

    let end = hour * 60 + minute;

    //console.log("Minuten: " + end);

    let x = setInterval(function () {

        // Get today's date and time
        let now = new Date().getTime();

        // Find the distance between now and the countdown date
        let distance = countDownDate - now;

        //console.log("Distance: " + distance);

        // Time calculations for days, hours, minutes and seconds
        let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)); // WICHTIG!! (Bei Zeitumstellung hier -1)
        let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById("countdown").innerHTML = hours + "h " + minutes + "m " + seconds + "s ";

        // If the countdown is finished, write some text
        if ((hours * 60 + minutes) < 0) {
            clearInterval(x);
            document.getElementById("countdown").innerHTML = "FEIERABEND!";
            location.replace("./firework.html");
        }

        let pct = 100 - (100 * (hours * 60 + minutes) / end);

        //console.log(pct);
        document.getElementById("progressbar").innerHTML = pct.toFixed(0) + "%";
        document.getElementById("progressbar").style = "width: " + pct.toFixed(0) + "%";
    }, 1000);
}

function sliderChange() {
    document.getElementById("pauseValue").value = document.getElementById("pausetime").value;
}

function inputChange() {
    document.getElementById("pausetime").value = document.getElementById("pauseValue").value;
}
