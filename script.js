class FormBuilder {
    constructor() {
        this.isFormSubmitted = false;
        this.setupDraggable();
        this.setupDroppable();
        this.setupSortable();
        this.setupSubmitButton();
    }

    setupDraggable() {
        $(".draggable").draggable({
            helper: "clone"
        });
    }

    setupDroppable() {
        $(".droppable").droppable({
            accept: ".draggable",
            drop: (event, ui) => {
                const elementType = ui.helper.data("type");
                this.addFormElement(elementType, ui.position);
                this.updateSubmitButtonVisibility();
            }
        });
    }

    setupSortable() {
        $("#form-preview").sortable({
            connectWith: ".draggable, #form-preview",
            placeholder: "sortable-placeholder",
            forcePlaceholderSize: true,
            start: (event, ui) => {
                ui.placeholder.height(ui.helper.outerHeight());
            },
            update: (event, ui) => {
                this.updateSubmitButtonVisibility();
            }
        }).disableSelection();
    }

    setupSubmitButton() {
        $("#submit-btn").on("click", () => {
            if (!this.isFormSubmitted) {
                this.validateAndSubmitForm();
            }
        });
    }

    addFormElement(elementType, position) {
        let newElement;

        switch (elementType) {
            case 'name':
            case "text":
            case "email":
            case "number":
                newElement = $(`<div class='form-element'><label for='${elementType}'>${elementType.charAt(0).toUpperCase() + elementType.slice(1)}:</label><input type='${elementType}' id='${elementType}' /></div>`);
                break;
            case "phoneNumber":
                const phoneNumberLabel = 'PhoneNumber';
                if (!phoneNumberLabel) return;

                const userCountryCode = prompt("Enter your country code (e.g., +1, +44, +91):");
                if (!userCountryCode) return;

                newElement = $(`<div class='form-element'><label for='phoneNumber'>${phoneNumberLabel}:</label><input type='tel' id='phoneNumber' placeholder='${userCountryCode} 1234567890' /></div>`);
                break;

            // Add other cases as needed

            case "checkbox":
                const checkboxLabel = prompt("Enter checkbox label:");
                if (!checkboxLabel) return;
                const numberOfOptionsCheckbox = prompt("Enter the number of checkbox options:");
                newElement = $(`<div class='form-element'><label>${checkboxLabel}:</label></div>`);

                for (let i = 1; i <= numberOfOptionsCheckbox; i++) {
                    const optionLabelCheckbox = prompt(`Enter option ${i}:`);
                    if (!optionLabelCheckbox) return;
                    const checkboxId = `checkbox${i}`;
                    newElement.append(`<input type='checkbox' name='${checkboxLabel}' id='${checkboxId}'> <label for='${checkboxId}'>${optionLabelCheckbox}</label><br>`);
                }
                break;

            // Add other cases as we needed

            case "radio":
                const radioInputName = prompt("Enter radio button group name:");
                if (!radioInputName) return;
                const numberOfOptionsRadio = prompt("Enter the number of radio button options:");
                newElement = $(`<div class='form-element'><label>${radioInputName}:</label></div>`);

                for (let i = 1; i <= numberOfOptionsRadio; i++) {
                    const optionLabelRadio = prompt(`Enter option ${i}:`);
                    if (!optionLabelRadio) return;
                    newElement.append(`<input type='radio' name='${radioInputName}' id='radio${i}'> <label for='radio${i}'>${optionLabelRadio}</label><br>`);
                }
                break;

            // Add other cases as we needed 

            case "textarea":
                newElement = $("<div class='form-element'><label for='textarea'>Textarea:</label><textarea id='textarea'></textarea></div>");
                break;
            case "select":
                const selectName = prompt("Enter select dropdown name:");
                if (!selectName) return;
                const numberOfOptionsSelect = prompt("Enter the number of options for select dropdown:");
                newElement = $(`<div class='form-element'><label for='${selectName}'>${selectName}:</label><select id='${selectName}'></select></div>`);

                for (let i = 1; i <= numberOfOptionsSelect; i++) {
                    const optionLabelSelect = prompt(`Enter option ${i}:`);
                    if (!optionLabelSelect) return;
                    newElement.find("select").append(`<option value='${optionLabelSelect.trim()}'>${optionLabelSelect.trim()}</option>`);
                }
                break;
            case "date":
                newElement = $("<div class='form-element'><label for='date'>Date Input:</label><input type='date' id='date' /></div>");
                break;
        }

        const $existingElement = this.findElementByPosition(position);
        if ($existingElement) {
            if (position.top < $existingElement.offset().top + $existingElement.height() / 2) {
                $existingElement.before(newElement);
            } else {
                $existingElement.after(newElement);
            }
        } else {
            $("#form-preview").append(newElement);
        }
    }

    findElementByPosition(position) {
        const elements = $(".form-element");
        for (let i = 0; i < elements.length; i++) {
            const $element = $(elements[i]);
            const top = $element.offset().top;
            const bottom = top + $element.height();

            if (position.top >= top && position.top <= bottom) {
                return $element;
            }
        }
        return null;
    }

    updateSubmitButtonVisibility() {
        if ($("#form-preview").children(".form-element").length >= 0) {
            $("#submit-btn").show();
        } else {
            $("#submit-btn").hide();
        }
    }

    validateAndSubmitForm() {
        const formElements = {};
        let isValidForm = true;

        $(".form-element").each(function () {
            const elementType = $(this).find("input, textarea, select").prop("type");
            const elementId = $(this).find("input, textarea, select").prop("id");
            const elementValue = $(this).find("input, textarea, select").val();

            if (elementType === "email" && !isValidEmail(elementValue)) {
                alert("Invalid email address!");
                isValidForm = false;
                return false;
            }

            if (elementType === "tel" && !isValidPhoneNumber(elementValue)) {
                alert("Invalid phone number!");
                isValidForm = false;
                return false;
            }

            if (elementType === "text" && !isValidName(elementValue)) {
                alert("Invalid text!");
                isValidForm = false;
                return false;
            }

            if (elementType === "checkbox" && !$(this).find("input[type='checkbox']").prop("checked")) {
                alert("Please check the checkbox!");
                isValidForm = false;
                return false;
            }

            if (elementType === "radio" && !$(`input[name='${elementId}']:checked`).length) {
                alert("Please select a radio option!");
                isValidForm = false;
                return false;
            }

            if (elementType === "select" && !elementValue) {
                alert("Please select an option from the dropdown!");
                isValidForm = false;
                return false;
            }

            if (elementType === "date" && !isValidDate(elementValue)) {
                alert("Please select a valid date!");
                isValidForm = false;
                return false;
            }

            formElements[elementId] = {
                value: elementValue
            };
        });

        if (isValidForm) {
            console.log(formElements);
            alert('Form submitted successfully!');
            this.sendFormDataToServer(formElements);
        } else {
            alert('Warning! Please fill all the fields in the correct format 🙃');
        }
    }

    sendFormDataToServer(formData) {
        fetch('http://localhost:3000/user_form', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }
}

const formBuilder = new FormBuilder();

// Validation functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
}

function isValidDate(dateString) {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    return regex.test(dateString);
}

function isValidPhoneNumber(phoneNumber) {
    return /^\d+$/.test(phoneNumber.trim());
}

function isValidName(name) {
    const nameRegex = /^[a-zA-Z\s']+$/;
    return nameRegex.test(name.trim());
}