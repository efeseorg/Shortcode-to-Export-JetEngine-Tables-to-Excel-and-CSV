# Shortcode to Export JetEngine Tables to Excel and CSV

This code is a script used to add interactive functionalities to a dynamic table generated with JetEngine on a WordPress website. The script allows showing/hiding table columns and exporting the table to CSV or Excel. Here's a step-by-step explanation of what each part of the code does and what you need to do to make it work correctly on your website.

## 1. Include External Library

The script includes the xlsx library from a CDN. This library is necessary to export the table to Excel format.

* **Requirement:** Ensure you have an internet connection to load this library.

## 2. Dynamically Create CSS Styles

The script dynamically creates a set of CSS styles and adds them to the document. These styles are necessary to format a modal used to select the visible columns of the table.

## 3. Dynamically Create a Modal

The script creates an HTML modal and adds it to the body of the document. This modal contains a list of checkboxes that allow the user to show or hide specific table columns.

## 4. Select Table Columns

* The script selects all header cells of the table and generates a checkbox for each column.
* **Requirement:** The table must have specific classes for each column, following the format `jet-dynamic-table__col--name`.

## 5. Show/Hide Columns

The `toggleColumns` function shows or hides table columns based on the state of the checkboxes.

## 6. Modal Event Handling

* The script handles the opening and closing of the modal using buttons and click events.
* **Requirement:** Add a button in the HTML with the ID `open-modal` to open the modal.

## 7. Export Table to CSV

* The `exportTableToCSV` function allows exporting the table to a CSV file.
* **Requirement:** Add a button in the HTML with the ID `exportCSV` to activate CSV export.

## 8. Export Table to Excel

* The `exportTableToExcel` function allows exporting the table to an Excel file.
* **Requirement:** Add a button in the HTML with the ID `exportExcel` to activate Excel export.

## 9. Initialize Column Visibility

The `toggleColumns` function is executed when the page loads to ensure that the columns have the correct initial visibility.

## 10. Handle Table Changes After AJAX

The script listens for AJAX complete events to re-apply column visibility in case the table is updated dynamically.

## Implementation Steps

1.  **Include the xlsx Library:** Make sure to include the xlsx script in the `<head>` of your document.
    ```html
    <script src="[https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.16.9/xlsx.full.min.js](https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.16.9/xlsx.full.min.js)"></script>
    ```
2.  **Add the Main Script:** Add the main script within `<script>` tags at the end of your HTML file, just before the closing `</body>` tag.
3.  **Add Buttons in the HTML:**
    * Button to Open the Modal:
        ```html
        <button id="open-modal">Configure Columns</button>
        ```
    * Button to Export to CSV:
        ```html
        <button id="exportCSV">Export to CSV</button>
        ```
    * Button to Export to Excel:
        ```html
        <button id="exportExcel">Export to Excel</button>
        ```
4.  **Ensure the Table Has the Correct Classes:** Verify that the columns of your table have classes following the format `jet-dynamic-table__col--name`.
5.  **Verify Internet Connection:** Ensure your website has internet access to load the xlsx library from the CDN.

By following these steps, you should be able to fully implement and use this script on your WordPress website to manage column visibility and data export from a dynamic table created with JetEngine.
