const className = document.getElementById('className');

const parameterList = document.getElementById('parameterList');
const methodsList = document.getElementById('methodsList');

const outputDiv = document.getElementById('outputDiv');
const outputTextArea = document.getElementById('output');
const copyButton = document.getElementById('copyText');


function createInputField(type, className, id, name, placeholder) {
    let inputField = document.createElement('input');
    inputField.type = type;
    inputField.className = className;
    inputField.id = id;
    inputField.name = name;
    inputField.placeholder = placeholder;

    return inputField;
}

function createButton(className, innerHTML) {
    let deleteButton = document.createElement('button');
    deleteButton.className = className;
    deleteButton.innerHTML = innerHTML;
    deleteButton.style = 'background-color: rgb(255, 0, 0); color:white;';

    return deleteButton;
}

function createMethodInput() {
    methodsList.appendChild(createInput('methodName', 'methodName', 'Methodenname', 'Bsp.: \'myFunction\'', false));
}

function addParameterInput() {
    parameterList.appendChild(createInput('parameterName', 'parameterName', 'Parametername', 'Bsp.: \'myParameter\'', true));
}

function createInput(id, name, placeholder, innerHTML, generateGetterAndSetter) {
    let listEntry = document.createElement('li');
    let rowDiv = document.createElement('div');
    rowDiv.className = 'row justify-content-center';

    let colDiv = document.createElement('div');
    colDiv.className = 'col-sm-4 p-2';

    let inputGroupDiv = document.createElement('div');
    inputGroupDiv.className = 'input-group mb-3';

    let inputGroupSpan = document.createElement('span');
    inputGroupSpan.className = 'input-group-text';
    inputGroupSpan.innerHTML = 'Parametername'

    let formFloatingDiv = document.createElement('div');
    formFloatingDiv.className = 'form-floating';

    let textInput = createInputField('text', 'form-control', id, name, placeholder);
    let textInputLabel = document.createElement('label');
    textInputLabel.htmlFor = 'parameterName';
    textInputLabel.innerHTML = innerHTML;

    let deleteButton = createButton('btn', 'Entfernen');
    deleteButton.addEventListener('click', function () {
        listEntry.remove();
    });

    formFloatingDiv.appendChild(textInput);
    formFloatingDiv.appendChild(textInputLabel);

    inputGroupDiv.appendChild(inputGroupSpan);
    inputGroupDiv.appendChild(formFloatingDiv);

    colDiv.appendChild(inputGroupDiv);
    rowDiv.appendChild(colDiv);

    listEntry.appendChild(rowDiv);

    if (generateGetterAndSetter) {
        listEntry.appendChild(createGetterAndSetterCheckbox());
        inputGroupDiv.appendChild(deleteButton)
    } else {
        inputGroupDiv.appendChild(deleteButton)
        colDiv.appendChild(document.createElement('hr'));
    }

    return listEntry;
}

function createGetterAndSetterCheckbox() {
    let rowCheckBoxDiv = document.createElement('div');
    rowCheckBoxDiv.className = 'row justify-content-center';

    let colCheckBoxDiv = document.createElement('div');
    colCheckBoxDiv.className = 'col-sm-4 p-2';

    let getterCheckboxDiv = document.createElement('div');
    getterCheckboxDiv.className = 'form-check form-switch form-check-inline';

    let getterCheckboxInput = createInputField('checkbox', 'form-check-input', 'getterCheckbox', 'generateGetter', '');
    getterCheckboxInput.checked = true;

    let getterCheckboxLabel = document.createElement('label');
    getterCheckboxLabel.className = 'form-check-label';
    getterCheckboxLabel.htmlFor = 'getterCheckbox';
    getterCheckboxLabel.innerHTML = 'getter?';

    let setterCheckboxDiv = document.createElement('div');
    setterCheckboxDiv.className = 'form-check form-switch form-check-inline';

    let setterCheckboxInput = createInputField('checkbox', 'form-check-input', 'setterCheckbox', 'generateSetter', '');
    setterCheckboxInput.checked = true;

    let setterCheckboxLabel = document.createElement('label');
    setterCheckboxLabel.className = 'form-check-label';
    setterCheckboxLabel.htmlFor = 'setterCheckbox';
    setterCheckboxLabel.innerHTML = 'setter?';

    let arrayCheckBoxDiv = document.createElement('div');
    arrayCheckBoxDiv.className = 'form-check form-switch form-check-inline';

    let arrayCheckBoxInput = createInputField('checkbox', 'form-check-input', 'arrayCheckBox', 'arrayCheckBox', '');
    arrayCheckBoxInput.checked = false;

    let arrayCheckboxLabel = document.createElement('label');
    arrayCheckboxLabel.className = 'form-check-label';
    arrayCheckboxLabel.htmlFor = 'arrayCheckBox';
    arrayCheckboxLabel.innerHTML = 'Array';

    getterCheckboxDiv.appendChild(getterCheckboxInput);
    getterCheckboxDiv.appendChild(getterCheckboxLabel);

    setterCheckboxDiv.appendChild(setterCheckboxInput);
    setterCheckboxDiv.appendChild(setterCheckboxLabel);

    arrayCheckBoxDiv.appendChild(arrayCheckBoxInput);
    arrayCheckBoxDiv.appendChild(arrayCheckboxLabel);

    colCheckBoxDiv.appendChild(getterCheckboxDiv);
    colCheckBoxDiv.appendChild(setterCheckboxDiv);
    colCheckBoxDiv.appendChild(arrayCheckBoxDiv);
    colCheckBoxDiv.appendChild(document.createElement('hr'));
    rowCheckBoxDiv.appendChild(colCheckBoxDiv);

    return rowCheckBoxDiv;
}

