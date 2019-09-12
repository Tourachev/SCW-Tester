const electron = require('electron');

$(document).ready(function () {
    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
        $(this).toggleClass('active');
    });
});

$(document).ready(function () {
    $('div.privacyAct').fadeIn(2000).removeClass('hidden');
});

$(document).ready(function () {
    $('.fadeIn').fadeIn(1000).removeClass('hidden');
});

$(document).ready(function () {
    $('.fadeInLater').fadeIn(2000).removeClass('hidden');
});

$('#acceptPrivacy').click(function(){
    electron.ipcRenderer.send('acceptPrivacyAct');
  });

$('#declinePrivacy').click(function(){
    electron.ipcRenderer.send('declinePrivacyAct');
});

// -------------------------TIMER---------------------------------------------------------
var timeDone = false;

function startTimer(duration, display) {
    var timer = duration, minutes, seconds;
    setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = minutes + ":" + seconds;

        if (--timer == -1 && timeDone == false) {
            $('#submitButton').click();
            $('#submitButton').fadeOut();
        }
    }, 1000);
}


//-------------------------NAVBAR-SWITCH-ON-BUTTONS------------------------------------------------
$('#navHomeButton').click(function(){
    $('#testContent').fadeOut(400);
    $('#learnContent').fadeOut(400);
    $('#docuContent').fadeOut(400);
    $('#leftNavSeabee').fadeOut(400);

    setTimeout( function() {
        $('#seabee').fadeIn();
        $('#leftHeader').fadeIn();      
    },
    400);
    

    $('#navTestButton').removeClass('activeNew');
    $('#navLearnButton').removeClass('activeNew');
    $('#navDocButton').removeClass('activeNew');
});

$('#navTestButton').click(function(){

    $('#learnContent').fadeOut(400);
    $('#docuContent').fadeOut(400);
    $('#seabee').fadeOut(400);
    $('#leftHeader').fadeOut(400);

    setTimeout( function() {
        $('#testContent').fadeIn();
        $('#leftNavSeabee').fadeIn(); 
    },
    400);

    $('#navTestButton').addClass('activeNew');
    $('#navLearnButton').removeClass('activeNew');
    $('#navDocButton').removeClass('activeNew');
});

$('#navLearnButton').click(function(){
    $('#testContent').fadeOut(400);
    $('#docuContent').fadeOut(400);
    $('#seabee').fadeOut(400);
    $('#leftHeader').fadeOut(400);

    setTimeout( function() {
        $('#leftNavSeabee').fadeIn();
        $('#learnContent').fadeIn();
    },
    400);

    $('#navTestButton').removeClass('activeNew');
    $('#navLearnButton').addClass('activeNew');
    $('#navDocButton').removeClass('activeNew');
});

$('#navDocButton').click(function(){
    $('#testContent').fadeOut(400);
    $('#learnContent').fadeOut(400);
    $('#seabee').fadeOut(400);
    $('#leftHeader').fadeOut(400);

    setTimeout( function() {
        $('#leftNavSeabee').fadeIn();
        $('#docuContent').fadeIn();
    },
    400);

    $('#navTestButton').removeClass('activeNew');
    $('#navLearnButton').removeClass('activeNew');
    $('#navDocButton').addClass('activeNew');
});

$('#navAboutButton').click(function(){
    $('#aboutModal').modal('toggle');
});

$('#closeAboutButton').click(function(){
    $('#aboutModal').modal('hide')
});


$('#navContactButton').click(function(){
    $('#aboutModal').modal('toggle');
});

$('#navContactButton').click(function(){
    $('#aboutModal').modal('hide');
});

/*-----------------Dropdown Menu-----------------*/
$('.dropdown').click(function () {
    $(this).attr('tabindex', 1).focus();
    $(this).toggleClass('active');
    $(this).find('.dropdown-menu').slideToggle(300);
});
$('.dropdown').focusout(function () {
    $(this).removeClass('active');
    $(this).find('.dropdown-menu').slideUp(300);
});
$('.dropdown .dropdown-menu li').click(function () {
    $(this).parents('.dropdown').find('span').text($(this).text());
    $(this).parents('.dropdown').find('input').attr('value', $(this).attr('id'));
});

