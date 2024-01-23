const className = document.getElementById("className");
const constructorCheckbox = document.getElementById("constructorCheckbox");

const parameterList = document.getElementById("parameterList");
const methodsList = document.getElementById("methodsList");

const outputDiv = document.getElementById("outputDiv");
const outputTextArea = document.getElementById("output");
const copyButton = document.getElementById("copyText");


function addParameter() {
    let item = document.createElement("li");
    let divOne = document.createElement("div");
    divOne.className = "row justify-content-center";

    let divTwo = document.createElement("div");
    divTwo.className = "col-sm-4 p-2";

    let inputField = document.createElement("input");
    inputField.type = "text";
    inputField.style = "padding-right: 15px;";
    inputField.id = "parameterName";
    inputField.name = "parameterName";
    inputField.placeholder = "Parametername";

    let deleteButton = document.createElement("button");
    deleteButton.className = "btn";
    deleteButton.innerHTML = "Entfernen";
    deleteButton.style = "background-color: rgb(255, 0, 0); color:white;";
    deleteButton.addEventListener("click", function () {
        item.remove();
    });

    let divThree = document.createElement("div");
    divThree.className = "row justify-content-center";

    let divFour = document.createElement("div");
    divFour.className = "col-sm-4 p-2";

    let getterCheckboxDiv = document.createElement("div");
    getterCheckboxDiv.className = "form-check form-switch form-check-inline";

    let getterCheckboxInput = document.createElement("input");
    getterCheckboxInput.className = "form-check-input";
    getterCheckboxInput.type = "checkbox";
    getterCheckboxInput.id = "getterCheckbox";
    getterCheckboxInput.name = "generateGetter";
    getterCheckboxInput.checked = true;

    let getterCheckboxLabel = document.createElement("label");
    getterCheckboxLabel.className = "form-check-label";
    getterCheckboxLabel.htmlFor = "getterCheckbox";
    getterCheckboxLabel.innerHTML = "getter?";

    let setterCheckboxDiv = document.createElement("div");
    setterCheckboxDiv.className = "form-check form-switch form-check-inline";

    let setterCheckboxInput = document.createElement("input");
    setterCheckboxInput.className = "form-check-input";
    setterCheckboxInput.type = "checkbox";
    setterCheckboxInput.id = "setterCheckbox";
    setterCheckboxInput.name = "generateSetter";
    setterCheckboxInput.checked = true;

    let setterCheckboxLabel = document.createElement("label");
    setterCheckboxLabel.className = "form-check-label";
    setterCheckboxLabel.htmlFor = "setterCheckbox";
    setterCheckboxLabel.innerHTML = "setter?";

    let arrayCheckBoxDiv = document.createElement("div");
    arrayCheckBoxDiv.className = "form-check form-switch form-check-inline";

    let arrayCheckBoxInput = document.createElement("input");
    arrayCheckBoxInput.className = "form-check-input";
    arrayCheckBoxInput.type = "checkbox";
    arrayCheckBoxInput.id = "arrayCheckBox";
    arrayCheckBoxInput.name = "arrayCheckBox";
    arrayCheckBoxInput.checked = false;

    let arrayCheckboxLabel = document.createElement("label");
    arrayCheckboxLabel.className = "form-check-label";
    arrayCheckboxLabel.htmlFor = "arrayCheckBox";
    arrayCheckboxLabel.innerHTML = "Array";

    divTwo.appendChild(inputField);
    divOne.appendChild(divTwo);

    getterCheckboxDiv.appendChild(getterCheckboxInput);
    getterCheckboxDiv.appendChild(getterCheckboxLabel);

    setterCheckboxDiv.appendChild(setterCheckboxInput);
    setterCheckboxDiv.appendChild(setterCheckboxLabel);

    arrayCheckBoxDiv.appendChild(arrayCheckBoxInput);
    arrayCheckBoxDiv.appendChild(arrayCheckboxLabel);

    divFour.appendChild(getterCheckboxDiv);
    divFour.appendChild(setterCheckboxDiv);
    divFour.appendChild(arrayCheckBoxDiv);
    divFour.appendChild(deleteButton);
    divFour.appendChild(document.createElement("hr"));
    divThree.appendChild(divFour);

    item.appendChild(divOne);
    item.appendChild(divThree);
    parameterList.appendChild(item);
}

