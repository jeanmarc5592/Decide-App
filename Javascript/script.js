$(function() {
    // DOM OBJECT
     var DOM = {
        start : $('#start'),
        stepOne : $('#step1'),
        stepTwo : $('#step2'),
        stepThree : $('#step3'),
        stepFour : $('#step4'),
        stepFive : $('#step5'),
        startButton : $('#startbtn'),
        nextButtonOne : $('#nextbtn1'),
        nextButtonTwo : $('#nextbtn2'),
        nextButtonThree : $('#nextbtn3'),
        nextButtonFour : $('#nextbtn4'),
        addButton: $('#addbtn'),
        deleteButton: $('#delbtn'),
        newButton : $('#newbtn'),
        cancelButtons: $('#cancelbtn1, #cancelbtn2, #cancelbtn3, #cancelbtn4'),
        name : $('#inputName'),
        choiceOne : $('#inputChoiceOne'),
        choiceTwo : $('#inputChoiceTwo'),
        result: $('#resultLabel')
    };

        
    // DATA OBJECT
    var data = {
        decisionName: '',
        choiceOne: '',
        choiceTwo: '',
        factors: [ ],
        factorsImportances: [ ],
        choiceOneGrades: [ ],
        choiceTwoGrades: [ ],
        factorProductsOne: [ ],
        factorProductsTwo: [ ],
        sumChoiceOne: '',
        sumChoiceTwo: ''
    };

    
    // FUNCTIONS OBJECT
    var functions = {
        // FADE TO NEXT CARD
        fadeNext: function(current, next) {
            $(current).fadeOut('slow', function() {
                    $(next).fadeIn('slow');
            });
        },

        setDifferentBackground: function(parent) {
            $(parent).children('#rateFactor').filter(':odd').css('background-color', 'rgba(97, 90, 211, 0.3)');
        },
        // SAVE DATA IN LOCAL STORAGE
        setStorage: function() {
            localStorage.setItem('data', JSON.stringify(data));
        },
        // READ AND RETURN DATA FROM LOCAL STORAGE
        readStorage: function() {
            return JSON.parse(localStorage.getItem('data'));
        },
        // CLEAR LOCAL STORAGE 
        clearStorage : function() {
            window.location.reload();
            localStorage.removeItem('data');

        },
        // PUSH ALL STRING INPUTS INTO DATA OBJECT
        pushAllChildrenStrings: function(children, target) {
            $(children).each(function() {
                // Store each child inside the variable 'input'
                var input = $(this);
                // Save the value of each input inside the data-object if the values are not empty
                if(input.val() !== '') {
                    target.push(input.val());
                };
            });
        },
        // PUSH ALL NUMBER INPUTS INTO DATA OBJECT
        pushAllChildrenNumbers : function(children, target) {
            $(children).each(function() {
                // Store each child inside the variable 'input'
                var input = $(this);
                // Save the value of each input inside the data-object if the values are not empty
                if(input.val() !== '') {
                    target.push(parseFloat(input.val()));
                };
            });
        },
        // PUSH ALL GRADES OF CHOICE 1 AND CHOICE 2 INTO DATA OBJECT    
        pushAllGrades: function(current, next, children, target) {
            // Execute code only if the input values are not empty, greater than 0 and at least less equal than 10
            if($(children).val() !== '' && $(children).val() > 0 && $(children).val() <= 10) {
                // Fade to next card
                this.fadeNext(current, next);
                // Iterate through all factor-grades and push values into data-object
                this.pushAllChildrenNumbers(children, target);
            }
        },

        multiplier : function(rates, grades, result) {
            rates.forEach(function(element) {
                var index = rates.indexOf(element);
                var product = element*grades[index];
                result.push(product);
            });
        },

        summerize: function(arr) {
            var result = 0
            arr.forEach(function(item) {
              result += item;
            });
            return result;
          }
    };

    
    
    // ---------------------------
    // ------ CLICK EVENTS -------
    // ---------------------------
    
    // START --> STEP 1
    DOM.startButton.click(function() {
        functions.fadeNext(DOM.start, DOM.stepOne);
    });


    // STEP 1 --> STEP 2
    DOM.nextButtonOne.click(function() {
        // Execute the code only if the input values are not empty
        if(DOM.name.val() !== '' && DOM.choiceOne.val() !== '' && DOM.choiceTwo.val() !== '') {
            // Fade to next card
            functions.fadeNext(DOM.stepOne, DOM.stepTwo)
            // Store the decision name
            data.decisionName = DOM.name.val();
            // Store the choices 
            data.choiceOne = DOM.choiceOne.val();
            data.choiceTwo = DOM.choiceTwo.val();
            // Push data into localStorage
            functions.setStorage();
        };
        
    });

    
    // STEP 2 --> STEP 3
    DOM.nextButtonTwo.click(function() {
        // Execute code only if at least 1 factor is created and it's value is not empty
        if($('#factors-input').children().length >= 1 && $('#factors-input :input').val() !== '') {
            // Fade to next card
            functions.fadeNext(DOM.stepTwo, DOM.stepThree);
            // Iterate through all factors and push values into data-object
            functions.pushAllChildrenStrings('#factors-input :input', data.factors);
            // Push data into localStorage
            functions.setStorage();
            // Display the created factors to the next card (Data from localStorage)
            $(functions.readStorage().factors).each(function(index, element) {
                var newFactorRating = '<div id="rateFactor" class="card__factor u-flex-sp-between"><span class="card__paragraph">'+element+'</span><input id="inputRate" type="text" class="card__input card__input--number"></div>';
                $('#factors-rate').append(newFactorRating); 

            });
            // Display all factors with changing backgrounds (with changing backgrounds)
            functions.setDifferentBackground($('#factors-rate'));
        };
    }); 

    
    // STEP 3 --> STEP 4
    DOM.nextButtonThree.click(function() {
        // Execute code only if the inputs are not empty, greater than 0, less equal than 10 and a number-value
        if($('#factors-rate :input').val() !== '' && $('#factors-rate :input').val() > 0 && $('#factors-rate :input').val() <= 10 && !isNaN($('#factors-rate :input').val())) {
            // Fade to next card
            functions.fadeNext(DOM.stepThree, DOM.stepFour);
            // Iterate through all factors and push rate-values into data-object
            functions.pushAllChildrenNumbers('#factors-rate :input', data.factorsImportances);
            // Push data into localStorage
            functions.setStorage();
            // Update Labels of "Choice 1" & "Choice 2"   
            $('#choiceOneLabel').text(functions.readStorage().choiceOne);
            $('#choiceTwoLabel').text(functions.readStorage().choiceTwo);
            // Display the created factors to the next card (Data from localStorage)
            $(functions.readStorage().factors).each(function(index, element) {
                var newFactorRating1 = '<div id="gradeFactor1" class="card__factor u-flex-sp-between"><span class="card__paragraph">'+element+'</span><input id="inputRate" type="text" class="card__input card__input--number"></div>'
                $('#factors-grade1').append(newFactorRating1);
                var newFactorRating2 = '<div id="gradeFactor2" class="card__factor u-flex-sp-between"><span class="card__paragraph">'+element+'</span><input id="inputRate" type="text" class="card__input card__input--number"></div>'
                $('#factors-grade2').append(newFactorRating2);
            });
            // Display all factors with changing backgrounds (with changing backgrounds)
            functions.setDifferentBackground($('#factors-grade1'));
            functions.setDifferentBackground($('#factors-grade2'));
        };
    });

    
    // STEP 4 --> STEP 5
    DOM.nextButtonFour.click(function() {
        // Invoke pushAllGrades() for each Choice
        functions.pushAllGrades(DOM.stepFour, DOM.stepFive, '#factors-grade1 :input', data.choiceOneGrades);
        functions.pushAllGrades(DOM.stepFour, DOM.stepFive, '#factors-grade2 :input', data.choiceTwoGrades);
        // Push data into localStorage
        functions.setStorage();
            
        // CALCULATION
        // 1. Multiply each factor rate with each grade of the corresponding grade (same index in both arrays)
        functions.multiplier(data.factorsImportances, data.choiceOneGrades, data.factorProductsOne);
        functions.multiplier(data.factorsImportances, data.choiceTwoGrades, data.factorProductsTwo);
        // 3. Sum all values of each new array
        data.sumChoiceOne = functions.summerize(data.factorProductsOne, data.sumChoiceOne);
        data.sumChoiceTwo = functions.summerize(data.factorProductsTwo, data.sumChoiceTwo);
        console.log(data.sumChoiceOne, data.sumChoiceTwo);
        // 4. Compare the two sum arrays and determine the highest sum 
        if(data.sumChoiceOne > data.sumChoiceTwo) {
            // Display ChoiceOne in the UI
            DOM.result.text(data.choiceOne);
        } else {
            // Display ChoiceTwo in the UI
            DOM.result.text(data.choiceTwo);
        };
    });

    
    // STEP 5 --> NEW DECISION
    DOM.newButton.click(function() {
        functions.clearStorage();
    });

    // CANCEL WHOLE PROCESS (CLEAR LOCALSTORAGE)
    DOM.cancelButtons.click(function() {
        functions.clearStorage(); 
     });
    
    
    // ADD NEW FACTORS
    DOM.addButton.click(function() {
        // Create a new factor
        var newFactor = '<input id="inputFactor" type="text" class="card__input card__input--text">';
        // Append it to it's parent 
        $('#factors-input').append(newFactor);
    });

    // DELETE FACTORS 
    DOM.deleteButton.click(function() {
        // Only remove children if there are more than 1 factors displayed
        if($('#factors-input').children().length > 1) {
            $('#factors-input').children().last().remove();
        }
    });



});




