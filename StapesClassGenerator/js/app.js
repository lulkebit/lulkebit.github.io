const parameterList = document.getElementById("parameterList");
const methodsList = document.getElementById("methodsList");
const outputDiv = document.getElementById("outputDiv");
const outputTextArea = document.getElementById("output");
const className = document.getElementById("className");
const copyButton = document.getElementById("copyText");
const constructorCheckbox = document.getElementById("constructorCheckbox");

function addParameter() {
    let item = document.createElement("li");
    let divOne = document.createElement("div");
    divOne.className = "row justify-content-center";

    let divTwo = document.createElement("div");
    divTwo.className = "col-sm-4 p-2";

    let inputField = document.createElement("input");
    inputField.type = "text";
    inputField.id = "parameterName";
    inputField.name = "parameterName";
    inputField.placeholder = "Parametername";

    let deleteButton = document.createElement("button");
    deleteButton.className = "btn btn-danger";
    deleteButton.innerHTML = "Remove";
    deleteButton.addEventListener("click", function () {
        item.remove();
    });

    let divThree = document.createElement("div");
    divThree.className = "row justify-content-center";

    let divFour = document.createElement("div");
    divFour.className = "col-sm-4 p-2";

    let getterCheckboxDiv = document.createElement("div");
    getterCheckboxDiv.className = "form-check form-switch";

    let getterCheckboxInput = document.createElement("input");
    getterCheckboxInput.className = "form-check-input";
    getterCheckboxInput.type = "checkbox";
    getterCheckboxInput.id = "flexSwitchCheckChecked";
    getterCheckboxInput.name = "generateGetter";
    getterCheckboxInput.checked = true;

    let getterCheckboxLabel = document.createElement("label");
    getterCheckboxLabel.className = "form-check-label";
    getterCheckboxLabel.htmlFor = "flexSwitchCheckChecked";
    getterCheckboxLabel.innerHTML = "getter?";

    let setterCheckboxDiv = document.createElement("div");
    setterCheckboxDiv.className = "form-check form-switch";

    let setterCheckboxInput = document.createElement("input");
    setterCheckboxInput.className = "form-check-input";
    setterCheckboxInput.type = "checkbox";
    setterCheckboxInput.id = "flexSwitchCheckChecked";
    setterCheckboxInput.name = "generateSetter";
    setterCheckboxInput.checked = true;

    let setterCheckboxLabel = document.createElement("label");
    setterCheckboxLabel.className = "form-check-label";
    setterCheckboxLabel.htmlFor = "flexSwitchCheckChecked";
    setterCheckboxLabel.innerHTML = "setter?";

    divTwo.appendChild(inputField);
    divTwo.appendChild(deleteButton);
    divOne.appendChild(divTwo);

    getterCheckboxDiv.appendChild(getterCheckboxInput);
    getterCheckboxDiv.appendChild(getterCheckboxLabel);

    setterCheckboxDiv.appendChild(setterCheckboxInput);
    setterCheckboxDiv.appendChild(setterCheckboxLabel);

    divFour.appendChild(getterCheckboxDiv);
    divFour.appendChild(setterCheckboxDiv);
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
    deleteButton.className = "btn btn-danger";
    deleteButton.innerHTML = "Remove";
    deleteButton.addEventListener("click", function () {
        item.remove();
    });

    divTwo.appendChild(inputField);
    divTwo.appendChild(deleteButton);
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
        parameterList += document.getElementsByName("parameterName").item(i).value + ", ";
        parameterConstructor += "                this." + document.getElementsByName("parameterName").item(i).value + " = " + document.getElementsByName("parameterName").item(i).value + ";\n";
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

        if (document.getElementsByName("generateGetter").item(j).checked === true) {
            getterAndSetter += "            get" + strUpperCase + ": function() {\n" +
                "                return this." + str + ";\n" +
                "            },\n";
        }
        if (document.getElementsByName("generateSetter").item(j).checked === true) {
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
