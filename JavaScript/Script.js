import { data } from '../Data/data.js';

const select = document.getElementById("Section_Batch");
const subject = document.getElementById('subject');
const popup = document.getElementById('popup');
const swh = document.getElementById('switch');
const copy = document.querySelector("#copy");
let section = select.value;
let AI = true;
let str = '';
let count1 = 0;
let count2 = 0;
let str1 = '';
let str2 = '';

generate();

select.addEventListener('change', function () {
    section = select.value;
    document.getElementById("section").innerText = select.options[select.selectedIndex].text;
    document.getElementById('display').value = '';
    document.getElementById('display').style.borderColor = 'rgb(165, 165, 165)';
    subject.value = '';
    document.getElementById('switch').checked = false;
    document.getElementById('popup').style.display = 'none';
    AI = section === 'AI';
    if (section === 'PBT' || section === 'SBT') {
        subject.value = 'Training and Placement';
    }
    generate();
})

subject.addEventListener("change",function(){
    if (subject.value === 'other') 
        popup.style.display = 'block';
	else {
		popup.style.display = 'none';
		document.getElementById('other').value = '';
	}
    display();
})

swh.addEventListener("change", function () {
    generate();
});

function generate() {
    var parent = document.querySelector(".data");
    let content = "";
    parent.innerHTML = "";
    if (swh.checked === false) {
        for (let one of data) {
            if (AI || one.Section == section) {
                content += `
                <div class="tab">
                    <p><span>Roll Number :</span>${one.Id}</p>
                    <p><span>Name :</span>${one.Name}</p>
                    <div class="Attendance green" id=${one.Id}  is-present="true" ><p>Present</p></div> 
                </div>
                `
            }
        }
    } else {
        for (let one of data) {
            if (AI || one.Section == section) {
                content += `
                <div class="tab">
                    <p><span>Roll Number :</span>${one.Id}</p>
                    <p><span>Name :</span>${one.Name}</p>
                    <div class="Attendance red" id=${one.Id}  is-present="false" ><p>Absent</p></div> 
                </div>
                `
            }
        }
    }
    parent.innerHTML = content;
    display();
    const tabs = document.querySelectorAll(".Attendance");
    tabs.forEach((tab) => {
        tab.addEventListener("click", function () {
            const isPresent = tab.getAttribute("is-present") === "true";
            const colorClass = isPresent ? "red" : "green";
            const text = isPresent ? "Absent" : "Present";
            tab.classList.toggle("green", !isPresent);
            tab.classList.toggle("red", isPresent);
            tab.setAttribute("is-present", String(!isPresent));
            tab.innerHTML = `<p>${text}</p>`;
            display();
        });
    });
}

// Function Display()

function display() {
	str = '';
	str1 = '';
	str2 = '';
	count1 = 0;
	count2 = 0;

	let subject;

	const present = document.querySelectorAll('.Attendance');

	for (let one of present) {
		if (one.getAttribute('is-present') === 'true') {
			if (one.id.substring(0, 3) === '209') {
				str1 += one.id.substring(8, 10) + ', ';
				count1++;
			} else {
				str1 += 'LE' + one.id.substring(8, 10) + ', ';
				count1++;
			}
		} else if (one.getAttribute('is-present') === 'false') {
			if (one.id.substring(0, 3) === '209') {
				str2 += one.id.substring(8, 10) + ', ';
				count2++;
			} else {
				str2 += 'LE' + one.id.substring(8, 10) + ', ';
				count2++;
			}
		}
	}

	str1 = str1.slice(0, -2);
	str2 = str2.slice(0, -2);

	const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
	const currentDate = new Date().toLocaleDateString('en-US', options);

	str += document.getElementById('section').innerText + ' ( IV year ) Attendance \n';

	if (count1 == 1) {
		str += 'Presentees (' + count1 + '  Member)\n';
	} else {
		str += 'Presentees (' + count1 + '  Members)\n';
	}

	str += str1 + '\n';

	if (count2 == 1) {
		str += 'Absentees (' + count2 + '  Member)\n';
	} else {
		str += 'Absentees (' + count2 + '  Members)\n';
	}

	str += str2 + '\n';

	const select = document.getElementById('subject');
	subject = select.value;

	select.addEventListener('change', (event) => {
		subject = select.value;
	});

	if (subject == 'other') {
		subject = document.getElementById('other').value;
	}

	str += 'in ' + subject + ' on ' + currentDate + '\n';

	document.getElementById('display').value = str;

	//Display border color 
	switch (true) {
		case (count1 > count2):
			document.getElementById('display').style.borderColor = 'lightgreen';
			break;
		case (count1 < count2):
			document.getElementById('display').style.borderColor = '#ff5c5c';
			break;
		case (count1 == 0):
			document.getElementById('display').style.borderColor = 'rgb(165, 165, 165)';
			break;
		default:
			document.getElementById('display').style.borderColor = '#f6f672';
			break;
	}
}

// Whatsapp Message sender Function

document.querySelector(".Whatsapp").addEventListener('click', function () {
	var message = encodeURIComponent(str);
	window.open(`whatsapp://send?text=${message}`);
})

// Copy Function

copy.addEventListener('click', async () => {
	const input = document.querySelector("#display");
	await navigator.clipboard.writeText(input.value);

	copy.classList.add("active");

	setTimeout(() => {
		copy.classList.remove("active");
	}, 2000);
});


// Reset Function

document.getElementById("reset").addEventListener('click', function () {
	const present = document.querySelectorAll('.Attendance');
	const switchStatus = document.getElementById('switch').checked;
	for (let one of present) {
		if(switchStatus ==  false){
			one.setAttribute("is-present", 'true');
			one.classList = "Attendance green";
			one.lastChild.innerHTML = "Present";
		} else {
			one.setAttribute("is-present", 'false');
			one.classList = "Attendance red";
			one.lastChild.innerHTML = "Absent";
		}
	}
	document.getElementById('display').value = '';
	document.getElementById('display').style.borderColor = 'rgb(165, 165, 165)';
	document.getElementById('switch').checked = switchStatus;
	document.getElementById('popup').style.display = 'none';
	display();
});
