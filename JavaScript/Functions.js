var Class, hour, min;
min = new Date().getMinutes();
hour = new Date().getHours();
if (hour == 9)
    Class = "First Hour";
else if (hour == 10)
    Class = "Second Hour";
else if (hour == 11)
    Class = "Third Hour";
else if (hour == 12 && min >= 45 || (hour == 13 && min <= 45))
    Class = "Fourth Hour";
else if ((hour == 13 && min >= 45) || (hour == 14 && min <= 45))
    Class = "Fifth Hour";
else if ((hour == 14 && min >= 45) || (hour == 15 && min <= 45))
    Class = "Fifth Hour";
else Class = "";

document.getElementById('schedule').value = Class;


// Function Display()

var str;

function display() {
    str = '';
    var str1 = '';
    var str2 = '';
    var count1 = 0;
    var count2 = 0;
    var subject;
    var present = document.getElementsByClassName('left');
    for (let one of present) {
        if (one.getAttribute("is-present") === 'true') {
            if (one.id.substring(0, 3) === '209') {
                str1 = str1 + one.id.substring(8, 10) + ', ';
                count1 += 1;
            }
            else {
                str1 = str1 + 'LE' + one.id.substring(8, 10) + ', ';
                count1 += 1;
            }
        }
        else if (one.getAttribute("is-present") === 'false') {
            if (one.id.substring(0, 3) === '209') {
                str2 = str2 + one.id.substring(8, 10) + ', ';
                count2 += 1;
            }
            else {
                str2 = str2 + 'LE' + one.id.substring(8, 10) + ', ';
                count2 += 1;
            }
        }
    }
    str1 = str1.slice(0, -2);
    str2 = str2.slice(0, -2);
    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    let currentDate = new Date().toLocaleDateString("en-US", options);
    str += document.getElementById('section').innerText + ' ( III year ) count \n';
    if (count1 == 1)
        str += "Presentees (" + count1 + "  Member)\n";
    else
        str += "Presentees (" + count1 + "  Members)\n";
    str += str1 + '\n';
    if (count2 == 1)
        str += "Absentees (" + count2 + "  Member)\n";
    else
        str += "Absentees (" + count2 + "  Members)\n";
    str += str2 + '\n';

    let select = document.getElementById("subject");
    subject = select.value;
    select.addEventListener('change', event => {
        subject = select.value;
    })
    if (subject == 'other') subject = document.getElementById('other').value;

    str += "in " + subject + " on " + currentDate + '\n';
    document.getElementById('display').value = str;

    //Display Border colour 
    if (count1 > count2)
        document.getElementById('display').style.borderColor = 'lightgreen';
    else if (count1 < count2)
        document.getElementById('display').style.borderColor = '#ff5c5c';
    else if (count1 == 0)
        document.getElementById('display').style.borderColor = 'rgb(165, 165, 165)';
    else
        document.getElementById('display').style.borderColor = '#f6f672';
}

// Whatsapp Message sender Function

document.querySelector(".Whatsapp").addEventListener('click', function () {
    var message = encodeURIComponent(str);
    window.open(`whatsapp://send?text=${message}`);
})



// Copy Function

let copy = document.querySelector("#copy");
copy.addEventListener('click',async function () {
    let input = document.querySelector("#display");
    await navigator.clipboard.writeText(input.value);
    copy.classList.add("active");
    setTimeout(function () {
        copy.classList.remove("active");
    }, 2000);
})

// Reset Function

document.getElementById("reset").addEventListener('click', function () {
    var present = document.getElementsByClassName('left');
    for (let one of present) {
        var leftID = one.id;
        var RightID = leftID.substring(0, 10) + 'R';
        one.setAttribute("is-present", 'none');
        document.getElementById(leftID).classList = "left";
        document.getElementById(RightID).classList = "right";
    }
    document.getElementById('display').value = '';
    document.getElementById('display').style.borderColor = 'rgb(165, 165, 165)';
    document.getElementById('markAbsent').checked = false;
    document.getElementById('popup').style.display = 'none';
    let section = document.getElementById("Section_Batch").value;
    if (section == 'PBT' || section == 'SBT7' || section == 'SBT8') {
        document.getElementById('subject').value = 'Training and Placement';
        return;
    }
    document.getElementById('subject').value = '';
});

// toggle Mark Others as Absentess.

var absent = document.getElementById('markAbsent');
var Absent_List = [];
absent.addEventListener('change', function () {
    var present = document.getElementsByClassName('left');
    if (absent.checked == true) {
        Absent_List = [];
        for (let one of present) {
            if (one.getAttribute("is-present") === 'none') {
                var leftID = one.id;
                var RightID = leftID.substring(0, 10) + 'R';
                Absent_List.push(leftID);
                one.setAttribute("is-present", false);
                document.getElementById(leftID).classList.remove('Active');
                document.getElementById(RightID).classList.remove('DeActive');
                document.getElementById(leftID).classList.add('DeActive');
                document.getElementById(RightID).classList.add('Active');
            }
        }
        display();
    }
    else {
        var i = 0;
        for (let one of present) {
            if (one.id == Absent_List[i]) {
                var leftID = one.id;
                var RightID = leftID.substring(0, 10) + 'R';
                one.setAttribute("is-present", 'none');
                document.getElementById(leftID).classList = "left";
                document.getElementById(RightID).classList = "right";
                i++;
            }
        }
        display();
    }
});


// Other Sessions or Classes

let select = document.getElementById("subject");
select.addEventListener('change', function () {
    if (select.value == 'other') document.getElementById('popup').style.display = 'block';
    else {
        document.getElementById('popup').style.display = 'none';
        document.getElementById('other').value = '';
    }
})