function addMethod() {
    let item = document.createElement("li");
    let divOne = document.createElement("div");
    divOne.className = "row justify-content-center";

    let divTwo = document.createElement("div");
    divTwo.className = "col-sm-4 p-2";

    let inputField = document.createElement("input");
    inputField.type = "text";
    inputField.id = "methodName";
    inputField.name = "methodName";
    inputField.placeholder = "Methodenname";

    let deleteButton = document.createElement("button");
    deleteButton.className = "btn";
    deleteButton.innerHTML = "Entfernen";
    deleteButton.style = "background-color: rgb(255, 0, 0); color:white;";
    deleteButton.addEventListener("click", function () {
        item.remove();
    });

    divTwo.appendChild(inputField);
    divTwo.appendChild(deleteButton);
    divTwo.appendChild(document.createElement("hr"));
    divOne.appendChild(divTwo);
    item.appendChild(divOne);
    methodsList.appendChild(item);
}

function generate() {
    if (className.value === "") {
        window.alert("Bitte geben Sie einen gültigen Klassennamen an!");
        return;
    }

    let constructor = "";
    let parameter = "";
    let getterAndSetter = "";
    let methods = "";
    let parameterList = "";
    let parameterConstructor = "";

    for (let i = 0; i < document.getElementsByName("parameterName").length; i++) {
        if (!document.getElementsByName("arrayCheckBox").item(i).checked) {
            parameterList += document.getElementsByName("parameterName").item(i).value + ", ";
            parameterConstructor += "                this." + document.getElementsByName("parameterName").item(i).value + " = " + document.getElementsByName("parameterName").item(i).value + ";\n";
        } else {
            parameterConstructor += "                this." + document.getElementsByName("parameterName").item(i).value + " = [];\n";
        }
    }

    parameterList = parameterList.slice(0, -1);
    parameterList = parameterList.slice(0, -1);

    if (constructorCheckbox.checked === true) {
        constructor += "            constructor : function(" + parameterList + ") {\n" +
            parameterConstructor +
            "            },\n\n"
    }

    for (let j = 0; j < document.getElementsByName("parameterName").length; j++) {
        if(document.getElementsByName("parameterName").item(j).value === "") {
            window.alert("Geben Sie einen gültigen Parameternamen an!");
            return;
        }

        parameter += "            " + document.getElementsByName("parameterName").item(j).value + ": null,\n";

        let str = document.getElementsByName("parameterName").item(j).value;
        let strUpperCase = str.charAt(0).toUpperCase() + str.slice(1);

        if (document.getElementsByName("generateGetter").item(j).checked) {
            getterAndSetter += "            get" + strUpperCase + ": function() {\n" +
                "                return this." + str + ";\n" +
                "            },\n";
        }
        if (document.getElementsByName("generateSetter").item(j).checked) {
            getterAndSetter += "            set" + strUpperCase + ": function(" + str + ") {\n" +
                "                this." + str + " = " + str + ";\n" +
                "            },\n";
        }
    }

    for (let k = 0; k < document.getElementsByName("methodName").length; k++) {
        if(document.getElementsByName("methodName").item(k).value === "") {
            window.alert("Geben Sie einen gültigen Methodennamen an!");
            return;
        }

        methods += "            " + document.getElementsByName("methodName").item(k).value + " : function() {\n" +
            "                \n" +
            "            },\n"
    }

    let stringPartOne = "define(['tao/lib/stapes'],\n" +
        "    function(Stapes)\n" +
        "        'use strict';\n" +
        "        var " + className.value + " = Stapes.subclass(/** @lends " + className.value + ".prototype */{\n" +
        parameter + "\n" +
        constructor +
        methods +
        getterAndSetter;

    stringPartOne = stringPartOne.slice(0, -1);
    stringPartOne = stringPartOne.slice(0, -1);

    let stringPartTwo = "\n       });\n\n" +
        "       return " + className.value + ";\n" +
        "   });";

    outputTextArea.value = stringPartOne + stringPartTwo;
    outputDiv.hidden = false;
}

function copy() {
    navigator.clipboard.writeText(outputTextArea.value).then(r => copyButton.innerHTML = "Erledigt!");
    setTimeout(() => { copyButton.innerHTML = "Kopieren"; }, 1000);
}

function download() {
    let element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(outputTextArea.value));
    element.setAttribute('download', "output");

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}