function generate() {
    if (className.value === '') {
        window.alert('Bitte geben Sie einen gültigen Klassennamen an!');
        return;
    }

    let constructor = '';
    let parameter = '';
    let getterAndSetter = '';
    let methods = '';
    let parameterConstructor = '';

    let generateContructor = false;

    for (let i = 0; i < document.getElementsByName('parameterName').length; i++) {
        if (document.getElementsByName('arrayCheckBox').item(i).checked) {
            parameterConstructor += '\t\t\t\tthis.' + document.getElementsByName('parameterName').item(i).value + ' = [];\n';
            generateContructor = true;
        }
    }

    if (generateContructor) {
        constructor += '\t\t\tconstructor : function() {\n' +
            parameterConstructor +
            '\t\t\t},\n\n'
    }

    for (let j = 0; j < document.getElementsByName('parameterName').length; j++) {
        if(document.getElementsByName('parameterName').item(j).value === '') {
            window.alert('Geben Sie einen gültigen Parameternamen an!');
            return;
        }

        parameter += '\t\t\t' + document.getElementsByName('parameterName').item(j).value + ': null,\n';

        let str = document.getElementsByName('parameterName').item(j).value;
        let strUpperCase = str.charAt(0).toUpperCase() + str.slice(1);

        if (document.getElementsByName('generateGetter').item(j).checked) {
            getterAndSetter += '\t\t\tget' + strUpperCase + ': function() {\n' +
                '\t\t\t\treturn this.' + str + ';\n' +
                '\t\t\t},\n';
        }
        if (document.getElementsByName('generateSetter').item(j).checked) {
            getterAndSetter += '\t\t\tset' + strUpperCase + ': function(' + str + ') {\n' +
                '\t\t\t\tthis.' + str + ' = ' + str + ';\n' +
                '\t\t\t},\n';
        }
    }

    for (let k = 0; k < document.getElementsByName('methodName').length; k++) {
        if(document.getElementsByName('methodName').item(k).value === '') {
            window.alert('Geben Sie einen gültigen Methodennamen an!');
            return;
        }

        methods += '\t\t\t' + document.getElementsByName('methodName').item(k).value + ' : function() {\n' +
            '\t\t\t\t\n' +
            '\t\t\t},\n'
    }

    let stringPartOne = 'define([\'tao/lib/stapes\'],\n' +
        '\tfunction(Stapes)\n' +
        '\t\t\'use strict\';\n' +
        '\t\tvar ' + className.value + ' = Stapes.subclass(/** @lends ' + className.value + '.prototype */{\n' +
        parameter + '\n' +
        constructor +
        methods +
        getterAndSetter;

    stringPartOne = stringPartOne.slice(0, -1);
    stringPartOne = stringPartOne.slice(0, -1);

    let stringPartTwo = '\n\t\t});\n\n' +
        '\t\treturn ' + className.value + ';\n' +
        '\t});';

    outputTextArea.value = stringPartOne + stringPartTwo;
    outputDiv.hidden = false;
}

function copy() {
    navigator.clipboard.writeText(outputTextArea.value).then(r => copyButton.innerHTML = 'Erledigt!');
    setTimeout(() => { copyButton.innerHTML = 'Kopieren'; }, 1000);
}

function download() {
    let element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(outputTextArea.value));
    element.setAttribute('download', className.value + '.js');

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}
