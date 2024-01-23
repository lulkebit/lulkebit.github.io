const className = document.getElementById("className");
const constructorCheckbox = document.getElementById("constructorCheckbox");

const parameterList = document.getElementById("parameterList");
const methodsList = document.getElementById("methodsList");

const outputDiv = document.getElementById("outputDiv");
const outputTextArea = document.getElementById("output");
const copyButton = document.getElementById("copyText");


function addParameter() {
    let listEntry = document.createElement("li");
    let rowInputDiv = document.createElement("div");
    rowInputDiv.className = "row justify-content-center";

    let colInputDiv = document.createElement("div");
    colInputDiv.className = "col-sm-4 p-2";

    let inputField = document.createElement("input");
    inputField.type = "text";
    inputField.id = "parameterName";
    inputField.name = "parameterName";
    inputField.placeholder = "Parametername";

    let deleteButton = document.createElement("button");
    deleteButton.className = "btn";
    deleteButton.innerHTML = "Entfernen";
    deleteButton.style = "background-color: rgb(255, 0, 0); color:white;";
    deleteButton.addEventListener("click", function () {
        listEntry.remove();
    });

    let rowCheckBoxDiv = document.createElement("div");
    rowCheckBoxDiv.className = "row justify-content-center";

    let colCheckBoxDiv = document.createElement("div");
    colCheckBoxDiv.className = "col-sm-4 p-2";

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

    colInputDiv.appendChild(inputField);
    rowInputDiv.appendChild(colInputDiv);

    getterCheckboxDiv.appendChild(getterCheckboxInput);
    getterCheckboxDiv.appendChild(getterCheckboxLabel);

    setterCheckboxDiv.appendChild(setterCheckboxInput);
    setterCheckboxDiv.appendChild(setterCheckboxLabel);

    arrayCheckBoxDiv.appendChild(arrayCheckBoxInput);
    arrayCheckBoxDiv.appendChild(arrayCheckboxLabel);

    colCheckBoxDiv.appendChild(getterCheckboxDiv);
    colCheckBoxDiv.appendChild(setterCheckboxDiv);
    colCheckBoxDiv.appendChild(arrayCheckBoxDiv);
    colCheckBoxDiv.appendChild(deleteButton);
    colCheckBoxDiv.appendChild(document.createElement("hr"));
    rowCheckBoxDiv.appendChild(colCheckBoxDiv);

    listEntry.appendChild(rowInputDiv);
    listEntry.appendChild(rowCheckBoxDiv);

    parameterList.appendChild(listEntry);
}

function addMethod() {
    let listEntry = document.createElement("li");
    let rowDiv = document.createElement("div");
    rowDiv.className = "row justify-content-center";

    let colDiv = document.createElement("div");
    colDiv.className = "col-sm-4 p-2";

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
        listEntry.remove();
    });

    colDiv.appendChild(inputField);
    colDiv.appendChild(deleteButton);
    colDiv.appendChild(document.createElement("hr"));

    rowDiv.appendChild(colDiv);

    listEntry.appendChild(rowDiv);

    methodsList.appendChild(listEntry);
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
