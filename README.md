# JQuery_Drag-Drop_form
# Dynamic Form Builder

## Overview
Dynamic Form Builder is a JavaScript program that allows users to create forms dynamically using a drag-and-drop interface. The program utilizes a local JSON file (db2.json) as a storage solution for form data, enabling data persistence even after page refresh.

## Features
- **Form Builder:** Intuitive drag-and-drop interface for creating dynamic forms.
- **JSON Storage:** Form data is stored in the local db2.json file, providing a simple database solution.
- **Validation:** Ensures that the form input is valid before submission.
- **Deletion:** Users can easily remove form elements from the builder.
- **Logging:** Data entered into the form is logged to the console for tracking and debugging.

## Getting Started
1. Clone the repository to your local machine.
2. Run `npm install` to install the necessary dependencies.
3. Start the JSON server using `npm run json:server:form`.
4. Open the `index.html` file in your web browser to access the form builder.

## Usage
- Drag and drop form elements from the left sidebar to the form preview.
- Customize each form element by providing labels, options, or additional information.
- Validate the form input before submission.
- Delete unwanted form elements using the provided delete button.

## Dependencies
- jQuery: Used for drag-and-drop functionality.


## Acknowledgments
- Inspired by the need for a simple and dynamic form creation tool.