//-------------------------------QUIZ BUTTONS---------------------------------------------

// $('.dropdown-menu li').click(function () {
//     var time = $('.dropdown-menu li').parents('.dropdown').find('input').val();
//   }); 


$('#generate').click(function(){
    $('#submitButton').toggleClass('invisible',1000);
    $('#timer').toggleClass('invisible',1000);
    $('#generate').fadeOut(200);
    $('#testParameters').fadeOut(200);

    var time = $('#timeDropdown li').parents('.dropdown').find('input').val();
    if(time == 0) time=1; //Set to 1 if user did not select jack

    var sixtyMinutes =  time * 60,
    display = document.querySelector('#time');
    startTimer(sixtyMinutes, display);

    var numQuestions = $('#questionsDropdown li').parents('.dropdown').find('input').val();
    if(numQuestions == 0) numQuestions=2; //Set to 1 if user did not select jack
    
    constructTest(numQuestions);
})

$('#generate').click(function(){
    
});

//------------------------------------QUIZ LOGIC BELLOW-------------------------------------

// Scramble questions:
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}  

const container = document.getElementById('accordion');
const resultsContainer = document.getElementById('results');

function constructTest (numQuestions){
    electron.ipcRenderer.send('generate'),    
    electron.ipcRenderer.on("resultSent", function questionGen(evt, result){
        console.log(result);

        result = result.slice(0,numQuestions);  
        console.log(result);
        console.log(numQuestions);
        result = shuffle(result);
        
        result.forEach((result, idx) => {
            // Construct card content
            const content = 
                `<div class="card darkFont">
                    <div class="card-header" id="heading-${idx}">
                        <h5>Question ${idx+1}: ${result.Question}</h5>
                    </div>
                    <div id="collapse-${idx}" class="collapse show" aria-labelledby="heading-${idx}" data-parent="#accordion">
                        <div class="card-body answers">
                            <ul>
                                <div class="input-group-text ">
                                    <input type="radio" name="question${result.QID}" value="${result.Ans1}" >  &nbsp ${result.Ans1} 
                                </div>
                                <div class="input-group-text ">
                                    <input type="radio" name="question${result.QID}" value="${result.Ans2}" > &nbsp ${result.Ans2}
                                </div>
                                <div class="input-group-text ">
                                    <input type="radio" name="question${result.QID}" value="${result.Ans3}" > &nbsp ${result.Ans3} 
                                </div>
                                <div class="input-group-text ">
                                    <input type="radio" name="question${result.QID}" value="${result.Ans4}" > &nbsp ${result.Ans4}
                                </div>
                            </ul>
                        </div>
                    </div>
                </div>`
            // Append newyly created card element to the container
            container.innerHTML += content;
        })
        $('#submitButton').click(function(){
            showResults(result)
            timeDone = true;
            $('#timer').addClass('invisible',1000);
        })
    });
}

function showResults(result) {
    const answerContainers = container.querySelectorAll(".answers");
    let numCorrect = 0;
    
    // for each question...
    result.forEach((result, idx) => {

        var answerContainer = answerContainers[idx];
        var selector = `input[name=question${result.QID}]:checked:enabled`;

        var userAnswer = (answerContainer.querySelector(selector)|| {}).value;

        if (userAnswer == result.Correct) {
            // add to the number of correct answers
            numCorrect++;
            answerContainers[idx].style.background = '#CAE7B9';
        } else {
            answerContainers[idx].style.background = "#EEA79C";
        }
    });

    const resultCard = `<div class="card">
                            <div class="card-header">
                                Your Results:
                            </div>
                            <div class="card-body darkFont">
                                <h5 class="card-title">That wasn't so hard, was it?</h5>
                                <p class="card-text darkFont">You got ${numCorrect} questions correct!</p>
                            </div>
                        </div>`;

    // show number of correct answers out of total
    resultsContainer.innerHTML += resultCard;
  }

